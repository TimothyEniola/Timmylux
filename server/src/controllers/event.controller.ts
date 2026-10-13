import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import prisma from '../config/database';
import * as paymentService from '../services/payment.service';

type TicketPrize = { number: string; prize: string; imageUrl?: string };

const reservationSweepTimestamps = new Map<string, number>();
const RESERVATION_SWEEP_INTERVAL_MS = 60 * 1000;

const getTicketPrizes = (value: unknown): TicketPrize[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is TicketPrize => Boolean(item && typeof item.number === 'string' && typeof item.prize === 'string'))
    .map((item) => ({
      number: item.number.trim(),
      prize: item.prize.trim(),
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl.trim() : '',
    }));
};

const getEventBoundary = (date: Date | null, time: string | null, fallback: string) => {
  if (!date) return null;
  const day = date.toISOString().slice(0, 10);
  const normalizedTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(time || '') ? time : fallback;
  const boundary = new Date(`${day}T${normalizedTime}:00+01:00`).getTime();
  return Number.isFinite(boundary) ? boundary : null;
};

const isEventOpen = (
  event: { isActive: boolean; startDate: Date | null; startTime: string | null; endDate: Date | null; endTime: string | null },
  now = Date.now()
) => {
  if (!event.isActive) return false;
  const start = getEventBoundary(event.startDate, event.startTime, '00:00');
  const end = getEventBoundary(event.endDate, event.endTime, '23:59');
  return (start === null || now >= start) && (end === null || now <= end);
};

const normalizeEventData = (body: any) => {
  const ticketPrizes = getTicketPrizes(body.ticketPrizes).map(({ number, prize, imageUrl }) => ({
    number: number.trim(),
    prize: prize.trim(),
    imageUrl: imageUrl || '',
  }));
  const numbers = ticketPrizes.map(({ number }) => number.trim());
  const type = String(body.type || 'promo');
  const isTicketedEvent = type === 'raffle' || type === 'game';
  const ticketPrice = Number(body.ticketPrice);
  if (numbers.some((number) => !number) || ticketPrizes.some(({ prize }) => !prize) || new Set(numbers).size !== numbers.length) {
    throw new Error('Game ticket numbers must be unique and cannot be blank.');
  }
  if (ticketPrizes.some(({ imageUrl }) => imageUrl && !/^https?:\/\//i.test(imageUrl))) {
    throw new Error('Prize images must be valid http or https URLs.');
  }
  if (isTicketedEvent && (!Number.isFinite(ticketPrice) || Math.round(ticketPrice * 100) < 1 || !ticketPrizes.length)) {
    throw new Error('A ticket game needs a price of at least ₦0.01 and at least one numbered prize.');
  }
  if (type === 'game' && ticketPrizes.length > 100) {
    throw new Error('A Game event can have no more than 100 numbers.');
  }
  if (type === 'game' && ticketPrizes.some(({ number }, index) => number !== String(index + 1))) {
    throw new Error('Game ticket numbers must be assigned sequentially from 1.');
  }
  if (body.gameEnabled && !isTicketedEvent) {
    throw new Error('Online ticket sales can only be enabled for a ticketed event.');
  }
  const participatingLocationIds = type === 'game' && body.branchEnabled && Array.isArray(body.participatingLocationIds)
    ? [...new Set(body.participatingLocationIds.map((id: unknown) => String(id).trim()).filter(Boolean))]
    : [];
  const participatingLocations = type === 'game' && body.branchEnabled && Array.isArray(body.participatingLocations)
    ? body.participatingLocations
      .filter((location: any) => location && participatingLocationIds.includes(String(location.id)))
      .map((location: any) => ({
        id: String(location.id),
        name: String(location.name || '').trim().slice(0, 100),
        address: String(location.address || '').trim().slice(0, 300),
        phone: String(location.phone || '').trim().slice(0, 40),
        hours: String(location.hours || '').trim().slice(0, 120),
        isOpen: Boolean(location.isOpen),
        mapUrl: /^https?:\/\//i.test(String(location.mapUrl || '')) ? String(location.mapUrl).slice(0, 500) : '',
      }))
      .filter((location: any) => location.name && location.address)
    : [];
  if (type === 'game' && body.branchEnabled && (!participatingLocationIds.length || participatingLocations.length !== participatingLocationIds.length)) {
    throw new Error('Choose at least one valid participating branch for this game.');
  }
  if (type === 'game' && !body.gameEnabled && !body.branchEnabled) {
    throw new Error('Enable online play, branch play, or both for this game.');
  }
  const targetUrl = String(body.targetUrl || '').trim();
  if (targetUrl && !targetUrl.startsWith('/') && !/^https?:\/\//i.test(targetUrl)) {
    throw new Error('Event links must be a site path or an http(s) URL.');
  }
  if (targetUrl.startsWith('//')) {
    throw new Error('Event links must not start with //');
  }

  return {
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    type,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
    startTime: body.startTime || null,
    endTime: body.endTime || null,
    location: body.location || null,
    image: body.image || null,
    isActive: body.isActive !== false,
    gameEnabled: Boolean(body.gameEnabled),
    branchEnabled: type === 'game' && Boolean(body.branchEnabled),
    participatingLocationIds: type === 'game' ? participatingLocationIds : [],
    participatingLocations: participatingLocations as any,
    ticketPrice: isTicketedEvent ? Math.round(ticketPrice * 100) / 100 : null,
    ticketPrizes: ticketPrizes as any,
    discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : null,
    promoCode: body.promoCode || null,
    maxAttendees: body.maxAttendees ? Number.parseInt(body.maxAttendees, 10) : null,
    contactInfo: body.contactInfo || null,
    targetUrl: targetUrl || null,
  };
};

const releaseExpiredReservations = async (eventId: string) => {
  const now = Date.now();
  if (now - (reservationSweepTimestamps.get(eventId) || 0) < RESERVATION_SWEEP_INTERVAL_MS) return;
  reservationSweepTimestamps.set(eventId, now);

  const expired = await prisma.eventTicket.findMany({
    where: { eventId, status: 'RESERVED', expiresAt: { lt: new Date() }, reference: { not: null } },
    select: { reference: true },
    take: 5,
  });
  const references = [...new Set(expired.map(({ reference }) => reference).filter((reference): reference is string => Boolean(reference)))];

  for (const reference of references) {
    try {
      const tickets = await prisma.eventTicket.findMany({ where: { reference, status: 'RESERVED' } });
      if (!tickets.length) continue;
      const payment = await paymentService.verifyPayment(reference);
      const expectedAmount = tickets.reduce((total, ticket) => total + ticket.amount, 0);
      if (payment.status === 'success' && payment.reference === reference && payment.currency === 'NGN' && payment.amount === expectedAmount) {
        await prisma.eventTicket.updateMany({ where: { reference, status: 'RESERVED' }, data: { status: 'PAID', expiresAt: null } });
      } else if (['failed', 'abandoned'].includes(payment.status)) {
        await prisma.eventTicket.deleteMany({ where: { reference, status: 'RESERVED' } });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        await prisma.eventTicket.deleteMany({ where: { reference, status: 'RESERVED' } });
      }
      // Keep expired tickets reserved when Paystack cannot confirm their final status.
    }
  }
};

const toPublicEvent = (event: any) => {
  const publicEvent = { ...event };
  delete publicEvent.ticketPrizes;
  return {
    ...publicEvent,
    startDate: event.startDate?.toISOString().slice(0, 10) || null,
    endDate: event.endDate?.toISOString().slice(0, 10) || null,
  };
};

export const getPublicEvents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'desc' },
    });
    res.json({ success: true, data: events.map(toPublicEvent) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.query;
    const events = await prisma.event.findMany({
      where: isActive !== undefined ? { isActive: isActive === 'true' } : undefined,
      include: { _count: { select: { tickets: true } } },
      orderBy: { startDate: 'desc' },
    });
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = normalizeEventData(req.body);
    if (!data.title || !data.description) {
      res.status(400).json({ success: false, message: 'Event title and description are required.' });
      return;
    }
    const event = await prisma.event.create({ data, include: { _count: { select: { tickets: true } } } });
    res.status(201).json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = normalizeEventData(req.body);
    if (!data.title || !data.description) {
      res.status(400).json({ success: false, message: 'Event title and description are required.' });
      return;
    }
    const existingEvent = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existingEvent) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }
    const ticketCount = await prisma.eventTicket.count({ where: { eventId: existingEvent.id } });
    const existingTicketPrizes = getTicketPrizes(existingEvent.ticketPrizes);
    const ticketPrizesChanged = JSON.stringify(data.ticketPrizes) !== JSON.stringify(existingTicketPrizes);
    if (ticketCount && (
      data.type !== existingEvent.type ||
      data.ticketPrice !== existingEvent.ticketPrice ||
      ticketPrizesChanged
    )) {
      res.status(409).json({ success: false, message: 'Ticket price, ticket numbers, prizes, and event type cannot be changed after ticket reservations or sales. Deactivate this event and create a new one.' });
      return;
    }
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data,
      include: { _count: { select: { tickets: true } } },
    });
    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketCount = await prisma.eventTicket.count({ where: { eventId: req.params.id } });
    if (ticketCount) {
      res.status(409).json({ success: false, message: 'Events with ticket sales cannot be deleted. Deactivate the event instead.' });
      return;
    }
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await prisma.event.findFirst({
      where: { id: req.params.id, type: { in: ['raffle', 'game'] } },
    });
    if (!event) {
      res.status(404).json({ success: false, message: 'This ticket game is unavailable.' });
      return;
    }
    await releaseExpiredReservations(event.id);
    const tickets = await prisma.eventTicket.findMany({
      where: {
        eventId: event.id,
        OR: [{ status: 'PAID' }, { status: 'RESERVED' }],
      },
      select: { number: true },
    });
    res.json({
      success: true,
      data: {
        event: {
          ...toPublicEvent(event),
          isCurrentlyOpen: isEventOpen(event),
          isOpenForTickets: isEventOpen(event) && Boolean(event.gameEnabled),
        },
        ticketNumbers: getTicketPrizes(event.ticketPrizes).map(({ number }) => number),
        unavailableNumbers: tickets.map(({ number }) => number),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const initializeTicketPayment = async (req: Request, res: Response): Promise<void> => {
  const reference = `TML-EVT-${randomUUID()}`;
  try {
    const { name, email, phone, numbers } = req.body;
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPhone = String(phone || '').trim();
    const selectedNumbers = Array.isArray(numbers) ? [...new Set(numbers.map((number: unknown) => String(number).trim()))] : [];
    if (!normalizedName || normalizedName.length > 100 || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || normalizedEmail.length > 254 || normalizedPhone.length > 40 || !selectedNumbers.length || selectedNumbers.length > 10) {
      res.status(400).json({ success: false, message: 'Enter your name, a valid email, and select 1 to 10 ticket numbers.' });
      return;
    }

    const event = await prisma.event.findFirst({
      where: { id: req.params.id, type: { in: ['raffle', 'game'] }, isActive: true, gameEnabled: true },
    });
    if (!event || !event.ticketPrice || !event.ticketPrizes) {
      res.status(404).json({ success: false, message: 'Online ticket sales are unavailable for this game.' });
      return;
    }
    if (!isEventOpen(event)) {
      res.status(410).json({ success: false, message: 'Ticket sales for this game are not currently open.' });
      return;
    }
    await releaseExpiredReservations(event.id);
    const prizeMap = new Map(getTicketPrizes(event.ticketPrizes).map((ticket) => [ticket.number.trim(), ticket]));
    if (selectedNumbers.some((number) => !prizeMap.has(number))) {
      res.status(400).json({ success: false, message: 'One or more selected ticket numbers are invalid.' });
      return;
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const amount = Math.round(event.ticketPrice * 100);
    await prisma.$transaction(async (transaction) => {
      await transaction.eventTicket.createMany({
        data: selectedNumbers.map((number) => {
          const prizeInfo = prizeMap.get(number)!;
          return {
            eventId: event.id,
            number,
            prize: prizeInfo.prize,
            prizeImage: prizeInfo.imageUrl || null,
            customerName: normalizedName,
            customerEmail: normalizedEmail,
            customerPhone: normalizedPhone || null,
            amount,
            paymentMethod: 'PAYSTACK',
            reference,
            expiresAt,
          };
        }),
      });
    });

    const payment = await paymentService.initializePayment(
      normalizedEmail,
      (amount * selectedNumbers.length) / 100,
      reference,
      `${(process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')}/events/${event.id}?reference=${encodeURIComponent(reference)}`
    );
    res.json({ success: true, data: { paymentUrl: payment.authorization_url, reference } });
  } catch (error: any) {
    res.status(error.code === 'P2002' ? 409 : 400).json({
      success: false,
      message: error.code === 'P2002' ? 'A selected number was just taken. Refresh and choose another.' : error.message,
    });
  }
};

export const verifyTicketPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference } = req.params;
    const tickets = await prisma.eventTicket.findMany({ where: { reference } });
    if (!tickets.length) {
      res.status(404).json({ success: false, message: 'Ticket reservation was not found.' });
      return;
    }
    if (tickets.every(({ status }) => status === 'PAID')) {
      res.json({
        success: true,
        data: {
          status: 'success',
          numbers: tickets.map(({ number }) => number),
          tickets: tickets.map(({ number, prize, prizeImage }) => ({ number, prize, prizeImage })),
        },
      });
      return;
    }

    const payment = await paymentService.verifyPayment(reference);
    const expectedAmount = tickets.reduce((total, ticket) => total + ticket.amount, 0);
    if (payment.reference !== reference || payment.currency !== 'NGN' || payment.amount !== expectedAmount) {
      res.status(400).json({ success: false, message: 'Paystack payment details do not match the ticket reservation. Contact support with your reference.' });
      return;
    }
    if (payment.status !== 'success') {
      if (['failed', 'abandoned'].includes(payment.status)) {
        await prisma.eventTicket.deleteMany({ where: { reference, status: 'RESERVED' } });
      }
      res.status(400).json({ success: false, message: 'Paystack has not confirmed the full ticket payment yet. Check again shortly.' });
      return;
    }
    await prisma.eventTicket.updateMany({
      where: { reference, status: 'RESERVED' },
      data: { status: 'PAID', expiresAt: null },
    });
    const confirmedTickets = await prisma.eventTicket.findMany({ where: { reference, status: 'PAID' } });
    if (confirmedTickets.length !== tickets.length) {
      res.status(409).json({ success: false, message: 'The ticket reservation expired before payment confirmation. Contact support with your Paystack reference.' });
      return;
    }
    res.json({
      success: true,
      data: {
        status: 'success',
        numbers: confirmedTickets.map(({ number }) => number),
        tickets: confirmedTickets.map(({ number, prize, prizeImage }) => ({ number, prize, prizeImage })),
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const recordBranchTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { number, name, email, phone } = req.body;
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPhone = String(phone || '').trim();
    const normalizedNumber = String(number || '').trim();
    const event = await prisma.event.findFirst({
      where: { id: req.params.id, type: { in: ['raffle', 'game'] }, isActive: true },
    });
    if (!event || !event.ticketPrice || !event.ticketPrizes) {
      res.status(404).json({ success: false, message: 'This ticket game is unavailable.' });
      return;
    }
    if (!isEventOpen(event)) {
      res.status(410).json({ success: false, message: 'Ticket sales for this game are not currently open.' });
      return;
    }
    await releaseExpiredReservations(event.id);
    const branchId = String(req.body.branchId || '').trim();
    const participatingIds = event.participatingLocationIds || [];
    if (event.type === 'game' && (!event.branchEnabled || !branchId || !participatingIds.includes(branchId))) {
      res.status(400).json({ success: false, message: 'Select a participating branch before recording this ticket.' });
      return;
    }
    await prisma.eventTicket.deleteMany({
      where: { eventId: event.id, status: 'RESERVED', expiresAt: { lt: new Date() } },
    });
    const prize = getTicketPrizes(event.ticketPrizes).find((ticket) => ticket.number.trim() === normalizedNumber);
    if (!prize || !normalizedName || normalizedName.length > 100 || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || normalizedEmail.length > 254 || normalizedPhone.length > 40) {
      res.status(400).json({ success: false, message: 'Enter a valid ticket number, customer name, and email.' });
      return;
    }
    const ticket = await prisma.eventTicket.create({
      data: {
        eventId: event.id,
        number: prize.number.trim(),
        prize: prize.prize.trim(),
        prizeImage: prize.imageUrl || null,
        customerName: normalizedName,
        customerEmail: normalizedEmail,
        customerPhone: normalizedPhone || null,
        amount: Math.round(event.ticketPrice * 100),
        paymentMethod: 'BRANCH',
        status: 'PAID',
        branchId: event.type === 'game' ? branchId : null,
        branchName: event.type === 'game'
          ? (Array.isArray(event.participatingLocations)
            ? (event.participatingLocations as Array<{ id: string; name: string }>).find((location) => location.id === branchId)?.name || null
            : null)
          : null,
      },
    });
    res.status(201).json({
      success: true,
      data: { id: ticket.id, number: ticket.number, prize: ticket.prize, prizeImage: ticket.prizeImage, branchId: ticket.branchId, branchName: ticket.branchName },
    });
  } catch (error: any) {
    res.status(error.code === 'P2002' ? 409 : 400).json({
      success: false,
      message: error.code === 'P2002' ? 'That number has already been sold or reserved.' : error.message,
    });
  }
};

export const getEventTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await prisma.eventTicket.findMany({
      where: {
        eventId: req.params.id,
        OR: [{ status: 'PAID' }, { status: 'RESERVED', expiresAt: { gt: new Date() } }],
      },
      select: { id: true, number: true, prize: true, prizeImage: true, customerName: true, customerEmail: true, customerPhone: true, paymentMethod: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};