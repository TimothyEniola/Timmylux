import { useState, useRef, useCallback } from "react";

const CATEGORIES = ["All", "Events", "Best Customer", "Best Student", "Awards", "Team", "Milestones"];

const INITIAL_IMAGES = [
  {
    id: 1, title: "Annual Gala 2024", category: "Events",
    badge: null, featured: true, date: "2024-12-15",
    description: "Our yearly company celebration with staff and partners.",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    uploader: "Admin"
  },
  {
    id: 2, title: "Customer of the Year – Mrs. Adaeze Obi", category: "Best Customer",
    badge: "⭐ Best Customer", featured: true, date: "2024-11-20",
    description: "Loyal partner for 5+ years and our top client of 2024.",
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    uploader: "Admin"
  },
  {
    id: 3, title: "Student of the Quarter – Emeka Chukwu", category: "Best Student",
    badge: "🎓 Best Student", featured: false, date: "2024-10-05",
    description: "Top performer in our professional training program.",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    uploader: "Admin"
  },
  {
    id: 4, title: "Product Launch Event", category: "Events",
    badge: null, featured: false, date: "2024-09-18",
    description: "Launch of our flagship product line to the market.",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    uploader: "Admin"
  },
  {
    id: 5, title: "Excellence Award – CEO Recognition", category: "Awards",
    badge: "🏆 Award", featured: true, date: "2024-08-30",
    description: "CEO presented awards to top performers across all departments.",
    url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
    uploader: "Admin"
  },
  {
    id: 6, title: "Team Building Retreat", category: "Team",
    badge: null, featured: false, date: "2024-07-12",
    description: "Annual team retreat focused on collaboration and growth.",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    uploader: "Admin"
  },
];

const BADGE_OPTIONS = [
  { label: "None", value: "" },
  { label: "⭐ Best Customer", value: "⭐ Best Customer" },
  { label: "🎓 Best Student", value: "🎓 Best Student" },
  { label: "🏆 Award", value: "🏆 Award" },
  { label: "🌟 Featured", value: "🌟 Featured" },
  { label: "🥇 Top Performer", value: "🥇 Top Performer" },
  { label: "💼 Partner", value: "💼 Partner" },
];

const ADMIN_PASS = "admin123";

function GalleryCard({ img, onView }) {
  return (
    <div
      onClick={() => onView(img)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={img.url}
          alt={img.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/600/400`; }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white font-semibold text-sm truncate">{img.title}</p>
        <p className="text-gray-300 text-xs mt-1">{img.date}</p>
      </div>
      {img.badge && (
        <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow">
          {img.badge}
        </div>
      )}
      {img.featured && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
      )}
    </div>
  );
}

function Modal({ img, onClose, onNext, onPrev }) {
  if (!img) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xl transition-colors">×</button>
        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors">‹</button>
        <button onClick={onNext} className="absolute right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors">›</button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img
            src={img.url}
            alt={img.title}
            className="w-full h-72 md:h-full object-cover"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/600/400`; }}
          />
          <div className="p-8 flex flex-col justify-center">
            {img.badge && <span className="self-start bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-4">{img.badge}</span>}
            <h2 className="text-white text-2xl font-bold mb-2">{img.title}</h2>
            <p className="text-gray-400 text-sm mb-4">{img.description}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2"><span className="text-gray-400">Category:</span><span className="bg-gray-800 text-gray-200 px-2 py-0.5 rounded-md">{img.category}</span></div>
              <div className="flex items-center gap-2"><span className="text-gray-400">Date:</span><span className="text-gray-300">{img.date}</span></div>
              {img.featured && <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full inline-block" /><span className="text-green-400">Featured</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pass === ADMIN_PASS) { onLogin(); setErr(false); }
    else setErr(true);
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
          <h2 className="text-white text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your admin password to continue</p>
        </div>
        <input
          type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Password (hint: admin123)"
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 mb-3 outline-none focus:border-amber-400 transition-colors placeholder-gray-600"
        />
        {err && <p className="text-red-400 text-sm mb-3">Incorrect password. Try again.</p>}
        <button onClick={submit} className="w-full bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold py-3 rounded-xl transition-colors">
          Login to Admin
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ images, setImages, onBack }) {
  const [tab, setTab] = useState("upload");
  const [form, setForm] = useState({ title: "", category: "Events", badge: "", description: "", date: new Date().toISOString().slice(0,10), featured: false, url: "" });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setForm(f => ({ ...f, url: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setForm(f => ({ ...f, url: ev.target.result })); };
    reader.readAsDataURL(file);
  }, []);

  const submitUpload = () => {
    if (!form.title || !form.url) { setSuccess("❌ Please provide a title and image."); return; }
    if (editId) {
      setImages(imgs => imgs.map(img => img.id === editId ? { ...img, ...form, badge: form.badge || null } : img));
      setSuccess("✅ Image updated successfully!");
      setEditId(null);
    } else {
      const newImg = { ...form, id: Date.now(), badge: form.badge || null, uploader: "Admin" };
      setImages(imgs => [...imgs, newImg]);
      setSuccess("✅ Image uploaded successfully!");
    }
    setForm({ title: "", category: "Events", badge: "", description: "", date: new Date().toISOString().slice(0,10), featured: false, url: "" });
    setPreview(null);
    setTimeout(() => setSuccess(""), 4000);
  };

  const deleteImg = (id) => {
    if (window.confirm("Delete this image?")) setImages(imgs => imgs.filter(i => i.id !== id));
  };

  const editImg = (img) => {
    setForm({ title: img.title, category: img.category, badge: img.badge || "", description: img.description, date: img.date, featured: img.featured, url: img.url });
    setPreview(img.url);
    setEditId(img.id);
    setTab("upload");
    window.scrollTo(0, 0);
  };

  const toggleFeatured = (id) => setImages(imgs => imgs.map(i => i.id === id ? { ...i, featured: !i.featured } : i));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-sm">⚙️</div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          ← Back to Gallery
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {success && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${success.startsWith("✅") ? "bg-green-900/50 text-green-300 border border-green-800" : "bg-red-900/50 text-red-300 border border-red-800"}`}>
            {success}
          </div>
        )}

        <div className="flex gap-2 mb-8 bg-gray-900 p-1 rounded-2xl w-fit">
          {[["upload", "📤 Upload"], ["manage", "🗂️ Manage"], ["featured", "⭐ Featured"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? "bg-amber-400 text-amber-900" : "text-gray-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h2 className="text-xl font-bold">{editId ? "✏️ Edit Image" : "📤 Upload New Image"}</h2>

              <div
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-700 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                ) : (
                  <div>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🖼️</div>
                    <p className="text-gray-400 text-sm">Drag & drop an image or <span className="text-amber-400">click to browse</span></p>
                    <p className="text-gray-600 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wide">Or paste image URL</label>
                <input type="text" value={form.url.startsWith("data:") ? "" : form.url}
                  onChange={e => { setForm(f => ({ ...f, url: e.target.value })); setPreview(e.target.value); }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mt-1 outline-none focus:border-amber-400 transition-colors placeholder-gray-600 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wide">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Best Customer of the Month – John Doe"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mt-1 outline-none focus:border-amber-400 transition-colors placeholder-gray-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wide">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mt-1 outline-none focus:border-amber-400 transition-colors text-sm">
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wide">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mt-1 outline-none focus:border-amber-400 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wide">Badge / Recognition</label>
                <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mt-1 outline-none focus:border-amber-400 transition-colors text-sm">
                  {BADGE_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Brief description of this photo/event..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mt-1 outline-none focus:border-amber-400 transition-colors placeholder-gray-600 text-sm resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-12 h-6 rounded-full transition-colors ${form.featured ? "bg-amber-400" : "bg-gray-700"} relative`}
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.featured ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Mark as Featured</span>
              </label>

              <div className="flex gap-3">
                <button onClick={submitUpload}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold py-3 rounded-xl transition-colors">
                  {editId ? "Update Image" : "Upload Image"}
                </button>
                {editId && (
                  <button onClick={() => { setEditId(null); setForm({ title: "", category: "Events", badge: "", description: "", date: new Date().toISOString().slice(0,10), featured: false, url: "" }); setPreview(null); }}
                    className="px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-3 rounded-xl transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 h-fit">
              <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-4">Preview</h3>
              {preview ? (
                <div className="rounded-xl overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img src={preview} alt="preview" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x225?text=Invalid+URL"; }} />
                  </div>
                  <div className="p-4 bg-gray-800 rounded-b-xl">
                    {form.badge && <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">{form.badge}</span>}
                    <h4 className="text-white font-semibold mt-2">{form.title || "Untitled"}</h4>
                    <p className="text-gray-400 text-sm mt-1">{form.description || "No description"}</p>
                    <div className="flex gap-3 mt-3 text-xs text-gray-500">
                      <span>{form.category}</span>
                      <span>{form.date}</span>
                      {form.featured && <span className="text-green-400">● Featured</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm">Image preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "manage" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">🗂️ All Images ({images.length})</h2>
            </div>
            <div className="space-y-3">
              {images.map(img => (
                <div key={img.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-600 transition-colors">
                  <img src={img.url} alt={img.title} className="w-20 h-14 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/80/56`; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white font-semibold text-sm truncate">{img.title}</h4>
                      {img.badge && <span className="bg-amber-400/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">{img.badge}</span>}
                      {img.featured && <span className="bg-green-400/20 text-green-400 text-xs px-2 py-0.5 rounded-full">Featured</span>}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>{img.category}</span>
                      <span>{img.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleFeatured(img.id)}
                      className={`p-2 rounded-lg text-sm transition-colors ${img.featured ? "bg-green-900/50 text-green-400 hover:bg-green-900" : "bg-gray-800 text-gray-500 hover:text-white"}`}
                      title="Toggle featured">⭐</button>
                    <button onClick={() => editImg(img)}
                      className="p-2 bg-gray-800 hover:bg-blue-900/50 hover:text-blue-400 text-gray-400 rounded-lg text-sm transition-colors"
                      title="Edit">✏️</button>
                    <button onClick={() => deleteImg(img.id)}
                      className="p-2 bg-gray-800 hover:bg-red-900/50 hover:text-red-400 text-gray-400 rounded-lg text-sm transition-colors"
                      title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="text-center text-gray-600 py-16">
                  <div className="text-5xl mb-3">📂</div>
                  <p>No images yet. Upload your first image!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "featured" && (
          <div>
            <h2 className="text-xl font-bold mb-2">⭐ Featured & Highlighted</h2>
            <p className="text-gray-500 text-sm mb-6">These images appear first in the gallery. Toggle from Manage tab.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.filter(i => i.featured || i.badge).map(img => (
                <div key={img.id} className="relative rounded-xl overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-32 object-cover"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/200/130`; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                    <p className="text-white text-xs font-medium truncate">{img.title}</p>
                  </div>
                  {img.badge && <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">{img.badge}</div>}
                </div>
              ))}
              {images.filter(i => i.featured || i.badge).length === 0 && (
                <div className="col-span-4 text-center text-gray-600 py-10">
                  <div className="text-4xl mb-2">⭐</div>
                  <p>No featured images yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryApp() {
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [view, setView] = useState("gallery"); // gallery | admin-login | admin
  const [layout, setLayout] = useState("grid"); // grid | masonry

  const filtered = images.filter(img =>
    (activeCategory === "All" || img.category === activeCategory) &&
    (img.title.toLowerCase().includes(search.toLowerCase()) || img.description.toLowerCase().includes(search.toLowerCase()))
  );

  const featuredFirst = [...filtered.filter(i => i.featured), ...filtered.filter(i => !i.featured)];

  const currentIdx = selectedImg ? featuredFirst.findIndex(i => i.id === selectedImg.id) : -1;

  if (view === "admin-login") return <AdminLogin onLogin={() => setView("admin")} />;
  if (view === "admin") return <AdminPanel images={images} setImages={setImages} onBack={() => setView("gallery")} />;

  const stats = {
    total: images.length,
    events: images.filter(i => i.category === "Events").length,
    customers: images.filter(i => i.category === "Best Customer").length,
    students: images.filter(i => i.category === "Best Student").length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-lg">📸</div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">Company Gallery</h1>
              <p className="text-gray-500 text-xs hidden sm:block">Events & Recognitions</p>
            </div>
          </div>
          <button onClick={() => setView("admin-login")}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            ⚙️ <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Photos", value: stats.total, icon: "🖼️", color: "from-blue-900/50 to-blue-800/30 border-blue-800/50" },
            { label: "Events", value: stats.events, icon: "🎉", color: "from-purple-900/50 to-purple-800/30 border-purple-800/50" },
            { label: "Best Customers", value: stats.customers, icon: "⭐", color: "from-amber-900/50 to-amber-800/30 border-amber-800/50" },
            { label: "Best Students", value: stats.students, icon: "🎓", color: "from-green-900/50 to-green-800/30 border-green-800/50" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-4`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Hero Featured */}
        {images.some(i => i.featured && i.category === "Best Customer") && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Best Customer", "Best Student"].map(cat => {
              const img = images.find(i => i.category === cat && i.featured);
              if (!img) return null;
              return (
                <div key={cat} onClick={() => setSelectedImg(img)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group border border-amber-500/30 bg-gray-900">
                  <img src={img.url} alt={img.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/400/200`; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">{img.badge}</div>
                    <p className="text-white font-bold">{img.title}</p>
                  </div>
                </div>
              );
            })}
            {images.filter(i => i.category === "Awards" && i.featured).slice(0, 1).map(img => (
              <div key={img.id} onClick={() => setSelectedImg(img)}
                className="relative overflow-hidden rounded-2xl cursor-pointer group border border-amber-500/30 bg-gray-900">
                <img src={img.url} alt={img.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/400/200`; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {img.badge && <div className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">{img.badge}</div>}
                  <p className="text-white font-bold">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search photos..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-amber-400 transition-colors placeholder-gray-600"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLayout("grid")}
              className={`px-4 py-2 rounded-xl text-sm transition-colors ${layout === "grid" ? "bg-amber-400 text-amber-900" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
              ⊞ Grid
            </button>
            <button onClick={() => setLayout("list")}
              className={`px-4 py-2 rounded-xl text-sm transition-colors ${layout === "list" ? "bg-amber-400 text-amber-900" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
              ≡ List
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat ? "bg-amber-400 text-amber-900" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"}`}>
              {cat}
              <span className={`ml-2 text-xs ${activeCategory === cat ? "text-amber-900/60" : "text-gray-600"}`}>
                {cat === "All" ? images.length : images.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredFirst.map(img => (
              <GalleryCard key={img.id} img={img} onView={setSelectedImg} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {featuredFirst.map(img => (
              <div key={img.id} onClick={() => setSelectedImg(img)}
                className="flex gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-gray-600 transition-colors group">
                <img src={img.url} alt={img.title} className="w-24 h-16 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${img.id}/96/64`; }} />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">{img.title}</h3>
                    {img.badge && <span className="bg-amber-400/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">{img.badge}</span>}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{img.description}</p>
                  <div className="flex gap-3 text-xs text-gray-600 mt-1">
                    <span>{img.category}</span>
                    <span>{img.date}</span>
                  </div>
                </div>
                <div className="text-gray-600 group-hover:text-gray-400 transition-colors self-center">›</div>
              </div>
            ))}
          </div>
        )}

        {featuredFirst.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg">No photos found</p>
            <p className="text-sm mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <Modal
          img={selectedImg}
          onClose={() => setSelectedImg(null)}
          onNext={() => setSelectedImg(featuredFirst[(currentIdx + 1) % featuredFirst.length])}
          onPrev={() => setSelectedImg(featuredFirst[(currentIdx - 1 + featuredFirst.length) % featuredFirst.length])}
        />
      )}
    </div>
  );
}