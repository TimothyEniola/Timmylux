import { Request, Response } from 'express';
import { verifyPaystackSignature } from '../services/payment.service';
import * as orderService from '../services/order.service';
import prisma from '../config/database';

export const paystackWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;

    if (!signature) {
      res.status(400).json({ success: false, message: 'No signature' });
      return;
    }

    const payload = (req as Request & { rawBody?: string }).rawBody || JSON.stringify(req.body);
    const isValid = verifyPaystackSignature(payload, signature);

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    const event = req.body;

    // Handle charge success
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const tickets = await prisma.eventTicket.findMany({ where: { reference } });
      if (tickets.length) {
        const totalAmount = tickets.reduce((total, ticket) => total + ticket.amount, 0);
        if (event.data.currency !== 'NGN' || event.data.amount !== totalAmount) {
          res.status(400).json({ success: false, message: 'Ticket payment amount does not match.' });
          return;
        }
        await prisma.eventTicket.updateMany({
          where: { reference, status: 'RESERVED' },
          data: { status: 'PAID', expiresAt: null },
        });
        console.log(`Payment confirmed for ${tickets.length} event ticket(s): ${reference}`);
      } else {
        await orderService.updatePaymentStatus(reference, 'PAID');
        console.log(`Payment confirmed for order: ${reference}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};