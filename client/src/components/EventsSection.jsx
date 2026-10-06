import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Calendar,
  Clock,
  Gift,
  MapPin,
  PartyPopper,
  Percent,
  Sparkles,
  Star,
  Tag,
  Trophy,
  Users,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ShareButton from "./ShareButton";
import {
  copyTextToClipboard,
  createEventShareText,
  getEventAnchorId,
  getEventShareUrl,
} from "../utils/eventSharing";
import { readStoredArray } from "../utils/storage";
import useCurrentTime from "../hooks/useCurrentTime";

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

const eventIcons = {
  discount: Percent,
  gift: Gift,
  promo: Tag,
  announcement: Star,
  party: PartyPopper,
  award: Trophy,
  compensation: Users,
  customer_year: Award,
  promo_season: Calendar,
  program: BookOpen,
};

function isCurrentOrUpcoming(event, now) {
  if (!event?.isActive) return false;
  const endDate = event.endDate
    ? new Date(`${event.endDate}${event.endTime ? `T${event.endTime}` : "T23:59"}`)
    : null;
  return !endDate || Number.isNaN(endDate.getTime()) || endDate.getTime() >= now;
}

function getEventTarget(event) {
  if (event.targetUrl) return event.targetUrl;
  return event.type === "program" ? "/academy" : "/products";
}

function getDateTime(dateValue, timeValue) {
  if (!dateValue) return null;

  const isoString = timeValue ? `${dateValue}T${timeValue}` : `${dateValue}T23:59`;
  const parsedDate = new Date(isoString);

  if (Number.isNaN(parsedDate.getTime())) return null;
  return parsedDate;
}

function getCountdownState(event, now) {
  const startDate = getDateTime(event?.startDate, event?.startTime);
  const endDate = getDateTime(event?.endDate, event?.endTime);

  if (!startDate && !endDate) return null;

  if (startDate && now < startDate.getTime()) {
    return {
      label: "Starts in",
      targetTime: startDate.getTime(),
      status: "upcoming",
    };
  }

  if (endDate && now <= endDate.getTime()) {
    return {
      label: "Ends in",
      targetTime: endDate.getTime(),
      status: "active",
    };
  }

  if (endDate && now > endDate.getTime()) {
    return {
      label: "Ended",
      targetTime: endDate.getTime(),
      status: "ended",
    };
  }

  if (startDate && now >= startDate.getTime()) {
    return {
      label: "Ends in",
      targetTime: endDate ? endDate.getTime() : startDate.getTime(),
      status: "active",
    };
  }

  return null;
}

function formatCountdown(msLeft) {
  const safeMs = Math.max(msLeft, 0);
  const days = Math.floor(safeMs / MS_IN_DAY);
  const hours = Math.floor((safeMs % MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((safeMs % MS_IN_HOUR) / MS_IN_MINUTE);
  const seconds = Math.floor((safeMs % MS_IN_MINUTE) / MS_IN_SECOND);

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function getCountdownStyle(timeLeftMs, status) {
  if (status === "ended" || timeLeftMs <= 12 * MS_IN_HOUR) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-800";
}

export default function EventsSection() {
  const location = useLocation();
  const [events] = useState(() => readStoredArray("adminEvents"));
  const hasTimedEvents = events.some((event) => event.startDate || event.endDate);
  const now = useCurrentTime(1000, hasTimedEvents);
  const [copiedCode, setCopiedCode] = useState(null);
  const visibleEvents = useMemo(() => events.filter((event) => isCurrentOrUpcoming(event, now)), [events, now]);

  useEffect(() => {
    if (!location.hash) return undefined;
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [location.hash, visibleEvents.length]);

  const handleCopy = async (code) => {
    try {
      await copyTextToClipboard(code);
      setCopiedCode(code);
      toast.success("Promo code copied.");
      window.setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      setCopiedCode(null);
      toast.error("Could not copy the promo code. Please copy it manually.");
    }
  };

  return (
    <section id="events" className="relative overflow-hidden bg-[#F7F6F1] px-6 py-20 text-navy sm:py-24">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <Sparkles size={14} aria-hidden="true" /> TimmyLux updates
            </div>
            <h2 className="text-4xl font-bold leading-tight text-navy md:text-5xl">
              Programs <span className="text-primary">& Events</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
              See the programs, events, and promotions published by TimmyLux.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm">
            <Calendar size={14} aria-hidden="true" />
            {visibleEvents.length} upcoming or active {visibleEvents.length === 1 ? "program" : "programs"}
          </div>
        </div>

        {visibleEvents.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => {
              const Icon = eventIcons[event.type] || Calendar;
              const target = getEventTarget(event);
              const isExternal = /^https?:\/\//i.test(target);
              const actionClass = "flex items-center justify-between rounded-lg border border-primary/50 px-4 py-3 text-navy transition-colors hover:bg-primary hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
              const shareTitle = event.title || "TimmyLux event";
              const shareText = createEventShareText(event);
              const shareUrl = getEventShareUrl(event);

              return (
                <article id={getEventAnchorId(event)} key={event.id} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-52 overflow-hidden bg-stone-100">
                    {event.image ? (
                      <img src={event.image} alt={event.title || "TimmyLux event"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-navy/45"><Icon size={40} aria-hidden="true" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-navy/80 px-3 py-1 text-xs uppercase text-primary">
                      <Icon size={12} aria-hidden="true" /> {String(event.type || "event").replaceAll("_", " ")}
                    </div>
                    {Number(event.discountPercentage) > 0 && (
                      <div className="absolute bottom-4 right-4 rounded-lg bg-primary px-3 py-1 font-bold text-navy">
                        {event.discountPercentage}% off
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="mb-2 text-xl font-semibold text-navy transition-colors group-hover:text-primary">{event.title}</h3>
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{event.description}</p>

                    {event.promoCode && (
                      <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-primary/50 bg-[#F7F6F1] px-4 py-3">
                        <div>
                          <p className="text-[10px] uppercase text-gray-500">Promo code</p>
                          <p className="font-bold tracking-widest text-primary">{event.promoCode}</p>
                        </div>
                        <button type="button" onClick={() => handleCopy(event.promoCode)} className="rounded border border-primary/40 px-3 py-1 text-xs text-primary hover:bg-primary/15" aria-label={`Copy promo code ${event.promoCode}`}>
                          {copiedCode === event.promoCode ? "Copied" : "Copy"}
                        </button>
                      </div>
                    )}

                    <div className="mb-5 space-y-2 text-sm text-gray-600">
                      {(event.startDate || event.startTime) && (
                        <div className="flex items-center gap-2"><Clock size={14} aria-hidden="true" />
                          {event.startDate && !Number.isNaN(Date.parse(event.startDate)) ? new Date(event.startDate).toLocaleDateString() : ""}{event.startTime ? ` · ${event.startTime}` : ""}
                        </div>
                      )}
                      {event.location && <div className="flex items-center gap-2"><MapPin size={14} aria-hidden="true" />{event.location}</div>}
                      {event.maxAttendees && <div className="flex items-center gap-2"><Users size={14} aria-hidden="true" />{event.maxAttendees} seats</div>}
                    </div>

                    {(() => {
                      const countdown = getCountdownState(event, now);

                      if (!countdown) return null;

                      const timeLeft = Math.max(countdown.targetTime - now, 0);
                      const badgeColor = getCountdownStyle(timeLeft, countdown.status);

                      return (
                        <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${badgeColor}`}>
                          <Clock size={12} aria-hidden="true" />
                          <span>{countdown.label}</span>
                          <span>{formatCountdown(timeLeft)}</span>
                        </div>
                      );
                    })()}

                    <div className="flex flex-col gap-3">
                      {isExternal ? (
                        <a href={target} target="_blank" rel="noreferrer" className={actionClass}>
                          <span>{event.type === "program" ? "View program" : "Explore offer"}</span><ArrowRight size={16} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link to={target} className={actionClass}>
                          <span>{event.type === "program" ? "View program" : "Explore offer"}</span><ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      )}
                      <ShareButton title={shareTitle} text={shareText} url={shareUrl} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-navy/15 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary hover:bg-[#F7F6F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center shadow-sm">
            <Calendar className="mx-auto mb-3 text-primary" size={28} aria-hidden="true" />
            <h3 className="font-semibold text-navy">No upcoming programs or events</h3>
            <p className="mt-2 text-sm text-gray-600">New announcements and offers will appear here when published.</p>
            <Link to="/academy" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Explore TimmyLux Academy <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
