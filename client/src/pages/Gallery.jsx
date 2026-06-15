import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Share2, Play } from "lucide-react";
import { toast } from "react-toastify";
import ceoImg from "../assets/ceo.png";
import ogeeImg from "../assets/ogee.png";

/* --- Google Fonts --- */
const injectFonts = () => {
  if (document.getElementById("gf-gallery")) return;
  const l = document.createElement("link");
  l.id = "gf-gallery";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(l);
};

/* --- localStorage key (shared with AdminGallery) --- */
const STORAGE_KEY = "galleryItems";

/* --- Default gallery data (fallback when localStorage is empty) --- */
const DEFAULT_IMAGES = [
  {
    id: 1, title: "Annual Gala 2024", category: "Events",
    badge: null, featured: true, date: "Dec 15, 2024", type: "image",
    description: "A night of celebration with our staff, partners and stakeholders.",
    thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=40&q=20",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
  },
  {
    id: 2, title: "Mrs. Adaeze Obi", category: "Best Customer",
    badge: "Best Customer", featured: true, date: "Nov 20, 2024", type: "image",
    description: "Loyal partner for 5+ years and our top client of 2024.",
    thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=40&q=20",
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80",
  },
  {
    id: 3, title: "Emeka Chukwu", category: "Best Student",
    badge: "Best Student", featured: true, date: "Oct 5, 2024", type: "image",
    year: "2024",
    description: "Top performer across all modules in our professional training cohort.",
    thumb: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=40&q=20",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80",
  },
  {
    id: 4, title: "Product Launch Event", category: "Events",
    badge: null, featured: false, date: "Sep 18, 2024", type: "image",
    description: "Unveiling our flagship product line to media and early adopters.",
    thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=40&q=20",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
  },
  {
    id: 5, title: "CEO Excellence Award", category: "Awards",
    badge: "Award", featured: true, date: "Aug 30, 2024", type: "image",
    description: "Top performers recognised across all departments by the CEO.",
    thumb: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=40&q=20",
    url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80",
  },
  {
    id: 6, title: "Team Building Retreat", category: "Team",
    badge: null, featured: false, date: "Jul 12, 2024", type: "image",
    description: "Annual retreat focused on collaboration, trust and growth.",
    thumb: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=40&q=20",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",
  },
  {
    id: 7, title: "Community Outreach Day", category: "Milestones",
    badge: null, featured: false, date: "Jun 3, 2024", type: "image",
    description: "Giving back — staff volunteered across local community projects.",
    thumb: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=40&q=20",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80",
  },
  {
    id: 8, title: "Mr. Tunde Alausa", category: "Best Customer",
    badge: "Best Customer", featured: false, date: "May 14, 2024", type: "image",
    description: "Recognised for consistent patronage and business referrals.",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=20",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
  },
  {
    id: 9, title: "5-Year Milestone Celebration", category: "Milestones",
    badge: null, featured: true, date: "Apr 1, 2024", type: "image",
    description: "Marking five years of excellence, growth and impact.",
    thumb: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=40&q=20",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80",
  },
  {
    id: 10, title: "Amaka Nwosu", category: "Best Student",
    badge: "Best Student", featured: false, date: "Mar 22, 2024", type: "image",
    year: "2024",
    description: "Graduated with distinction from our advanced leadership programme.",
    thumb: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=40&q=20",
    url: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=900&q=80",
  },
  {
    id: 11, title: "Innovation Summit 2024", category: "Events",
    badge: null, featured: false, date: "Feb 10, 2024", type: "image",
    description: "Industry leaders gathered for a day of ideas, panels and networking.",
    thumb: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=40&q=20",
    url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=80",
  },
  {
    id: 12, title: "Directors' Award Night", category: "Awards",
    badge: "Award", featured: false, date: "Jan 25, 2024", type: "image",
    description: "Annual directors' recognition ceremony for staff excellence.",
    thumb: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=40&q=20",
    url: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=900&q=80",
  },
  /* ─── CEO & Mentor ─── */
  {
    id: 101, title: "Our CEO", category: "Workers",
    badge: "Worker", featured: true, date: "Jan 1, 2024", type: "image",
    description: "The visionary leader and founder driving TimmyLux Furniture to excellence.",
    thumb: ceoImg, url: ceoImg,
  },
  {
    id: 102, title: "Mr. Ogee — CEO's Mentor", category: "Workers",
    badge: "Worker", featured: true, date: "Jan 1, 2023", type: "image",
    description: "The distinguished boss and mentor who trained and shaped our CEO.",
    thumb: ogeeImg, url: ogeeImg,
  },
];

const CATS = ["All", "Customers", "Events", "Workers", "Students", "Best Customer", "Best Student", "Awards", "Team", "Milestones"];

const BADGE_META = {
  "Best Customer": { icon: "⭐", bg: "#D4AF37", text: "#011F5B" },
  "Best Student":  { icon: "🎓", bg: "#D4AF37", text: "#011F5B" },
  "Award":         { icon: "🏆", bg: "#D4AF37", text: "#011F5B" },
  "Worker":        { icon: "👔", bg: "#011F5B", text: "#D4AF37" },
  "Student":       { icon: "📚", bg: "#D4AF37", text: "#011F5B" },
};

/* Strip leading emoji+space to normalise badge keys from AdminGallery ("⭐ Best Customer" → "Best Customer") */
function getBadgeMeta(badge) {
  if (!badge) return null;
  const clean = badge.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, "").trim();
  return BADGE_META[clean] || null;
}

/* --- Read images from localStorage (admin-managed data) with DEFAULT fallback --- */
function loadImages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.length) return DEFAULT_IMAGES;
    // Merge any new default items not in localStorage (e.g. CEO added later)
    const savedIds = new Set(saved.map((i) => i.id));
    const missing = DEFAULT_IMAGES.filter((i) => !savedIds.has(i.id));
    return missing.length ? [...saved, ...missing] : saved;
  } catch {
    return DEFAULT_IMAGES;
  }
}

/* ─── Lazy Image ─── */
function LazyImg({ thumb, src, alt, style = {}, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [fullSrc, setFullSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (!thumb) { setFullSrc(src); setLoaded(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const hi = new Image();
          hi.onload = () => { setFullSrc(src); setLoaded(true); };
          hi.onerror = () => { setFullSrc(src); setLoaded(true); };
          hi.src = src;
          obs.unobserve(el);
        }
      },
      { rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src, thumb]);

  return (
    <img
      ref={imgRef}
      src={fullSrc || thumb || src}
      alt={alt}
      className={className}
      style={{
        ...style,
        filter: loaded ? "none" : "blur(8px)",
        transform: loaded ? "scale(1)" : "scale(1.04)",
        transition: "filter 0.45s ease, transform 0.45s ease",
      }}
      onError={(e) => { e.target.src = `https://picsum.photos/seed/${encodeURIComponent(alt)}/600/400`; }}
    />
  );
}

/* ─── Share helper ─── */
async function shareMedia(img) {
  try {
    if (img.type === "video") {
      if (navigator.share) await navigator.share({ title: img.title, text: img.description });
      else { await navigator.clipboard.writeText(img.url); toast.success("Video URL copied!"); }
      return;
    }
    if (img.url.startsWith("data:")) {
      const arr = img.url.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      const blob = new Blob([u8arr], { type: mime });
      const file = new File([blob], `${img.title.replace(/\s/g, "_")}.jpg`, { type: mime });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: img.title });
        return;
      }
    }
    const resp = await fetch(img.url);
    const blob = await resp.blob();
    const file = new File([blob], `${img.title.replace(/\s/g, "_")}.jpg`, { type: blob.type || "image/jpeg" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: img.title });
    } else if (navigator.share) {
      await navigator.share({ title: img.title, text: img.description, url: img.url });
    } else {
      await navigator.clipboard.writeText(img.url);
      toast.success("Image URL copied!");
    }
  } catch {
    try { await navigator.clipboard.writeText(img.url); toast.success("URL copied!"); } catch {}
  }
}

/* ─── Download helper ─── */
function downloadMedia(item) {
  if (item.type === "video") {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = `${item.title.replace(/\s/g, "_")}.mp4`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    return;
  }
  fetch(item.url)
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title.replace(/\s/g, "_")}.jpg`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => toast.error("Download failed"));
}

/* ─── Lightbox ─── */
function Lightbox({ img, all, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(all.findIndex((i) => i.id === img.id));
  const current = all[currentIdx] || img;
  const bm = getBadgeMeta(current.badge);
  const isVideo = current.type === "video";

  const go = useCallback((d) => {
    setCurrentIdx((i) => (i + d + all.length) % all.length);
  }, [all]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [go, onClose]);

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

      <div
        className="relative z-10 w-full sm:max-w-4xl sm:mx-4 bg-[#0F0F0F] sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-2xl"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media side */}
        <div className="relative sm:w-3/5 h-60 sm:h-auto bg-black flex-shrink-0">
          {isVideo ? (
            <video
              src={current.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              style={{ maxHeight: "100%" }}
            />
          ) : (
            <>
              <img
                src={current.url}
                alt={current.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${current.id}/700/500`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </>
          )}

          {["←", "→"].map((arrow, i) => (
            <button
              key={arrow}
              onClick={() => go(i === 0 ? -1 : 1)}
              className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white text-base flex items-center justify-center transition-all"
              style={{ [i === 0 ? "left" : "right"]: "0.75rem" }}
            >
              {arrow}
            </button>
          ))}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white/60 text-xs px-3 py-1 rounded-full">
            {currentIdx + 1} / {all.length}
          </div>
        </div>

        {/* Info side */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-end gap-2 mb-5">
            <button
              onClick={() => shareMedia(current)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              title="Share"
            >
              <Share2 size={15} />
            </button>
            {!isVideo && (
              <button
                onClick={() => downloadMedia(current)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                title="Download"
              >
                <Download size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center transition-all"
            >
              ×
            </button>
          </div>

          {bm && (
            <span
              className="self-start text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ background: bm.bg, color: bm.text, fontSize: 10 }}
            >
              {bm.icon} {current.badge?.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, "").trim()}
            </span>
          )}

          <h2
            className="text-white text-2xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {current.title}
          </h2>

          <p className="text-white/55 text-sm leading-relaxed mb-6">{current.description}</p>

          <div className="mt-auto border-t border-white/10 pt-4 space-y-3">
            {[
              { label: "Category", value: current.category },
              { label: "Date", value: current.date },
              ...(current.year ? [{ label: "Year", value: current.year }] : []),
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-white/35">{r.label}</span>
                <span className="text-white/75 font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Card ─── */
function Card({ img, onClick }) {
  const bm = getBadgeMeta(img.badge);
  const isVideo = img.type === "video";

  return (
    <div
      onClick={() => onClick(img)}
      className="group relative overflow-hidden cursor-pointer rounded-2xl bg-[#111]"
      style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {isVideo ? (
          <video
            src={img.url}
            muted
            playsInline
            preload="metadata"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <LazyImg
            thumb={img.thumb}
            src={img.url}
            alt={img.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>

      {/* Video badge */}
      {isVideo && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
          <Play size={9} /> Video
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)" }}
      >
        {bm && (
          <span
            className="self-start font-bold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wider"
            style={{ background: bm.bg, color: bm.text, fontSize: 9 }}
          >
            {bm.icon} {img.badge?.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, "").trim()}
          </span>
        )}
        <p className="text-white font-semibold text-xs leading-snug">{img.title}</p>
        <p className="text-white/45 mt-1" style={{ fontSize: 10 }}>{img.date}</p>
      </div>

      {img.featured && (
        <div
          className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#D4AF37]"
          style={{ boxShadow: "0 0 7px #D4AF37" }}
        />
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function PublicGallery() {
  useEffect(() => { injectFonts(); }, []);

  const [images] = useState(loadImages);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Reload from localStorage if admin gallery was updated in same session
  useEffect(() => {
    const onStorage = () => {
      // Force re-render would require lifted state; for now just notify
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const filtered = images.filter(
    (img) =>
      (cat === "All" || img.category === cat) &&
      (img.title.toLowerCase().includes(search.toLowerCase()) ||
        (img.description || "").toLowerCase().includes(search.toLowerCase()))
  );

  const counts = CATS.reduce((acc, c) => {
    if (c === "All") acc[c] = images.length;
    else if (c === "Customers") acc[c] = images.filter((i) => (i.badge && i.badge.includes("Customer")) || i.category === "Best Customer").length;
    else acc[c] = images.filter((i) => i.category === c).length;
    return acc;
  }, {});

  const videoCount = images.filter((i) => i.type === "video").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'DM Sans', sans-serif",
        color: "#011F5B",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 30,
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(1,31,91,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #D4AF37, #011F5B)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}
            >
              📸
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900, fontSize: 15, lineHeight: 1.1, color: "#011F5B",
                }}
              >
                Company Gallery
              </p>
              <p style={{ fontSize: 10, color: "rgba(1,31,91,0.5)", letterSpacing: "0.05em" }}>
                Events & Recognitions
              </p>
            </div>
          </div>

          {/* Desktop search */}
          <div className="relative hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#011F5B]/40 text-xs">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gallery…"
              style={{
                background: "#F0F4FF",
                border: "1px solid rgba(1,31,91,0.15)",
                borderRadius: 10, padding: "8px 14px 8px 30px",
                color: "#011F5B", fontSize: 12, outline: "none", width: 200,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(1,31,91,0.15)")}
            />
            {/* Uploading is restricted to admins via AdminGallery — public uploads disabled */}
          </div>
        </div>
      </nav>

      <div
        className="max-w-6xl mx-auto px-5 sm:px-8 py-8"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Page title */}
        <div className="mb-8">
          <p
            style={{
              color: "#D4AF37", fontSize: 11, letterSpacing: "0.18em",
              textTransform: "uppercase", fontWeight: 500, marginBottom: 6,
            }}
          >
            Our Moments
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 900, lineHeight: 1.1,
              color: "#011F5B",
            }}
          >
            Gallery of <span style={{ color: "#D4AF37" }}>Excellence</span>
          </h1>
          <p
            style={{
              color: "rgba(1,31,91,0.65)", marginTop: 12,
              maxWidth: 460, lineHeight: 1.7, fontSize: 13,
            }}
          >
            Relive our events, celebrate our best students and customers, and witness the
            milestones that define us.
          </p>
        </div>

        {/* Category pills */}
        <div
          className="flex gap-2 mb-5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 999,
                fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer",
                transition: "all 0.18s",
                background: cat === c ? "#D4AF37" : "transparent",
                borderColor: cat === c ? "#D4AF37" : "rgba(1,31,91,0.2)",
                color: cat === c ? "#011F5B" : "rgba(1,31,91,0.65)",
              }}
            >
              {c}
              <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.6 }}>({counts[c]})</span>
            </button>
          ))}
        </div>

        {/* Mobile search */}
        <div className="relative sm:hidden mb-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#011F5B]/40 text-xs">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gallery…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#F0F4FF",
              border: "1px solid rgba(1,31,91,0.15)",
              borderRadius: 10, padding: "9px 14px 9px 30px",
              color: "#011F5B", fontSize: 12, outline: "none",
            }}
          />
        </div>

        <p className="text-xs mb-5" style={{ color: "rgba(1,31,91,0.55)" }}>
          Search gallery titles and descriptions, or choose a category to narrow the result set.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { n: images.length, label: "Media" },
            { n: images.filter((i) => i.category === "Events").length, label: "Events" },
            { n: images.filter((i) => (i.badge || "").includes("Customer")).length, label: "Top Customers" },
            { n: videoCount > 0 ? videoCount : images.filter((i) => i.badge && (i.badge.includes("Student"))).length, label: videoCount > 0 ? "Videos" : "Top Students" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(1,31,91,0.08)",
                borderRadius: 12, padding: "12px 8px", textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem,2.5vw,1.7rem)", fontWeight: 900, color: "#D4AF37", lineHeight: 1,
                }}
              >
                {s.n}
              </p>
              <p
                style={{
                  fontSize: 10, color: "rgba(1,31,91,0.65)", marginTop: 3,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-baseline justify-between mb-5">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#011F5B" }}>
            {cat === "All" ? "All Media" : cat}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(1,31,91,0.55)" }}>
            {filtered.length} {filtered.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {filtered.map((img) => (
              <Card key={img.id} img={img} onClick={setLightbox} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "70px 0", color: "rgba(1,31,91,0.55)" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No items found</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Try a different category or search term</p>
            <button
              onClick={() => { setCat("All"); setSearch(""); }}
              style={{
                marginTop: 20, padding: "9px 22px", borderRadius: 999,
                background: "#D4AF37", color: "#011F5B",
                border: "none", cursor: "pointer", fontSize: 13,
              }}
            >
              Show all media
            </button>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 70, paddingTop: 28,
            borderTop: "1px solid rgba(1,31,91,0.08)",
            display: "flex", flexWrap: "wrap", justifyContent: "space-between",
            alignItems: "center", gap: 10,
          }}
        >
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 15, color: "#011F5B" }}>
              Company Gallery
            </p>
            <p style={{ fontSize: 11, color: "rgba(1,31,91,0.45)", marginTop: 3 }}>
              © {new Date().getFullYear()} · All rights reserved
            </p>
          </div>
          <p style={{ fontSize: 11, color: "rgba(1,31,91,0.45)" }}>
            {images.length} items · {CATS.length - 1} categories
          </p>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          img={lightbox}
          all={filtered.length ? filtered : images}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
