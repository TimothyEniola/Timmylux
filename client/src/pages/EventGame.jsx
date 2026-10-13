import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, MapPin, Ticket } from "lucide-react";
import { apiRequest } from "../utils/api";
import { readStoredArray } from "../utils/storage";

function formatEventDate(date, time) {
  if (!date) return null;
  const parsed = new Date(`${date}T${time || "00:00"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toLocaleString();
}

export default function EventGame() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [event, setEvent] = useState(null);
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [unavailableNumbers, setUnavailableNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadGame = useCallback(async ({ signal } = {}) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiRequest(`/events/${id}/game`, { signal });
      if (signal?.aborted) return;
      setEvent(data.event);
      setTicketNumbers(data.ticketNumbers);
      setUnavailableNumbers(data.unavailableNumbers);
      if (reference) {
        const verification = await apiRequest(`/events/tickets/verify/${encodeURIComponent(reference)}`, { signal });
        if (signal?.aborted) return;
        setReceipt(verification.data);
      } else {
        setReceipt(null);
      }
    } catch (requestError) {
      if (signal?.aborted) return;
      const localEvent = readStoredArray("adminEvents").find((item) => String(item.id) === String(id));
      if (localEvent) {
        const storedTickets = readStoredArray("adminEventTickets").filter((ticket) => String(ticket.eventId) === String(id));
        const prizeMap = new Map((Array.isArray(localEvent.ticketPrizes) ? localEvent.ticketPrizes : []).map((item) => [String(item.number), { prize: item.prize || "Prize pending", imageUrl: item.imageUrl || "" }]));
        const totalNumbers = Number(localEvent.totalNumbers) || Math.max((Array.isArray(localEvent.ticketPrizes) ? localEvent.ticketPrizes.length : 0), 1);
        const localTicketNumbers = Array.from({ length: totalNumbers }, (_, index) => String(index + 1));
        setEvent({ ...localEvent, isOpenForTickets: true, isCurrentlyOpen: true, gameEnabled: Boolean(localEvent.gameEnabled || localEvent.onlineEnabled), participatingLocations: Array.isArray(localEvent.participatingLocations) ? localEvent.participatingLocations : [] });
        setTicketNumbers(localTicketNumbers);
        setUnavailableNumbers(storedTickets.map((ticket) => String(ticket.number)));
        const savedReceipts = readStoredArray("localGameReceipts");
        const matchingReceipt = reference
          ? savedReceipts.find((receiptRecord) => String(receiptRecord.eventId) === String(id) && String(receiptRecord.reference) === String(reference))
          : null;
        setReceipt(matchingReceipt ? {
          tickets: matchingReceipt.tickets,
          customer: matchingReceipt.customer,
          reference: matchingReceipt.reference,
          createdAt: matchingReceipt.createdAt,
        } : null);
        return;
      }
      setError(requestError.message);
      if (reference) setReceipt(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [id, reference]);

  useEffect(() => {
    const controller = new AbortController();
    loadGame({ signal: controller.signal });
    return () => controller.abort();
  }, [loadGame]);

  const toggleNumber = (number) => {
    setSelectedNumbers((current) => current.includes(number)
      ? current.filter((selected) => selected !== number)
      : current.length < 10 ? [...current, number] : current);
    setError("");
  };

  const buyTickets = async (submitEvent) => {
    submitEvent.preventDefault();
    if (!event?.isOpenForTickets || submitting || !selectedNumbers.length) return;
    setSubmitting(true);
    setError("");

    const localEvent = readStoredArray("adminEvents").find((item) => String(item.id) === String(id));
    if (localEvent) {
      const prizeMap = new Map((Array.isArray(localEvent.ticketPrizes) ? localEvent.ticketPrizes : []).map((item) => [String(item.number), { prize: item.prize || "Prize pending", imageUrl: item.imageUrl || "" }]));
      const nextSales = readStoredArray("adminEventTickets");
      const usedNumbers = new Set(nextSales.filter((ticket) => String(ticket.eventId) === String(id)).map((ticket) => String(ticket.number)));
      const validNumbers = selectedNumbers.filter((number) => !usedNumbers.has(String(number)));

      if (!validNumbers.length) {
        setSubmitting(false);
        setError("These numbers have already been purchased. Please select another one.");
        return;
      }

      const referenceCode = `local-${Date.now()}`;
      const tickets = validNumbers.map((number) => {
        const prizeInfo = prizeMap.get(String(number)) || { prize: "Prize pending", imageUrl: "" };
        return {
          number,
          prize: prizeInfo.prize,
          prizeImage: prizeInfo.imageUrl || "",
        };
      });
      const receiptPayload = {
        eventId: String(id),
        reference: referenceCode,
        tickets,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        createdAt: new Date().toISOString(),
      };

      const savedReceipts = readStoredArray("localGameReceipts");
      window.localStorage.setItem("localGameReceipts", JSON.stringify([receiptPayload, ...savedReceipts]));
      window.localStorage.setItem("adminEventTickets", JSON.stringify([
        ...nextSales,
        ...validNumbers.map((number) => {
          const prizeInfo = prizeMap.get(String(number)) || { prize: "Prize pending", imageUrl: "" };
          return {
            eventId: String(id),
            number,
            prize: prizeInfo.prize,
            prizeImage: prizeInfo.imageUrl || "",
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            paymentMethod: "LOCAL",
            status: "PAID",
            createdAt: new Date().toISOString(),
          };
        }),
      ]));

      setUnavailableNumbers((current) => [...new Set([...current, ...validNumbers.map(String)])]);
      setSelectedNumbers([]);
      setReceipt({
        tickets,
        reference: referenceCode,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        createdAt: new Date().toISOString(),
      });
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await apiRequest(`/events/${id}/tickets/initialize`, {
        method: "POST",
        body: { ...customer, numbers: selectedNumbers },
      });
      window.location.assign(data.paymentUrl);
    } catch (requestError) {
      setSubmitting(false);
      if (requestError.status === 409) {
        setSelectedNumbers([]);
        await loadGame();
      }
      setError(requestError.message);
    }
  };

  if (loading) {
    return <main className="container-custom py-16 text-center text-gray-600" aria-live="polite">Loading game details…</main>;
  }

  if (!event) {
    return (
      <main className="container-custom max-w-3xl py-16">
        <Link to="/#events" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-primary"><ArrowLeft size={16} /> Back to events</Link>
        <div role="alert" className="mt-6 border border-red-200 bg-red-50 p-5 text-red-800">{error || "This ticket game is unavailable."}</div>
      </main>
    );
  }

  const isPaidGame = event.type === "game";
  const price = Number(event.ticketPrice) || 0;
  const total = price * selectedNumbers.length;
  const participatingBranches = Array.isArray(event.participatingLocations) ? event.participatingLocations : [];
  const startAt = formatEventDate(event.startDate, event.startTime);
  const endAt = formatEventDate(event.endDate, event.endTime);
  const hasOnlineSales = Boolean(event.gameEnabled);
  const isOpenForTickets = Boolean(event.isOpenForTickets);
  const receiptCustomer = receipt?.customer || customer;

  return (
    <main className="container-custom max-w-6xl py-8 sm:py-12">
      <Link to="/#events" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-primary"><ArrowLeft size={16} /> Back to events</Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
        <section className="h-fit border-t-2 border-primary bg-white p-5 shadow-sm sm:p-7">
          {event.image && <img src={event.image} alt="" className="mb-6 aspect-[16/8] w-full object-cover" />}
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary"><Ticket size={16} aria-hidden="true" />Game</div>
          <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{event.title}</h1>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">{event.description}</p>
          <p className="mt-5 inline-flex items-baseline gap-2 border border-primary/30 bg-primary/5 px-4 py-3 text-navy">
            <span className="text-xl font-bold">₦{price.toLocaleString()}</span><span className="text-sm">per ticket</span>
          </p>

          {(startAt || endAt) && (
            <div className="mt-5 space-y-2 text-sm text-gray-600">
              {startAt && <p className="flex items-center gap-2"><Clock3 size={15} aria-hidden="true" />Starts {startAt}</p>}
              {endAt && <p className="flex items-center gap-2"><Clock3 size={15} aria-hidden="true" />Ends {endAt}</p>}
            </div>
          )}

          {isPaidGame && event.branchEnabled && (
            <div className="mt-7 border-t border-gray-200 pt-5">
              <h2 className="font-semibold text-navy">{event.isCurrentlyOpen ? "Pay and play at a participating branch" : "Participating branches"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{event.isCurrentlyOpen ? "Pay the ticket price at the branch. A team member will confirm your payment, assign an available number, and reveal its prize—there is no additional charge for the prize." : "Ticket sales are not currently open. Check the event dates before visiting a branch to play."}</p>
              {participatingBranches.length ? (
                <ul className="mt-4 space-y-3">
                {participatingBranches.map((branch) => (
                    <li key={branch.id} className="border border-gray-200 p-4">
                      <h3 className="flex items-center gap-2 font-semibold text-navy"><MapPin size={16} className="text-primary" aria-hidden="true" />{branch.name}</h3>
                      <p className={`mt-1 text-xs font-semibold ${branch.isOpen ? "text-emerald-700" : "text-red-700"}`}>{branch.isOpen ? "Open now" : "Currently closed"}</p>
                      <p className="mt-2 text-sm text-gray-600">{branch.address}</p>
                      {branch.phone && <a href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`} className="mt-2 block text-sm text-navy underline">{branch.phone}</a>}
                      {branch.hours && <p className="mt-2 text-sm text-gray-600">Hours: {branch.hours}</p>}
                      {branch.mapUrl && <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy underline">Get directions <ExternalLink size={14} aria-hidden="true" /></a>}
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-sm text-amber-800">Branch details are not available yet. Please contact TimmyLux before visiting.</p>}
              {event.contactInfo && <p className="mt-3 text-sm text-gray-600">Questions? {event.contactInfo}</p>}
            </div>
          )}

          {!isPaidGame && (
            <div className="mt-7 border-t border-gray-200 pt-5">
              <h2 className="font-semibold text-navy">Play at a branch</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">Visit a nearby branch, pay for your ticket, and choose an available number. The prize belongs to you at no extra charge.</p>
              <Link to={`/locations?game=${encodeURIComponent(event.id)}&title=${encodeURIComponent(event.title)}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy underline"><MapPin size={15} aria-hidden="true" /> Find a nearby branch</Link>
              {event.contactInfo && <p className="mt-2 text-sm text-gray-600">Questions? {event.contactInfo}</p>}
            </div>
          )}
          {!isPaidGame && event.location && <p className="mt-5 flex items-center gap-2 text-sm text-gray-600"><MapPin size={15} aria-hidden="true" />{event.location}</p>}
          <p className="mt-6 border-l-2 border-primary bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">Pay only for your ticket. The prize assigned to your number is yours at no extra charge.</p>
        </section>

        <section className="h-fit border-t-2 border-navy bg-white p-5 shadow-sm sm:p-7">
          {receipt ? (
            <div className="py-5 text-center">
              <CheckCircle2 className="mx-auto text-emerald-600" size={42} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-navy">Ticket payment confirmed</h2>
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left text-sm text-emerald-900">
                <p><span className="font-semibold">Customer:</span> {receiptCustomer.name || "Customer"}</p>
                <p><span className="font-semibold">Email:</span> {receiptCustomer.email || "Not provided"}</p>
                {receiptCustomer.phone && <p><span className="font-semibold">Phone:</span> {receiptCustomer.phone}</p>}
                {receipt?.reference && <p><span className="font-semibold">Receipt ref:</span> {receipt.reference}</p>}
              </div>
              <p className="mt-2 text-sm text-gray-600">Your paid ticket{receipt.tickets?.length === 1 ? " has" : "s have"} revealed:</p>
              <div className="mt-4 space-y-3 text-left">
                {(receipt.tickets || []).map((ticket) => (
                  <div key={ticket.number} className="border border-emerald-200 bg-emerald-50 p-4">
                    {ticket.prizeImage && <img src={ticket.prizeImage} alt={`Prize for ticket ${ticket.number}`} className="mb-3 h-28 w-full rounded-lg object-cover" />}
                    <p className="text-sm text-gray-700">Ticket number <strong>{ticket.number}</strong></p>
                    <p className="mt-1 text-lg font-bold text-navy">Prize: {ticket.prize}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => window.print()} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Print claim receipt</button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">Keep this confirmation for your records. Collect your prize at a participating branch or contact the event team to arrange delivery.</p>
              {event.contactInfo && <p className="mt-2 text-sm text-gray-600">Questions? {event.contactInfo}</p>}
            </div>
          ) : reference ? (
            <div className="py-5 text-center">
              <h2 className="text-xl font-bold text-navy">Checking your payment</h2>
              <p role="status" aria-live="polite" className="mt-3 text-sm text-gray-600">{error || "Paystack is confirming your ticket payment."}</p>
              <p className="mt-2 text-xs text-gray-500">Do not start another payment for these ticket numbers.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <button type="button" onClick={loadGame} className="font-semibold text-navy underline">Check again</button>
                <Link to={isPaidGame ? `/games/${id}` : `/events/${id}`} className="font-semibold text-navy underline">Return to available tickets</Link>
              </div>
            </div>
          ) : hasOnlineSales ? (
            <>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-navy">Choose your number</h2>
                  <p className="mt-1 text-sm text-gray-600">₦{price.toLocaleString()} per ticket · select up to 10</p>
                </div>
                <button type="button" onClick={loadGame} className="shrink-0 text-sm font-semibold text-navy underline">Refresh availability</button>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5" aria-label="Available ticket numbers">
                {ticketNumbers.map((number) => {
                  const unavailable = unavailableNumbers.includes(number);
                  const selected = selectedNumbers.includes(number);
                  return (
                    <button
                      key={number}
                      type="button"
                      disabled={unavailable || !isOpenForTickets || submitting}
                      onClick={() => toggleNumber(number)}
                      aria-pressed={selected}
                      aria-label={`Number ${number}${unavailable ? ", already sold or reserved" : selected ? ", selected" : ", available"}`}
                      className={`aspect-square min-h-11 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${unavailable ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through" : selected ? "border-navy bg-navy text-white" : "border-gray-300 bg-white text-navy hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"}`}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>

              {!isOpenForTickets && <p role="status" className="mt-4 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Online ticket sales are not currently open for this game.</p>}
              {error && <p role="alert" aria-live="assertive" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

              {isOpenForTickets && (
                <form onSubmit={buyTickets} className="mt-6 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Your name
                    <input required autoComplete="name" maxLength={100} value={customer.name} onChange={(e) => setCustomer((current) => ({ ...current, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">Email for your receipt
                    <input required type="email" autoComplete="email" maxLength={254} value={customer.email} onChange={(e) => setCustomer((current) => ({ ...current, email: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">Phone (optional)
                    <input type="tel" autoComplete="tel" maxLength={40} value={customer.phone} onChange={(e) => setCustomer((current) => ({ ...current, phone: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                  </label>
                  <p className="text-xs leading-relaxed text-gray-600">Payments are securely processed by Paystack. Your numbers are held briefly while you complete payment and only reveal prizes after payment is confirmed.</p>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
                    <span>{selectedNumbers.length} ticket(s)</span>
                    <span className="text-lg font-bold text-navy">₦{total.toLocaleString()}</span>
                  </div>
                  <button type="submit" disabled={submitting || !selectedNumbers.length || !isOpenForTickets} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 font-semibold text-white transition-colors hover:bg-primary hover:text-navy disabled:cursor-not-allowed disabled:opacity-50">
                    <Ticket size={17} aria-hidden="true" />{submitting ? "Connecting to Paystack…" : "Pay with Paystack"}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <MapPin className="mx-auto text-primary" size={32} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-navy">Available at participating branches</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">Online ticket sales are turned off. Visit one of the participating branches listed here to pay for a ticket and play.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
