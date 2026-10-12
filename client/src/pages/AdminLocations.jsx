import { useState } from "react";
import { ExternalLink, ImagePlus, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { readStoredArray } from "../utils/storage";

const emptyLocation = {
  name: "",
  address: "",
  isOpen: false,
  phone: "",
  hours: "",
  mapUrl: "",
  image: "",
};

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be opened."));
    };
    image.src = objectUrl;
  });
}

export default function AdminLocations() {
  const [locations, setLocations] = useState(() => readStoredArray("companyLocations"));
  const [form, setForm] = useState({ ...emptyLocation });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const saveLocations = (nextLocations) => {
    try {
      window.localStorage.setItem("companyLocations", JSON.stringify(nextLocations));
      setLocations(nextLocations);
      return true;
    } catch {
      toast.error("Could not save this location in the browser. Try a smaller photo.");
      return false;
    }
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast.error("Choose an image no larger than 10 MB.");
      event.target.value = "";
      return;
    }
    setSaving(true);
    try {
      const imageData = await resizeImage(file);
      setForm((current) => ({ ...current, image: imageData }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const location = { ...form, id: editingId || Date.now().toString() };
    const nextLocations = editingId
      ? locations.map((item) => item.id === editingId ? location : item)
      : [location, ...locations];
    if (!saveLocations(nextLocations)) return;
    setForm({ ...emptyLocation });
    setEditingId(null);
    toast.success(editingId ? "Location updated." : "Location added.");
  };

  const editLocation = (location) => {
    setForm({ ...emptyLocation, ...location });
    setEditingId(location.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteLocation = (id) => {
    if (saveLocations(locations.filter((location) => location.id !== id))) {
      if (editingId === id) {
        setForm({ ...emptyLocation });
        setEditingId(null);
      }
      toast.success("Location removed.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-7 flex items-center gap-3">
          <MapPin className="text-primary" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-navy">Company Locations</h1>
            <p className="text-sm text-gray-600">Add branch details and an office photo for customers.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-8 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Location name *
            <input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ogun showroom" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Phone
            <input type="tel" maxLength={40} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+234 ..." className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(form.isOpen)}
              onChange={(event) => setForm({ ...form, isOpen: event.target.checked })}
              className="h-4 w-4 accent-emerald-700"
            />
            Branch is currently open
          </label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Address *
            <textarea required maxLength={300} rows={2} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Opening hours
            <input maxLength={120} value={form.hours} onChange={(event) => setForm({ ...form, hours: event.target.value })} placeholder="Mon-Sat, 9:00 AM-6:00 PM" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-gray-700">Map link
            <input type="url" value={form.mapUrl} onChange={(event) => setForm({ ...form, mapUrl: event.target.value })} placeholder="https://maps.google.com/..." className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <div className="sm:col-span-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-navy hover:bg-gray-50">
              <ImagePlus size={17} /> {saving ? "Preparing photo..." : "Choose office photo"}
              <input type="file" accept="image/*" onChange={handleImage} disabled={saving} className="sr-only" />
            </label>
            {form.image && <img src={form.image} alt="Office preview" className="mt-3 h-40 w-full max-w-sm rounded object-cover" />}
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded bg-navy px-4 py-2 font-semibold text-white disabled:opacity-50">
              {editingId ? <Pencil size={16} /> : <Plus size={16} />}
              {editingId ? "Save location" : "Add location"}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyLocation }); }} className="rounded border border-gray-300 px-4 py-2">Cancel</button>}
          </div>
        </form>

        <div className="divide-y divide-gray-200 border-y border-gray-200 bg-white">
          {locations.map((location) => (
            <article key={location.id} className="grid gap-4 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center">
              {location.image ? <img src={location.image} alt={`${location.name} office`} className="aspect-[4/3] w-full rounded object-cover sm:w-[180px]" /> : <div className="flex aspect-[4/3] w-full items-center justify-center rounded bg-gray-100 text-gray-400 sm:w-[180px]"><ImagePlus size={24} /></div>}
              <div>
                <h2 className="font-semibold text-navy">{location.name}</h2>
                <p className={`mt-1 inline-flex items-center gap-2 text-sm font-semibold ${location.isOpen ? "text-emerald-700" : "text-red-700"}`}>
                  <span className={`h-2 w-2 rounded-full ${location.isOpen ? "bg-emerald-600" : "bg-red-600"}`} />
                  {location.isOpen ? "Open" : "Closed"}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{location.address}</p>
                {location.phone && <p className="mt-1 text-sm text-gray-600">{location.phone}</p>}
                {location.hours && <p className="mt-1 text-sm text-gray-600">{location.hours}</p>}
                {location.mapUrl && <a href={location.mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-navy underline">Map <ExternalLink size={13} /></a>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => editLocation(location)} aria-label={`Edit ${location.name}`} className="rounded border border-gray-300 p-2 text-navy"><Pencil size={16} /></button>
                <button type="button" onClick={() => deleteLocation(location.id)} aria-label={`Delete ${location.name}`} className="rounded border border-red-200 p-2 text-red-700"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
          {!locations.length && <p className="p-8 text-center text-sm text-gray-600">No locations added yet.</p>}
        </div>
      </div>
    </main>
  );
}