import { useState, useEffect, useRef } from "react";

/* ─── Google Fonts injected once ─── */
const injectFonts = () => {
  if (document.getElementById("gf-gallery")) return;
  const l = document.createElement("link");
  l.id = "gf-gallery";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(l);
};

/* ─── Sample Data ─── */
const IMAGES = [
  {
    id: 1, title: "Annual Gala 2024", category: "Events",
    badge: null, featured: true, date: "Dec 15, 2024",
    description: "A night of celebration with our staff, partners and stakeholders.",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
  },
  {
    id: 2, title: "Mrs. Adaeze Obi", category: "Best Customer",
    badge: "Best Customer", featured: true, date: "Nov 20, 2024",
    description: "Loyal partner for 5+ years and our top client of 2024.",
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80",
  },
  {
    id: 3, title: "Emeka Chukwu", category: "Best Student",
    badge: "Best Student", featured: true, date: "Oct 5, 2024",
    description: "Top performer across all modules in our professional training cohort.",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80",
  },
  {
    id: 4, title: "Product Launch Event", category: "Events",
    badge: null, featured: false, date: "Sep 18, 2024",
    description: "Unveiling our flagship product line to media and early adopters.",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
  },
  {
    id: 5, title: "CEO Excellence Award", category: "Awards",
    badge: "Award", featured: true, date: "Aug 30, 2024",
    description: "Top performers recognised across all departments by the CEO.",
    url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80",
  },
  {
    id: 6, title: "Team Building Retreat", category: "Team",
    badge: null, featured: false, date: "Jul 12, 2024",
    description: "Annual retreat focused on collaboration, trust and growth.",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",
  },
  {
    id: 7, title: "Community Outreach Day", category: "Milestones",
    badge: null, featured: false, date: "Jun 3, 2024",
    description: "Giving back — staff volunteered across local community projects.",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80",
  },
  {
    id: 8, title: "Mr. Tunde Alausa", category: "Best Customer",
    badge: "Best Customer", featured: false, date: "May 14, 2024",
    description: "Recognised for consistent patronage and business referrals.",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
  },
  {
    id: 9, title: "5-Year Milestone Celebration", category: "Milestones",
    badge: null, featured: true, date: "Apr 1, 2024",
    description: "Marking five years of excellence, growth and impact.",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80",
  },
  {
    id: 10, title: "Amaka Nwosu", category: "Best Student",
    badge: "Best Student", featured: false, date: "Mar 22, 2024",
    description: "Graduated with distinction from our advanced leadership programme.",
    url: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=900&q=80",
  },
  {
    id: 11, title: "Innovation Summit 2024", category: "Events",
    badge: null, featured: false, date: "Feb 10, 2024",
    description: "Industry leaders gathered for a day of ideas, panels and networking.",
    url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=80",
  },
  {
    id: 12, title: "Directors' Award Night", category: "Awards",
    badge: "Award", featured: false, date: "Jan 25, 2024",
    description: "Annual directors' recognition ceremony for staff excellence.",
    url: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=900&q=80",
  },
];

const CATS = ["All", "Events", "Best Customer", "Best Student", "Awards", "Team", "Milestones"];

const BADGE_META = {
  "Best Customer": { icon: "⭐", bg: "#FCD34D", text: "#78350F" },
  "Best Student":  { icon: "🎓", bg: "#6EE7B7", text: "#065F46" },
  "Award":         { icon: "🏆", bg: "#FCA5A5", text: "#7F1D1D" },
};

/* ─── Lightbox ─── */
function Lightbox({ img, all, onClose }) {
  const idx = all.findIndex(i => i.id === img.id);
  const [current, setCurrent] = useState(img);
  const [dir, setDir] = useState(0); // -1 left, 1 right

  useEffect(() => { setCurrent(img); }, [img]);

  const go = (d) => {
    setDir(d);
    const next = all[(all.findIndex(i => i.id === current.id) + d + all.length) % all.length];
    setTimeout(() => setCurrent(next), 80);
  };

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });

  const bm = BADGE_META[current.badge];

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

      {/* panel */}
      <div
        className="relative z-10 w-full sm:max-w-5xl sm:mx-4 bg-[#0F0F0F] sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-2xl"
        style={{ maxHeight: "92vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* image side */}
        <div className="relative sm:w-3/5 h-64 sm:h-auto bg-black flex-shrink-0">
          <img
            src={current.url}
            alt={current.title}
            className="w-full h-full object-cover"
            style={{ transition: "opacity 0.15s" }}
            onError={e => e.target.src = `https://picsum.photos/seed/${current.id}/700/500`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* nav arrows */}
          {["←", "→"].map((arrow, i) => (
            <button key={arrow}
              onClick={() => go(i === 0 ? -1 : 1)}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white text-lg flex items-center justify-center transition-all"
              style={{ [i === 0 ? "left" : "right"]: "1rem" }}
            >
              {arrow}
            </button>
          ))}

          {/* counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white/70 text-xs px-3 py-1 rounded-full">
            {all.findIndex(i => i.id === current.id) + 1} / {all.length}
          </div>
        </div>

        {/* info side */}
        <div className="flex-1 flex flex-col p-7 overflow-y-auto">
          <button onClick={onClose}
            className="self-end w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center mb-6 transition-all flex-shrink-0">
            ×
          </button>

          {bm && (
            <span
              className="self-start text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest"
              style={{ background: bm.bg, color: bm.text }}
            >
              {bm.icon} {current.badge}
            </span>
          )}

          <h2 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {current.title}
          </h2>

          <p className="text-white/60 text-sm leading-relaxed mb-6">{current.description}</p>

          <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
            {[
              { label: "Category", value: current.category },
              { label: "Date", value: current.date },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-white/40">{r.label}</span>
                <span className="text-white/80 font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Card ─── */
function Card({ img, onClick, style }) {
  const bm = BADGE_META[img.badge];
  return (
    <div
      onClick={() => onClick(img)}
      className="group relative overflow-hidden cursor-pointer rounded-2xl bg-[#111]"
      style={{ ...style, transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.6)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* image */}
      <div className="overflow-hidden" style={{ aspectRatio: img.featured ? "16/9" : "4/3" }}>
        <img
          src={img.url}
          alt={img.title}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.6s ease" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
          onMouseLeave={e => e.target.style.transform = ""}
          onError={e => e.target.src = `https://picsum.photos/seed/${img.id}/600/400`}
        />
      </div>

      {/* overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}
      >
        {bm && (
          <span
            className="self-start text-xs font-bold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wider"
            style={{ background: bm.bg, color: bm.text, fontSize: "10px" }}
          >
            {bm.icon} {img.badge}
          </span>
        )}
        <p className="text-white font-semibold text-sm leading-snug">{img.title}</p>
        <p className="text-white/50 text-xs mt-1">{img.date}</p>
      </div>

      {/* featured dot */}
      {img.featured && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg"
          style={{ boxShadow: "0 0 8px #34d399" }} />
      )}
    </div>
  );
}

/* ─── Hero Spotlight ─── */
function Spotlight({ images }) {
  const picks = images.filter(i => i.featured).slice(0, 3);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % picks.length), 4500);
    return () => clearInterval(t);
  }, [picks.length]);

  if (!picks.length) return null;
  const img = picks[active];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-12" style={{ height: "420px" }}>
      {picks.map((p, i) => (
        <img
          key={p.id}
          src={p.url}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === active ? 1 : 0, transition: "opacity 0.9s ease", zIndex: i === active ? 1 : 0 }}
          onError={e => e.target.src = `https://picsum.photos/seed/${p.id}/1200/420`}
        />
      ))}

      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)" }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 sm:p-12">
        {BADGE_META[img.badge] && (
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest"
            style={{ background: BADGE_META[img.badge].bg, color: BADGE_META[img.badge].text }}
          >
            {BADGE_META[img.badge].icon} {img.badge}
          </span>
        )}
        <h2 className="text-white text-3xl sm:text-5xl font-black mb-2 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
          {img.title}
        </h2>
        <p className="text-white/65 text-sm sm:text-base max-w-xl">{img.description}</p>

        {/* dots */}
        <div className="flex gap-2 mt-6">
          {picks.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all"
              style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                background: i === active ? "#FCD34D" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function PublicGallery() {
  useEffect(() => { injectFonts(); }, []);

  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const filtered = IMAGES.filter(img =>
    (cat === "All" || img.category === cat) &&
    (img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.description.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = CATS.reduce((acc, c) => {
    acc[c] = c === "All" ? IMAGES.length : IMAGES.filter(i => i.category === c).length;
    return acc;
  }, {});

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        fontFamily: "'DM Sans', sans-serif",
        color: "white",
      }}
    >
      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "linear-gradient(135deg, #FCD34D, #F97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>📸</div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 17, lineHeight: 1.1 }}>
                Company Gallery
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
                Events & Recognitions
              </p>
            </div>
          </div>

          {/* search */}
          <div className="relative hidden sm:block">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search gallery…"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "9px 16px 9px 36px",
                color: "white", fontSize: 13, outline: "none", width: 220,
              }}
              onFocus={e => e.target.style.borderColor = "#FCD34D"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10"
        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>

        {/* ── Page title ── */}
        <div className="mb-10">
          <p style={{ color: "#FCD34D", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
            Our Moments
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
            Gallery of <br className="hidden sm:block" />
            <span style={{ color: "#FCD34D" }}>Excellence</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 14, maxWidth: 500, lineHeight: 1.7, fontSize: 15 }}>
            Relive our events, celebrate our best students and customers, and witness the milestones that define us.
          </p>
        </div>

        {/* ── Spotlight ── */}
        <Spotlight images={IMAGES} />

        {/* ── Category pills ── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{
                flexShrink: 0,
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.2s",
                background: cat === c ? "#FCD34D" : "transparent",
                borderColor: cat === c ? "#FCD34D" : "rgba(255,255,255,0.15)",
                color: cat === c ? "#78350F" : "rgba(255,255,255,0.6)",
              }}
              onMouseEnter={e => { if (cat !== c) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "white"; } }}
              onMouseLeave={e => { if (cat !== c) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; } }}
            >
              {c}
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>({counts[c]})</span>
            </button>
          ))}
        </div>

        {/* mobile search */}
        <div className="relative sm:hidden mb-6">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search gallery…"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "10px 16px 10px 36px",
              color: "white", fontSize: 13, outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ── Badges row (Best Customer / Best Student) ── */}
        {cat === "All" && !search && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { badge: "Best Customer", label: "Best Customer of the Year", pick: IMAGES.find(i => i.badge === "Best Customer" && i.featured) },
              { badge: "Best Student",  label: "Best Student of the Quarter", pick: IMAGES.find(i => i.badge === "Best Student"  && i.featured) },
              { badge: "Award",         label: "Latest Award Recipient",      pick: IMAGES.find(i => i.badge === "Award"         && i.featured) },
            ].filter(r => r.pick).map(r => {
              const bm = BADGE_META[r.badge];
              return (
                <div key={r.badge} onClick={() => setLightbox(r.pick)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group"
                  style={{ height: 200 }}
                  onMouseEnter={e => e.currentTarget.querySelector("img").style.transform = "scale(1.07)"}
                  onMouseLeave={e => e.currentTarget.querySelector("img").style.transform = ""}
                >
                  <img src={r.pick.url} alt={r.pick.title}
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.5s ease" }}
                    onError={e => e.target.src = `https://picsum.photos/seed/${r.pick.id}/400/200`}
                  />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.1))" }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="self-start text-xs font-black px-3 py-1 rounded-full mb-2 uppercase tracking-widest"
                      style={{ background: bm.bg, color: bm.text, fontSize: 10 }}>
                      {bm.icon} {r.badge}
                    </span>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{r.label}</p>
                    <p className="text-white font-bold text-base leading-snug">{r.pick.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {[
            { n: IMAGES.length, label: "Photos" },
            { n: IMAGES.filter(i => i.category === "Events").length, label: "Events" },
            { n: IMAGES.filter(i => i.badge === "Best Customer").length, label: "Top Customers" },
            { n: IMAGES.filter(i => i.badge === "Best Student").length, label: "Top Students" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "16px 12px", textAlign: "center",
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#FCD34D", lineHeight: 1 }}>
                {s.n}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700 }}>
              {cat === "All" ? "All Photos" : cat}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
              {filtered.length} {filtered.length === 1 ? "photo" : "photos"} found
            </p>
          </div>
        </div>

        {/* ── Masonry-style grid ── */}
        {filtered.length > 0 ? (
          <div
            style={{
              columns: "auto",
              columnWidth: "clamp(240px, 30%, 340px)",
              gap: "16px",
            }}
          >
            {filtered.map((img, i) => (
              <div key={img.id} style={{
                breakInside: "avoid",
                marginBottom: "16px",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "none" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
              }}>
                <Card img={img} onClick={setLightbox} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 500 }}>No photos found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try a different category or search term</p>
            <button onClick={() => { setCat("All"); setSearch(""); }}
              style={{
                marginTop: 24, padding: "10px 24px", borderRadius: 999,
                background: "#FCD34D", color: "#78350F", fontWeight: 700,
                border: "none", cursor: "pointer", fontSize: 14,
              }}>
              Show all photos
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          marginTop: 80, paddingTop: 32,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexWrap: "wrap", justifyContent: "space-between",
          alignItems: "center", gap: 12,
        }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16 }}>
              Company Gallery
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
              © {new Date().getFullYear()} · All rights reserved
            </p>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            {IMAGES.length} photos · {CATS.length - 1} categories
          </p>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && <Lightbox img={lightbox} all={filtered.length ? filtered : IMAGES} onClose={() => setLightbox(null)} />}
    </div>
  );
}