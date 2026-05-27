import { useState, useRef, useCallback, useEffect } from "react";

/* ─── Fonts ─── */
const injectFonts = () => {
  if (document.getElementById("gf-gallery")) return;
  const l = document.createElement("link");
  l.id = "gf-gallery";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap";
  document.head.appendChild(l);
};

/* ─── Constants ─── */
const CATEGORIES = ["All", "Events", "Workers", "Students", "Best Customer", "Best Student", "Awards", "Team", "Milestones"];

const BADGE_OPTIONS = [
  { label: "None", value: "" },
  { label: "⭐ Best Customer", value: "⭐ Best Customer" },
  { label: "🎓 Best Student", value: "🎓 Best Student" },
  { label: "🏆 Award", value: "🏆 Award" },
  { label: "🌟 Featured", value: "🌟 Featured" },
  { label: "🥇 Top Performer", value: "🥇 Top Performer" },
  { label: "💼 Partner", value: "💼 Partner" },
  { label: "👔 Worker", value: "👔 Worker" },
  { label: "📚 Student", value: "📚 Student" },
];

const ADMIN_PASS = "admin123";

const INITIAL_IMAGES = [
  { id: 1, title: "Annual Gala 2024", category: "Events", badge: null, featured: true, date: "2024-12-15", description: "A night of celebration with our staff, partners and stakeholders.", thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=40&q=20", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80" },
  { id: 2, title: "Mrs. Adaeze Obi", category: "Best Customer", badge: "⭐ Best Customer", featured: true, date: "2024-11-20", description: "Loyal partner for 5+ years and our top client of 2024.", thumb: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=40&q=20", url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80" },
  { id: 3, title: "Emeka Chukwu", category: "Best Student", badge: "🎓 Best Student", featured: true, date: "2024-10-05", description: "Top performer across all modules in our professional training cohort.", thumb: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=40&q=20", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80" },
  { id: 4, title: "Product Launch Event", category: "Events", badge: null, featured: false, date: "2024-09-18", description: "Unveiling our flagship product line to media and early adopters.", thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=40&q=20", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80" },
  { id: 5, title: "CEO Excellence Award", category: "Awards", badge: "🏆 Award", featured: true, date: "2024-08-30", description: "Top performers recognised across all departments by the CEO.", thumb: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=40&q=20", url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900&q=80" },
  { id: 6, title: "Team Building Retreat", category: "Team", badge: null, featured: false, date: "2024-07-12", description: "Annual retreat focused on collaboration, trust and growth.", thumb: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=40&q=20", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80" },
  { id: 7, title: "Community Outreach Day", category: "Milestones", badge: null, featured: false, date: "2024-06-03", description: "Giving back — staff volunteered across local community projects.", thumb: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=40&q=20", url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80" },
  { id: 8, title: "Mr. Tunde Alausa", category: "Best Customer", badge: "⭐ Best Customer", featured: false, date: "2024-05-14", description: "Recognised for consistent patronage and business referrals.", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=20", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80" },
  { id: 9, title: "5-Year Milestone Celebration", category: "Milestones", badge: null, featured: true, date: "2024-04-01", description: "Marking five years of excellence, growth and impact.", thumb: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=40&q=20", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80" },
  { id: 10, title: "Amaka Nwosu", category: "Best Student", badge: "🎓 Best Student", featured: false, date: "2024-03-22", description: "Graduated with distinction from our advanced leadership programme.", thumb: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=40&q=20", url: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=900&q=80" },
  { id: 11, title: "Innovation Summit 2024", category: "Events", badge: null, featured: false, date: "2024-02-10", description: "Industry leaders gathered for a day of ideas, panels and networking.", thumb: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=40&q=20", url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=80" },
  { id: 12, title: "Directors' Award Night", category: "Awards", badge: "🏆 Award", featured: false, date: "2024-01-25", description: "Annual directors' recognition ceremony for staff excellence.", thumb: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=40&q=20", url: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=900&q=80" },
];

/* ─── Shared styles ─── */
const S = {
  input: {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "10px 14px",
    color: "white", fontSize: 13, outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
  },
  label: {
    display: "block", color: "rgba(255,255,255,0.4)",
    fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.12em", fontWeight: 500, marginBottom: 5,
  },
  btn: (active) => ({
    padding: "10px 20px", borderRadius: 10, fontWeight: 700,
    fontSize: 13, cursor: "pointer", border: "none",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
    background: active ? "#FCD34D" : "rgba(255,255,255,0.07)",
    color: active ? "#78350F" : "rgba(255,255,255,0.6)",
  }),
  goldBtn: {
    background: "#D4AF37", color: "#011F5B", border: "none",
    borderRadius: 10, padding: "11px 22px", fontWeight: 700,
    fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  ghostBtn: {
    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "10px 18px", fontWeight: 500,
    fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },
};

/* ─── Lazy Image ─── */
function LazyImg({ thumb, src, alt, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  const [fullSrc, setFullSrc] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    // If no thumb, just load directly
    if (!thumb) { setFullSrc(src); setLoaded(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const hi = new Image();
        hi.onload = () => { setFullSrc(src); setLoaded(true); };
        hi.onerror = () => { setFullSrc(src); setLoaded(true); };
        hi.src = src;
        obs.unobserve(el);
      }
    }, { rootMargin: "100px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src, thumb]);

  return (
    <img ref={ref} src={fullSrc || thumb || src} alt={alt}
      style={{
        ...style,
        filter: loaded ? "none" : "blur(8px)",
        transform: loaded ? "scale(1)" : "scale(1.04)",
        transition: "filter 0.45s ease, transform 0.45s ease",
      }}
      onError={e => { e.target.src = `https://picsum.photos/seed/${encodeURIComponent(alt)}/600/400`; }}
    />
  );
}

/* ─── Gallery Card ─── */
function GalleryCard({ img, onView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onView(img)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 16,
        cursor: "pointer", background: "#111",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.7)" : "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        <LazyImg
          thumb={img.thumb}
          src={img.url}
          alt={img.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 12,
      }}>
        {img.badge && (
          <span style={{
            display: "inline-block", fontSize: 9, fontWeight: 700,
            padding: "3px 8px", borderRadius: 999, marginBottom: 5,
            background: "#FCD34D", color: "#78350F",
            textTransform: "uppercase", letterSpacing: "0.07em",
          }}>{img.badge}</span>
        )}
        <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{img.title}</p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginTop: 3 }}>{img.date}</p>
      </div>
      {img.featured && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 8, height: 8, borderRadius: "50%",
          background: "#34d399", boxShadow: "0 0 7px #34d399",
        }} />
      )}
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ img, all, onClose }) {
  const [idx, setIdx] = useState(all.findIndex(i => i.id === img.id));
  const current = all[idx] || img;

  const go = useCallback((d) => setIdx(i => (i + d + all.length) % all.length), [all]);

  useEffect(() => {
    const fn = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [go, onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.96)" }} />
      <div
        style={{
          position: "relative", zIndex: 1, width: "100%",
          background: "#0F0F0F", display: "flex", flexDirection: "column",
          maxHeight: "92vh", overflow: "hidden",
          borderRadius: "20px 20px 0 0",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* On wider screens, side-by-side */}
        <div style={{ display: "flex", flexDirection: "row", height: "100%", overflow: "hidden" }}>
          {/* Image */}
          <div style={{ position: "relative", flexShrink: 0, background: "#000", width: "58%", minHeight: 260 }}>
            <img src={current.url} alt={current.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.target.src = `https://picsum.photos/seed/${current.id}/700/500`; }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
            {["←", "→"].map((a, i) => (
              <button key={a} onClick={() => go(i === 0 ? -1 : 1)}
                style={{
                  position: "absolute", top: "50%", transform: "translateY(-50%)",
                  [i === 0 ? "left" : "right"]: 10,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)", color: "#fff",
                  fontSize: 16, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{a}</button>
            ))}
            <div style={{
              position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.6)",
              fontSize: 11, padding: "3px 10px", borderRadius: 999,
            }}>{idx + 1} / {all.length}</div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, padding: "20px 24px 24px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <button onClick={onClose}
              style={{
                alignSelf: "flex-end", width: 30, height: 30, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 18,
                border: "none", cursor: "pointer", marginBottom: 16, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>

            {current.badge && (
              <span style={{
                display: "inline-block", fontSize: 10, fontWeight: 700,
                padding: "4px 10px", borderRadius: 999, marginBottom: 14,
                background: "#FCD34D", color: "#78350F",
                alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{current.badge}</span>
            )}

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              {current.title}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{current.description}</p>

            <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
              {[{ label: "Category", value: current.category }, { label: "Date", value: current.date }].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>{r.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
              {current.featured && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#34d399" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399" }} />
                  Featured photo
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Login ─── */
function AdminLogin({ onLogin, onBack }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pass === ADMIN_PASS) { onLogin(); setErr(false); }
    else setErr(true);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#111", borderRadius: 20, padding: 36, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px",
            background: "linear-gradient(135deg, #D4AF37, #011F5B)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>🔐</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>Admin Panel</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Enter your password to manage the gallery</p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <input type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Password (hint: admin123)"
            style={{ ...S.input }}
            onFocus={e => e.target.style.borderColor = "#D4AF37"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
          />
        </div>

        {err && <p style={{ color: "#F87171", fontSize: 12, marginBottom: 10 }}>Incorrect password. Try again.</p>}

        <button onClick={submit} style={{ ...S.goldBtn, width: "100%", marginBottom: 10 }}>
          Login to Admin
        </button>
        <button onClick={onBack} style={{ ...S.ghostBtn, width: "100%", textAlign: "center" }}>
          ← Back to Gallery
        </button>
      </div>
    </div>
  );
}

/* ─── Admin Panel ─── */
function AdminPanel({ images, setImages, onBack }) {
  const [tab, setTab] = useState("upload");
  const blankForm = () => ({ title: "", category: "Events", badge: "", description: "", date: new Date().toISOString().slice(0, 10), featured: false, url: "", thumb: "" });
  const [form, setForm] = useState(blankForm());
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileRef = useRef();

  const notify = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 4000); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm(f => ({ ...f, url: ev.target.result, thumb: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm(f => ({ ...f, url: ev.target.result, thumb: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const submitUpload = () => {
    if (!form.title.trim()) { notify("❌ Please enter a title."); return; }
    if (!form.url.trim()) { notify("❌ Please provide an image (upload or URL)."); return; }

    if (editId) {
      setImages(imgs => imgs.map(img =>
        img.id === editId
          ? { ...img, ...form, badge: form.badge || null, thumb: form.thumb || form.url }
          : img
      ));
      notify("✅ Image updated successfully!");
      setEditId(null);
    } else {
      const newImg = { ...form, id: Date.now(), badge: form.badge || null, thumb: form.thumb || form.url };
      setImages(imgs => [...imgs, newImg]);
      notify("✅ Image uploaded successfully!");
    }
    setForm(blankForm());
    setPreview(null);
  };

  const startEdit = (img) => {
    setForm({
      title: img.title, category: img.category,
      badge: img.badge || "", description: img.description,
      date: img.date, featured: img.featured,
      url: img.url, thumb: img.thumb || "",
    });
    setPreview(img.url);
    setEditId(img.id);
    setTab("upload");
    window.scrollTo(0, 0);
  };

  const deleteImg = (id) => {
    setImages(imgs => imgs.filter(i => i.id !== id));
    setConfirmDelete(null);
    notify("🗑️ Image deleted.");
  };

  const toggleFeatured = (id) =>
    setImages(imgs => imgs.map(i => i.id === id ? { ...i, featured: !i.featured } : i));

  const field = (label, children) => (
    <div style={{ marginBottom: 16 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = (focused) => ({
    ...S.input,
    borderColor: focused ? "#FCD34D" : "rgba(255,255,255,0.12)",
  });

  /* Focus tracking */
  const [focused, setFocused] = useState({});
  const fProps = (key) => ({
    onFocus: () => setFocused(f => ({ ...f, [key]: true })),
    onBlur: () => setFocused(f => ({ ...f, [key]: false })),
    style: inputStyle(focused[key]),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Admin nav — matches gallery nav style */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(8,8,8,0.88)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #D4AF37, #011F5B)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>⚙️</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 15, lineHeight: 1.1 }}>Admin Panel</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>Manage Gallery</div>
          </div>
        </div>
        <button onClick={onBack} style={{ ...S.ghostBtn, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to Gallery
        </button>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Success / Error toast */}
        {success && (
          <div style={{
            marginBottom: 20, padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500,
            background: success.startsWith("✅") ? "rgba(52,211,153,0.12)" : success.startsWith("🗑️") ? "rgba(251,191,36,0.12)" : "rgba(248,113,113,0.12)",
            border: `1px solid ${success.startsWith("✅") ? "rgba(52,211,153,0.3)" : success.startsWith("🗑️") ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)"}`,
            color: success.startsWith("✅") ? "#34d399" : success.startsWith("🗑️") ? "#FCD34D" : "#F87171",
          }}>{success}</div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, background: "rgba(255,255,255,0.05)", padding: 5, borderRadius: 14, width: "fit-content" }}>
          {[["upload", "📤 Upload"], ["manage", "🗂️ Manage"], ["featured", "⭐ Featured"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={S.btn(tab === key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Upload / Edit Tab ── */}
        {tab === "upload" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {/* Left — Form */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 20 }}>
                {editId ? "✏️ Edit Image" : "📤 Upload New Image"}
              </h2>

              {/* Drop zone */}
              <div
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current.click()}
                style={{
                  border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 14, padding: 24,
                  textAlign: "center", cursor: "pointer", marginBottom: 14,
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#D4AF37"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
              >
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
                {preview ? (
                  <img src={preview} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} />
                ) : (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                      Drag & drop or <span style={{ color: "#D4AF37" }}>click to browse</span>
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, marginTop: 4 }}>PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
              </div>

              {field("Or paste image URL",
                <input type="text" value={form.url.startsWith("data:") ? "" : form.url}
                  onChange={e => { setForm(f => ({ ...f, url: e.target.value, thumb: e.target.value })); setPreview(e.target.value); }}
                  placeholder="https://example.com/photo.jpg"
                  {...fProps("url")}
                />
              )}

              {field("Title *",
                <input type="text" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Best Customer of the Month – John Doe"
                  {...fProps("title")}
                />
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    style={{ ...S.input }}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Date</label>
                  <input type="date" value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    style={{ ...S.input }}
                  />
                </div>
              </div>

              {field("Badge / Recognition",
                <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  style={{ ...S.input }}>
                  {BADGE_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              )}

              {field("Description",
                <textarea value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Brief description of this photo or event…"
                  style={{ ...S.input, resize: "none" }}
                />
              )}

              {/* Featured toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                  style={{
                    width: 44, height: 24, borderRadius: 999, cursor: "pointer",
                    background: form.featured ? "#FCD34D" : "rgba(255,255,255,0.1)",
                    position: "relative", transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3,
                    left: form.featured ? 23 : 3,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#fff", transition: "left 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }} />
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Mark as Featured</span>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={submitUpload} style={{ ...S.goldBtn, flex: 1 }}>
                  {editId ? "Update Image" : "Upload Image"}
                </button>
                {editId && (
                  <button onClick={() => { setEditId(null); setForm(blankForm()); setPreview(null); }}
                    style={S.ghostBtn}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Right — Live Preview (matches gallery card exactly) */}
            <div>
              <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 14 }}>
                Live Preview — how it looks in the gallery
              </h3>

              {preview ? (
                <div style={{ maxWidth: 320 }}>
                  {/* Card preview */}
                  <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#111", marginBottom: 16 }}>
                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                      <img src={preview} alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={e => { e.target.src = "https://via.placeholder.com/320x240?text=Invalid+URL"; }}
                      />
                    </div>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                      display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 12,
                    }}>
                      {form.badge && (
                        <span style={{
                          display: "inline-block", fontSize: 9, fontWeight: 700,
                          padding: "3px 8px", borderRadius: 999, marginBottom: 5,
                          background: "#D4AF37", color: "#011F5B",
                          textTransform: "uppercase", letterSpacing: "0.07em", alignSelf: "flex-start",
                        }}>{form.badge}</span>
                      )}
                      <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{form.title || "Untitled"}</p>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginTop: 3 }}>{form.date || "No date"}</p>
                    </div>
                    {form.featured && (
                      <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 7px #34d399" }} />
                    )}
                  </div>

                  {/* Lightbox info preview */}
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
                    <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>Lightbox info panel</p>
                    {form.badge && (
                      <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, marginBottom: 8, background: "#D4AF37", color: "#011F5B", textTransform: "uppercase" }}>{form.badge}</span>
                    )}
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{form.title || "Untitled"}</p>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{form.description || "No description yet."}</p>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>Category</span>
                        <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{form.category}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>Date</span>
                        <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{form.date}</span>
                      </div>
                      {form.featured && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34d399" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                          Featured photo
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  aspectRatio: "4/3", maxWidth: 320,
                  background: "rgba(255,255,255,0.04)", borderRadius: 16,
                  border: "1px dashed rgba(255,255,255,0.1)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.25)",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
                  <p style={{ fontSize: 12 }}>Preview appears here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Manage Tab ── */}
        {tab === "manage" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 20 }}>
              🗂️ All Images ({images.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {images.map(img => (
                <div key={img.id} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "12px 16px",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                >
                  {/* Thumbnail */}
                  <img src={img.thumb || img.url} alt={img.title}
                    style={{ width: 72, height: 52, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                    onError={e => { e.target.src = `https://picsum.photos/seed/${img.id}/72/52`; }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{img.title}</span>
                      {img.badge && (
                        <span style={{ background: "rgba(252,211,77,0.15)", color: "#FCD34D", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>{img.badge}</span>
                      )}
                      {img.featured && (
                        <span style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>Featured</span>
                      )}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, display: "flex", gap: 12 }}>
                      <span>{img.category}</span>
                      <span>{img.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => toggleFeatured(img.id)} title="Toggle featured"
                      style={{
                        width: 34, height: 34, borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: img.featured ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
                        color: img.featured ? "#34d399" : "rgba(255,255,255,0.4)",
                        transition: "all 0.2s",
                      }}>⭐</button>
                    <button onClick={() => startEdit(img)} title="Edit"
                      style={{
                        width: 34, height: 34, borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.color = "#60a5fa"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                    >✏️</button>
                    <button onClick={() => setConfirmDelete(img.id)} title="Delete"
                      style={{
                        width: 34, height: 34, borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.15)"; e.currentTarget.style.color = "#F87171"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                    >🗑️</button>
                  </div>
                </div>
              ))}

              {images.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>📂</div>
                  <p style={{ fontSize: 15 }}>No images yet. Upload your first image!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Featured Tab ── */}
        {tab === "featured" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 6 }}>⭐ Featured & Highlighted</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>
              These images appear with a green dot in the gallery. Toggle from the Manage tab.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 12 }}>
              {images.filter(i => i.featured || i.badge).map(img => (
                <div key={img.id} style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer" }}
                  onClick={() => startEdit(img)} title="Click to edit">
                  <img src={img.thumb || img.url} alt={img.title}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                    onError={e => { e.target.src = `https://picsum.photos/seed/${img.id}/200/150`; }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 10 }}>
                    {img.badge && <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999, marginBottom: 5, background: "#FCD34D", color: "#78350F", alignSelf: "flex-start", textTransform: "uppercase" }}>{img.badge}</span>}
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{img.title}</p>
                  </div>
                  {img.featured && <div style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />}
                  <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)", fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>click to edit</div>
                </div>
              ))}
              {images.filter(i => i.featured || i.badge).length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px 0", color: "rgba(255,255,255,0.25)" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>⭐</div>
                  <p>No featured images yet. Mark images as featured from the Manage tab.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111", borderRadius: 18, padding: 28, maxWidth: 340, width: "100%", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: 8 }}>Delete this image?</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...S.ghostBtn, flex: 1 }}>Cancel</button>
              <button onClick={() => deleteImg(confirmDelete)} style={{ flex: 1, background: "#F87171", color: "#7F1D1D", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main App ─── */
export default function GalleryApp() {
  useEffect(() => { injectFonts(); }, []);

  const [images, setImages] = useState(INITIAL_IMAGES);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [view, setView] = useState("gallery"); // gallery | admin-login | admin
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const filtered = images.filter(img =>
    (cat === "All" || img.category === cat) &&
    (img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (view === "admin-login") return <AdminLogin onLogin={() => setView("admin")} onBack={() => setView("gallery")} />;
  if (view === "admin") return <AdminPanel images={images} setImages={setImages} onBack={() => setView("gallery")} />;

  const counts = CATEGORIES.reduce((acc, c) => {
    acc[c] = c === "All" ? images.length : images.filter(i => i.category === c).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(8,8,8,0.88)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #FCD34D, #F97316)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>📸</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 15, lineHeight: 1.1 }}>Company Gallery</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>Events & Recognitions</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "8px 14px 8px 28px", color: "#fff", fontSize: 12,
                outline: "none", width: 170, fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#FCD34D"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Admin button */}
          <button onClick={() => setView("admin-login")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#FCD34D", color: "#78350F",
              border: "none", borderRadius: 10, padding: "8px 16px",
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
            ⚙️ Admin
          </button>
        </div>
      </nav>

      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px",
        opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(14px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "#FCD34D", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>Our Moments</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 900, lineHeight: 1.1 }}>
            Gallery of <span style={{ color: "#FCD34D" }}>Excellence</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 10, maxWidth: 460, lineHeight: 1.7, fontSize: 13 }}>
            Relive our events, celebrate our best students and customers, and witness the milestones that define us.
          </p>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 999,
                fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s",
                background: cat === c ? "#FCD34D" : "transparent",
                borderColor: cat === c ? "#FCD34D" : "rgba(255,255,255,0.15)",
                color: cat === c ? "#78350F" : "rgba(255,255,255,0.55)",
              }}>
              {c}
              <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.6 }}>({counts[c]})</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 28 }}>
          {[
            { n: images.length, label: "Photos" },
            { n: images.filter(i => i.category === "Events").length, label: "Events" },
            { n: images.filter(i => i.badge && i.badge.includes("Customer")).length, label: "Top Customers" },
            { n: images.filter(i => i.badge && i.badge.includes("Student")).length, label: "Top Students" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "12px 8px", textAlign: "center",
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.1rem,2.5vw,1.7rem)", fontWeight: 900, color: "#FCD34D", lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700 }}>
            {cat === "All" ? "All Photos" : cat}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            {filtered.length} {filtered.length === 1 ? "photo" : "photos"} found
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
            {filtered.map(img => (
              <GalleryCard key={img.id} img={img} onView={setLightbox} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "70px 0", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No photos found</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Try a different category or search term</p>
            <button onClick={() => { setCat("All"); setSearch(""); }}
              style={{ ...S.goldBtn, marginTop: 20 }}>
              Show all photos
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 70, paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10,
        }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 15 }}>Company Gallery</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
              © {new Date().getFullYear()} · All rights reserved
            </p>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
            {images.length} photos · {CATEGORIES.length - 1} categories
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox img={lightbox} all={filtered.length ? filtered : images} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}