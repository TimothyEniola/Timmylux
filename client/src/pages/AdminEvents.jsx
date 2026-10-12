import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useNotificationStore from "../store/notificationStore";
import { readStoredArray } from "../utils/storage";
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Gift,
  Tag,
  Percent,
  BookOpen,
  Star,
  PartyPopper,
  Trophy,
  Users,
  Award,
  MapPin,
  Dices,
} from "lucide-react";
import ShareButton from "../components/ShareButton";
import { createEventShareText, getEventShareUrl } from "../utils/eventSharing";
import { apiRequest } from "../utils/api";

const MAX_GAME_NUMBERS = 100;
const TICKETED_EVENT_TYPES = ["game"];
const emptyForm = {
  title: "",
  description: "",
  type: "promo",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "",
  image: "",
  isActive: true,
  discountPercentage: "",
  promoCode: "",
  targetUrl: "",
  maxAttendees: "",
  contactInfo: "",
  gameEnabled: false,
  ticketPrice: "",
  ticketPrizes: "",
  totalNumbers: "",
  gamePrizes: [],
  onlineEnabled: true,
  branchEnabled: false,
  participatingLocationIds: [],
  position: "",
  requirements: "",
  salary: "",
  jobType: "full-time",
};

export default function AdminEvents() {
  const { addNotification } = useNotificationStore();
  const [events, setEvents] = useState([]);
  const [locations] = useState(() => readStoredArray("companyLocations"));
  const [useBackend, setUseBackend] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [branchSaleEvent, setBranchSaleEvent] = useState(null);
  const [branchResult, setBranchResult] = useState(null);
  const [branchUnavailableNumbers, setBranchUnavailableNumbers] = useState([]);
  const [branchSale, setBranchSale] = useState({ number: "", name: "", email: "", phone: "", branchId: "" });

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      try {
        const { data } = await apiRequest("/admin/events");
        const legacyEvents = readStoredArray("adminEvents");
        const localTicketedEvents = legacyEvents
          .filter((event) => TICKETED_EVENT_TYPES.includes(event.type))
          .map((event) => ({ ...event, _localOnly: true }));
        const legacyEventsToImport = legacyEvents.filter((event) => !TICKETED_EVENT_TYPES.includes(event.type));
        const titles = new Set(data.map((event) => `${event.title}|${String(event.startDate || "").slice(0, 10)}`));
        const mergedEvents = [...data];
        for (const legacyEvent of legacyEventsToImport) {
          const key = `${legacyEvent.title}|${String(legacyEvent.startDate || "").slice(0, 10)}`;
          if (titles.has(key)) continue;
          const { data: importedEvent } = await apiRequest("/admin/events", {
            method: "POST",
            body: legacyEvent,
          });
          titles.add(key);
          mergedEvents.push(importedEvent);
        }
        if (legacyEventsToImport.length) {
          try {
            window.localStorage.setItem("adminEvents", JSON.stringify(localTicketedEvents));
          } catch {
            // Keep the in-memory game events even if browser storage is unavailable.
          }
        }
        if (active) {
          setEvents([...mergedEvents, ...localTicketedEvents]);
          setUseBackend(true);
        }
      } catch {
        if (active) {
          setUseBackend(false);
          setEvents(readStoredArray("adminEvents"));
        }
      }
    };
    loadEvents();
    return () => { active = false; };
  }, []);

  const saveLocalEvents = (newEvents) => {
    try {
      window.localStorage.setItem("adminEvents", JSON.stringify(newEvents));
      setEvents((current) => useBackend
        ? [...current.filter((event) => event.type !== "game"), ...newEvents.filter((event) => event.type === "game")]
        : newEvents);
      return true;
    } catch {
      toast.error("Could not save events in this browser.");
      return false;
    }
  };

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingEvent(null);
    setShowForm(false);
  };

  const notifyGamePublished = (event) => {
    addNotification({
      title: `New Game: ${event.title}`,
      message: `${event.description.slice(0, 120)}${event.description.length > 120 ? "…" : ""}`,
      category: "event",
      actionUrl: `/games/${event.id}`,
      eventId: String(event.id),
      eventType: "game",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const raffleTicketPrizes = formData.ticketPrizes
      .split(/\r?\n/)
      .map((line) => {
        const separator = line.indexOf("|");
        return separator < 0 ? null : {
          number: line.slice(0, separator).trim(),
          prize: line.slice(separator + 1).trim(),
        };
      })
      .filter((ticket) => ticket?.number && ticket?.prize);

    const isGameEvent = formData.type === "game";
    const isTicketedEvent = TICKETED_EVENT_TYPES.includes(formData.type);
    const gameTotal = Number(formData.totalNumbers);
    const gamePrizes = Array.isArray(formData.gamePrizes) ? formData.gamePrizes : [];

    if (isTicketedEvent && (!Number.isFinite(Number(formData.ticketPrice)) || Number(formData.ticketPrice) <= 0)) {
      toast.error("Enter a ticket price greater than ₦0.");
      return;
    }

    if (isGameEvent) {
      if (!Number.isInteger(gameTotal) || gameTotal < 1 || gameTotal > MAX_GAME_NUMBERS) {
        toast.error(`Choose a total between 1 and ${MAX_GAME_NUMBERS}.`);
        return;
      }
      const completePrizeCount = gamePrizes.slice(0, gameTotal).filter((item) => item?.prize?.trim()).length;
      if (completePrizeCount !== gameTotal) {
        toast.error("Assign a prize to every number before publishing the game.");
        return;
      }
      if (!formData.onlineEnabled && !formData.branchEnabled) {
        toast.error("Enable online play, branch play, or both.");
        return;
      }
      if (formData.branchEnabled && !formData.participatingLocationIds.length) {
        toast.error("Choose at least one participating branch.");
        return;
      }
    }

    try {
      const normalizedGamePrizes = isGameEvent
        ? gamePrizes.slice(0, gameTotal).map((item, index) => ({ number: String(index + 1), prize: item.prize.trim() }))
        : [];
      const payload = {
        ...formData,
        gameEnabled: isGameEvent ? Boolean(formData.onlineEnabled) : Boolean(formData.gameEnabled),
        branchEnabled: isGameEvent ? Boolean(formData.branchEnabled) : false,
        participatingLocationIds: isGameEvent && formData.branchEnabled ? formData.participatingLocationIds.map(String) : [],
        participatingLocations: isGameEvent && formData.branchEnabled
          ? locations.filter((location) => formData.participatingLocationIds.map(String).includes(String(location.id)))
          : [],
        ticketPrice: isTicketedEvent ? Number(formData.ticketPrice) : null,
        ticketPrizes: isGameEvent ? normalizedGamePrizes : raffleTicketPrizes,
        totalNumbers: isGameEvent ? gameTotal : formData.totalNumbers,
        gamePrizes: isGameEvent ? gamePrizes.slice(0, gameTotal).map((item, index) => ({ number: index + 1, prize: item.prize.trim() })) : formData.gamePrizes,
      };
      let savedEvent;
      if (useBackend) {
        const result = editingEvent && !editingEvent._localOnly
          ? await apiRequest(`/admin/events/${editingEvent.id}`, { method: "PUT", body: payload })
          : await apiRequest("/admin/events", { method: "POST", body: payload });
        savedEvent = result.data;
      } else {
        const storedEvents = readStoredArray("adminEvents");
        savedEvent = {
          ...payload,
          id: editingEvent?.id || Date.now().toString(),
          _count: editingEvent?._count || { tickets: 0 },
        };
        const nextEvents = editingEvent
          ? storedEvents.map((event) => event.id === editingEvent.id ? savedEvent : event)
          : [savedEvent, ...storedEvents];
        if (!saveLocalEvents(nextEvents)) return;
      }
      if (useBackend) {
        setEvents((current) => [
          savedEvent,
          ...current.filter((event) => String(event.id) !== String(savedEvent.id) && String(event.id) !== String(editingEvent?.id)),
        ]);
        if (editingEvent?._localOnly) {
          const remainingLocalEvents = readStoredArray("adminEvents").filter((event) => String(event.id) !== String(editingEvent.id));
          window.localStorage.setItem("adminEvents", JSON.stringify(remainingLocalEvents));
        }
      }
      if (isGameEvent) {
        const shouldNotifyGame = !editingEvent || editingEvent.type !== "game" || !editingEvent.isActive;
        if (savedEvent.isActive && shouldNotifyGame) notifyGamePublished(savedEvent);
      } else if (!editingEvent) {
        addNotification({
          title: `New Event: ${formData.title}`,
          message: `A new ${formData.type.replace("_", " ")} event has been posted: ${formData.description.slice(0, 120)}`,
          category: "event",
        });
      }
      toast.success(editingEvent ? "Event updated!" : "New event created!");
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (event) => {
    const storedTicketPrizes = Array.isArray(event.ticketPrizes) ? event.ticketPrizes : [];
    const gameTotal = Number(event.totalNumbers) || storedTicketPrizes.length;
    const gamePrizes = Array.isArray(event.gamePrizes) && event.gamePrizes.length
      ? event.gamePrizes
      : storedTicketPrizes.map(({ number, prize }) => ({ number: Number(number), prize }));
    setFormData({
      ...emptyForm,
      ...event,
      startDate: event.startDate ? event.startDate.slice(0, 10) : "",
      endDate: event.endDate ? event.endDate.slice(0, 10) : "",
      ticketPrice: event.ticketPrice ?? "",
      ticketPrizes: storedTicketPrizes
        .map(({ number, prize }) => `${number} | ${prize}`)
        .join("\n"),
      totalNumbers: event.type === "game" ? gameTotal : "",
      gamePrizes: Array.from({ length: event.type === "game" ? gameTotal : 0 }, (_, index) => ({
        number: index + 1,
        prize: gamePrizes.find((item) => Number(item.number) === index + 1)?.prize || "",
      })),
      onlineEnabled: event.type === "game" ? Boolean(event.onlineEnabled ?? event.gameEnabled) : true,
      branchEnabled: Boolean(event.branchEnabled),
      participatingLocationIds: (event.participatingLocationIds || []).map(String),
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    try {
      const event = events.find((item) => String(item.id) === String(eventId));
      if (event?._localOnly && TICKETED_EVENT_TYPES.includes(event.type)) {
        throw new Error("This older ticketed event is stored only in this browser. Recreate it in the connected admin system before managing sales.");
      } else if (useBackend && event) {
        await apiRequest(`/admin/events/${eventId}`, { method: "DELETE" });
        setEvents((current) => current.filter((item) => String(item.id) !== String(eventId)));
      } else if (useBackend) {
        await apiRequest(`/admin/events/${eventId}`, { method: "DELETE" });
        setEvents((current) => current.filter((item) => item.id !== eventId));
      } else {
        const tickets = readStoredArray("adminEventTickets").filter((ticket) => ticket.eventId === eventId);
        if (tickets.length) throw new Error("Events with ticket sales cannot be deleted. Deactivate the event instead.");
        if (!saveLocalEvents(readStoredArray("adminEvents").filter((item) => item.id !== eventId))) return;
      }
      toast.success("Event deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleActive = async (event) => {
    try {
      if (useBackend && !event._localOnly) {
        const { data } = await apiRequest(`/admin/events/${event.id}`, {
          method: "PUT",
          body: { ...event, isActive: !event.isActive },
        });
        setEvents((current) => current.map((item) => String(item.id) === String(event.id) ? data : item));
        if (data.isActive && event.type === "game") notifyGamePublished(data);
      } else if (useBackend) {
        const { data } = await apiRequest(`/admin/events/${event.id}`, {
          method: "PUT",
          body: { ...event, isActive: !event.isActive },
        });
        setEvents((current) => current.map((item) => item.id === event.id ? data : item));
      } else {
        saveLocalEvents(readStoredArray("adminEvents").map((item) => item.id === event.id
          ? { ...item, isActive: !item.isActive }
          : item));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const recordBranchSale = async (event) => {
    try {
      if (!useBackend || event._localOnly) {
        throw new Error("Connect the server before recording a paid ticket sale.");
      }
      if (event.type === "game" && !branchSale.branchId) {
        throw new Error("Choose a participating branch before recording this ticket.");
      }
      const assignedPrize = (Array.isArray(event.ticketPrizes) ? event.ticketPrizes : [])
        .find((ticket) => String(ticket.number) === String(branchSale.number))?.prize;
      if (!assignedPrize) throw new Error("No prize is assigned to that number.");

      if (useBackend) {
        const { data } = await apiRequest(`/admin/events/${event.id}/tickets/branch`, {
          method: "POST",
          body: branchSale,
        });
        setBranchResult({ eventId: event.id, ...data, customerName: branchSale.name, branchName: data.branchName || (event.participatingLocations || []).find((branch) => String(branch.id) === String(branchSale.branchId))?.name });
        setEvents((current) => current.map((item) => item.id === event.id
          ? { ...item, _count: { ...item._count, tickets: (item._count?.tickets || 0) + 1 } }
          : item));
      } else {
        const tickets = readStoredArray("adminEventTickets");
        if (tickets.some((ticket) => ticket.eventId === event.id && ticket.number === branchSale.number)) {
          throw new Error("That number has already been recorded as sold.");
        }
        const ticket = {
          ...branchSale,
          prize: assignedPrize,
          id: Date.now().toString(),
          eventId: event.id,
          status: "PAID",
          paymentMethod: "BRANCH",
          createdAt: new Date().toISOString(),
        };
        window.localStorage.setItem("adminEventTickets", JSON.stringify([ticket, ...tickets]));
        const saved = saveLocalEvents(readStoredArray("adminEvents").map((item) => item.id === event.id
          ? { ...item, _count: { ...item._count, tickets: (item._count?.tickets || 0) + 1 } }
          : item));
        if (!saved) return;
        setBranchResult({
          eventId: event.id,
          number: branchSale.number,
          prize: assignedPrize,
          customerName: branchSale.name,
        });
      }
      setBranchSale({ number: "", name: "", email: "", phone: "", branchId: "" });
      setBranchUnavailableNumbers((current) => [...current, String(branchSale.number)]);
      setBranchSaleEvent(null);
      toast.success("Branch ticket recorded.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openBranchSale = async (event) => {
    if (branchSaleEvent === event.id) {
      setBranchSaleEvent(null);
      return;
    }
    try {
      const tickets = useBackend
        ? (await apiRequest(`/admin/events/${event.id}/tickets`)).data
        : readStoredArray("adminEventTickets").filter((ticket) => ticket.eventId === event.id);
      setBranchUnavailableNumbers(tickets.map((ticket) => ticket.number));
      setBranchSale({ number: "", name: "", email: "", phone: "", branchId: "" });
      setBranchSaleEvent(event.id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "discount":
        return Percent;
      case "gift":
        return Gift;
      case "promo":
        return Tag;
      case "announcement":
        return Star;
      case "party":
        return PartyPopper;
      case "award":
        return Trophy;
      case "compensation":
        return Users;
      case "customer_year":
        return Award;
      case "promo_season":
        return Calendar;
      case "program":
        return BookOpen;
      case "game":
        return Dices;
      default:
        return Calendar;
    }
  };

  const getEventTypeColor = () => "bg-[#D4AF37]/15 text-[#011F5B]";


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#011F5B]">
              Events & Promotions
            </h1>
            <p className="text-gray-600">
              Manage your promotional events and announcements
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#011F5B] text-white px-4 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-[#011F5B] transition"
          >
            <Plus size={18} />
            Add New Event
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => {
            const IconComponent = getEventIcon(event.type);
            const payerRecords = readStoredArray("adminEventTickets")
              .filter((ticket) => String(ticket.eventId) === String(event.id))
              .filter((ticket) => ticket.customerName || ticket.customerEmail || ticket.number)
              .slice(0, 4);

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        size={20}
                        className="text-[#D4AF37]"
                      />
                                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type === "game" ? "Game" : event.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleActive(event)}
                        className={`h-3 w-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          event.isActive ? "bg-green-600" : "bg-gray-300"
                        }`}
                        aria-label={`${event.isActive ? "Deactivate" : "Activate"} ${event.title}`}
                        title={event.isActive ? "Active — click to deactivate" : "Inactive — click to activate"}
                      />
                      <ShareButton
                        title={event.title || "TimmyLux event"}
                        text={createEventShareText(event)}
                        url={getEventShareUrl(event)}
                        compact
                        className="rounded p-1.5 text-gray-500 transition-colors hover:bg-primary/10 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      />
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-gray-400 hover:text-[#D4AF37]"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  {event._localOnly && TICKETED_EVENT_TYPES.includes(event.type) && (
                    <p role="status" className="mb-4 border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Legacy browser-only event. Recreate it in the connected admin system before accepting tickets.</p>
                  )}
                  {event.type === "game" && (
                    <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-navy">
                      <p className="font-semibold">Game · {Array.isArray(event.ticketPrizes) ? event.ticketPrizes.length : Number(event.totalNumbers) || 0} numbers</p>
                      <p>₦{Number(event.ticketPrice || 0).toLocaleString()} per ticket · {event._count?.tickets || 0} ticket(s) sold or reserved</p>
                      <p>{event.gameEnabled ? "Online Paystack enabled" : "Online sales off"}{event.branchEnabled ? ` · ${event.participatingLocationIds?.length || 0} participating branch(es)` : " · No branch play"}</p>
                    </div>
                  )}

                  {event.type === "game" && payerRecords.length > 0 && (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                      <p className="font-semibold">Paying customers</p>
                      <ul className="mt-2 space-y-1">
                        {payerRecords.map((record) => (
                          <li key={`${record.eventId}-${record.number}-${record.customerEmail || record.customerName || record.reference || "record"}`}>
                            {record.customerName || "Customer"} • Ticket {record.number}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    {event.startDate && event.startTime && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        Max {event.maxAttendees} attendees
                      </div>
                    )}
                    {event.contactInfo && (
                      <div className="flex items-center gap-1">
                        <span>Contact: {event.contactInfo}</span>
                      </div>
                    )}
                    {TICKETED_EVENT_TYPES.includes(event.type) && (
                      <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-navy">
                        <p className="font-semibold">{event.type === "game" ? "Game" : "Event"} · ₦{Number(event.ticketPrice).toLocaleString()} per ticket</p>
                        <p>Ticket payment only. The customer owns the revealed prize; there is no extra prize charge.</p>
                        <p>{event.gameEnabled ? "Online Paystack enabled" : event.type === "game" ? "Online sales off" : "Branch sales only"}</p>
                        <p className="mt-1">{event._count?.tickets || 0} ticket(s) sold or reserved</p>
                        {event.branchEnabled && useBackend && !event._localOnly && (
                          <button
                            type="button"
                            onClick={() => openBranchSale(event)}
                            className="mt-2 font-medium text-navy underline"
                          >
                            Record a branch sale
                          </button>
                        )}
                        {branchSaleEvent === event.id && (
                          <form
                            className="mt-3 space-y-2 border-t border-primary/20 pt-3"
                            onSubmit={(submitEvent) => { submitEvent.preventDefault(); recordBranchSale(event); }}
                          >
                            {event.type === "game" && (
                              <select
                                required
                                value={branchSale.branchId}
                                onChange={(changeEvent) => setBranchSale((current) => ({ ...current, branchId: changeEvent.target.value }))}
                                className="w-full rounded border border-gray-300 px-2 py-2"
                                aria-label="Participating branch"
                              >
                                <option value="">Choose participating branch</option>
                                {(event.participatingLocations || []).map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                              </select>
                            )}
                            <select
                              required
                              value={branchSale.number}
                              onChange={(changeEvent) => setBranchSale((current) => ({ ...current, number: changeEvent.target.value }))}
                              className="w-full rounded border border-gray-300 px-2 py-2"
                            >
                              <option value="">Choose ticket number</option>
                              {(Array.isArray(event.ticketPrizes) ? event.ticketPrizes : [])
                                .filter(({ number }) => !branchUnavailableNumbers.map(String).includes(String(number)))
                                .map(({ number }) => (
                                <option key={number} value={number}>{number}</option>
                                ))}
                            </select>
                            <input required value={branchSale.name} onChange={(changeEvent) => setBranchSale({ ...branchSale, name: changeEvent.target.value })} placeholder="Customer name" className="w-full rounded border border-gray-300 px-2 py-2" />
                            <input required type="email" value={branchSale.email} onChange={(changeEvent) => setBranchSale({ ...branchSale, email: changeEvent.target.value })} placeholder="Customer email" className="w-full rounded border border-gray-300 px-2 py-2" />
                            <input type="tel" value={branchSale.phone} onChange={(changeEvent) => setBranchSale({ ...branchSale, phone: changeEvent.target.value })} placeholder="Phone (optional)" className="w-full rounded border border-gray-300 px-2 py-2" />
                            <p className="text-xs text-gray-600">Record only after confirming the customer paid ₦{Number(event.ticketPrice).toLocaleString()}. Do not charge separately for the prize.</p>
                            <button className="w-full rounded bg-navy px-3 py-2 font-medium text-white" type="submit">Record paid ticket and reveal prize</button>
                          </form>
                        )}
                        {branchResult?.eventId === event.id && (
                          <div role="status" className="mt-3 border-t border-primary/20 pt-3">
                            <p className="font-semibold">Ticket {branchResult.number} belongs to {branchResult.customerName}.</p>
                            {branchResult.branchName && <p className="mt-1">Branch: {branchResult.branchName}</p>}
                            <p className="mt-1">Prize revealed: <strong>{branchResult.prize}</strong></p>
                            <p className="mt-1 text-xs">The prize is theirs at no extra charge. They can collect it at the branch or contact you to arrange delivery.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar
              size={48}
              className="mx-auto text-gray-300 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600">
              Create your first promotional event to get started.
            </p>
          </div>
        )}

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#011F5B]">
                    {editingEvent ? "Edit Event" : "Add New Event"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        disabled={editingEvent?.type === "game"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:bg-gray-100"
                        required
                      >
                         <option value="promo">Promotion</option>
                         <option value="program">Program</option>
                         <option value="game">Game</option>
                         <option value="discount">Discount</option>
                        <option value="gift">Gift</option>
                        <option value="announcement">Announcement</option>
                        <option value="party">Party</option>
                        <option value="award">Award Ceremony</option>
                        <option value="compensation">Compensation</option>
                        <option value="customer_year">Customer of the Year</option>
                        <option value="promo_season">Promo Season</option>
                        <option value="worker">Worker Broadcasting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Location and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="Venue or online link"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Info
                      </label>
                      <input
                        type="text"
                        value={formData.contactInfo}
                        onChange={(e) =>
                          setFormData({ ...formData, contactInfo: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="Phone or email"
                      />
                    </div>
                  </div>

                  {/* Image and Additional Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Conditional Fields based on Event Type */}
                  {(formData.type === "discount" || formData.type === "promo") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Percentage
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={(e) =>
                            setFormData({ ...formData, discountPercentage: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Promo Code
                        </label>
                        <input
                          type="text"
                          value={formData.promoCode}
                          onChange={(e) =>
                            setFormData({ ...formData, promoCode: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="SAVE20"
                        />
                      </div>
                    </div>
                  )}

                  {(formData.type === "party" || formData.type === "award" || formData.type === "customer_year") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxAttendees}
                        onChange={(e) =>
                          setFormData({ ...formData, maxAttendees: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="100"
                      />
                    </div>
                  )}

                  {formData.type === "game" && (
                    <fieldset className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <legend className="px-1 text-sm font-semibold text-navy">Paid Game setup</legend>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="game-ticket-price">Ticket price (₦) *
                        <input id="game-ticket-price" type="number" min="0.01" step="0.01" required value={formData.ticketPrice} onChange={(e) => setFormData((current) => ({ ...current, ticketPrice: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-describedby="game-ticket-price-help" />
                        <span id="game-ticket-price-help" className="mt-1 block text-xs font-normal text-gray-600">Customers pay this amount for each number. Online customers complete payment with Paystack.</span>
                      </label>
                      <div>
                        <label htmlFor="game-total-numbers" className="mb-1 block text-sm font-medium text-gray-700">Total numbers *</label>
                        <input
                          id="game-total-numbers"
                          type="number"
                          min="1"
                          max={MAX_GAME_NUMBERS}
                          step="1"
                          required
                          value={formData.totalNumbers}
                          onChange={(e) => {
                            const total = Number(e.target.value);
                            const safeTotal = Number.isInteger(total) ? Math.max(0, Math.min(total, MAX_GAME_NUMBERS)) : 0;
                            setFormData((current) => ({
                              ...current,
                              totalNumbers: e.target.value,
                              gamePrizes: Array.from({ length: safeTotal }, (_, index) => ({
                                number: index + 1,
                                prize: current.gamePrizes?.[index]?.prize || "",
                              })),
                            }));
                          }}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          aria-describedby="game-total-help"
                        />
                        <p id="game-total-help" className="mt-1 text-xs text-gray-600">Set between 1 and {MAX_GAME_NUMBERS}. A prize is required for every number.</p>
                      </div>

                      {formData.gamePrizes.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-sm font-medium text-gray-700">Prize for each number *</h3>
                          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                            {formData.gamePrizes.map((item, index) => (
                              <label key={item.number} className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-navy">
                                <span className="w-8 shrink-0 font-semibold">{item.number}.</span>
                                <input
                                  type="text"
                                  maxLength={160}
                                  required
                                  value={item.prize}
                                  onChange={(e) => setFormData((current) => ({
                                    ...current,
                                    gamePrizes: current.gamePrizes.map((prize, prizeIndex) => prizeIndex === index ? { ...prize, prize: e.target.value } : prize),
                                  }))}
                                  placeholder={`Prize for ${item.number}`}
                                  aria-label={`Prize for number ${item.number}`}
                                  className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 border-t border-primary/20 pt-3">
                        <p className="text-sm font-medium text-gray-700">Ways to participate *</p>
                        <label className="flex items-center gap-2 text-sm text-navy">
                          <input type="checkbox" checked={Boolean(formData.onlineEnabled)} onChange={(e) => setFormData({ ...formData, onlineEnabled: e.target.checked })} className="h-4 w-4 accent-primary" />
                          Allow online play and Paystack ticket payments
                        </label>
                        <label className="flex items-center gap-2 text-sm text-navy">
                          <input type="checkbox" checked={Boolean(formData.branchEnabled)} onChange={(e) => setFormData({ ...formData, branchEnabled: e.target.checked })} className="h-4 w-4 accent-primary" />
                          Allow in-person participation at branches
                        </label>
                      </div>

                      {formData.branchEnabled && (
                        <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-sm font-medium text-gray-700">Participating branches *</p>
                          {locations.length ? locations.map((location) => {
                            const locationId = String(location.id);
                            return (
                              <label key={locationId} className="flex items-start gap-2 py-1 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={(formData.participatingLocationIds || []).map(String).includes(locationId)}
                                  onChange={(e) => setFormData((current) => ({
                                    ...current,
                                    participatingLocationIds: e.target.checked
                                      ? [...new Set([...current.participatingLocationIds.map(String), locationId])]
                                      : current.participatingLocationIds.filter((id) => String(id) !== locationId),
                                  }))}
                                  className="mt-0.5 h-4 w-4 accent-primary"
                                />
                                <span><strong>{location.name}</strong>{location.address ? ` — ${location.address}` : ""}{location.isOpen ? " · Open" : " · Closed"}</span>
                              </label>
                            );
                          }) : <p className="text-sm text-gray-600">Add a branch in Company Locations before enabling in-person play.</p>}
                        </div>
                      )}
                    </fieldset>
                  )}

                  {formData.type === "worker" && (
                    <div className="border-t pt-6 mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-[#011F5B] mb-4">Worker Broadcast Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Position *
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) =>
                            setFormData({ ...formData, position: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="e.g., Receptionist, Secretary, Manager, etc."
                          required={formData.type === "worker"}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Requirements *
                        </label>
                        <textarea
                          value={formData.requirements}
                          onChange={(e) =>
                            setFormData({ ...formData, requirements: e.target.value })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="List job requirements, qualifications, experience needed..."
                          required={formData.type === "worker"}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary Range
                          </label>
                          <input
                            type="text"
                            value={formData.salary}
                            onChange={(e) =>
                              setFormData({ ...formData, salary: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            placeholder="e.g., ₦50,000 - ₦80,000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Type
                          </label>
                          <select
                            value={formData.jobType}
                            onChange={(e) =>
                              setFormData({ ...formData, jobType: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          >
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="freelance">Freelance</option>
                            <option value="seasonal">Seasonal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.targetUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, targetUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="/academy, /gallery, or https://example.com"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Event is active and visible to customers
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#D4AF37] hover:text-[#011F5B] transition"
                    >
                      {editingEvent ? "Update Event" : "Create Event"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}