export function getEventAnchorId(event) {
  if (!event?.id) return "events";
  const safeId = String(event.id).replace(/[^a-zA-Z0-9_-]/g, "-");
  return `event-${safeId}`;
}

export function getEventShareUrl(event) {
  if (typeof window === "undefined") return "";

  const targetUrl = event?.targetUrl?.trim();
  if (targetUrl) {
    try {
      const parsedTarget = new URL(targetUrl, window.location.origin);
      if (parsedTarget.protocol === "https:" || parsedTarget.protocol === "http:") {
        return parsedTarget.toString();
      }
    } catch {
      // Fall back to the event's public card if the URL is invalid.
    }
  }

  return `${window.location.origin}/#${getEventAnchorId(event)}`;
}

export function createEventShareText(event) {
  const details = [event?.description?.trim()];
  if (event?.startDate) {
    const startsAt = new Date(`${event.startDate}${event.startTime ? `T${event.startTime}` : "T00:00"}`);
    if (!Number.isNaN(startsAt.getTime())) details.push(`Starts: ${startsAt.toLocaleString()}`);
  }
  if (event?.endDate) {
    const endsAt = new Date(`${event.endDate}${event.endTime ? `T${event.endTime}` : "T23:59"}`);
    if (!Number.isNaN(endsAt.getTime())) details.push(`Ends: ${endsAt.toLocaleString()}`);
  }
  if (event?.location) details.push(`Location: ${event.location}`);
  if (event?.promoCode) details.push(`Promo code: ${event.promoCode}`);

  return [event?.title || "TimmyLux event", ...details.filter(Boolean)].join("\n\n");
}

export async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Try the legacy copy path if clipboard permission is denied.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (typeof document.execCommand !== "function" || !document.execCommand("copy")) {
      throw new Error("Copy command was not accepted");
    }
  } finally {
    textarea.remove();
  }
}
