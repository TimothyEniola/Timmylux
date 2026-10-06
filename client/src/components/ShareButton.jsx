import { useEffect, useState } from "react";
import { Check, Copy, Share2, X } from "lucide-react";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "../utils/eventSharing";

const shareDestinations = [
  {
    name: "Facebook",
    url: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    url: ({ text, url }) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    url: ({ text, url }) => `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
  {
    name: "Telegram",
    url: ({ text, url }) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "LinkedIn",
    url: ({ url }) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    url: ({ title, url }) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "Email",
    url: ({ title, text, url }) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
];


export default function ShareButton({ title, text, url, className = "", compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareData = { title, text, url };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleShare = async () => {
    if (typeof navigator.share !== "function") {
      setIsOpen(true);
      return;
    }

    try {
      await navigator.share(shareData);
      setIsOpen(false);
    } catch (error) {
      if (error?.name === "AbortError") return;
      setIsOpen(true);
    }
  };

  const handleCopy = async () => {
    try {
      await copyTextToClipboard([text, url].filter(Boolean).join("\n\n"));
      setCopied(true);
      toast.success("Event details copied. You can paste them into any app.");
      window.setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch {
      toast.error("Could not copy event details. Please select and copy the link manually.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className={className || "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-primary/50 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"}
        aria-label={`Share ${title}`}
      >
        <Share2 size={compact ? 16 : 18} aria-hidden="true" />
        {!compact && <span>Share</span>}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-navy/35 p-4 backdrop-blur-[2px] sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="share-dialog-title" className="font-bold text-navy">Share this event</h2>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Close share options"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {shareDestinations.map((destination) => (
                <a
                  key={destination.name}
                  href={destination.url(shareData)}
                  target={destination.name === "Email" ? undefined : "_blank"}
                  rel={destination.name === "Email" ? undefined : "noopener noreferrer"}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-navy transition hover:border-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {destination.name}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? "Copied" : "Copy event details and link"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
