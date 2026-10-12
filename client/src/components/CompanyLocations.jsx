import { useState } from "react";
import { Clock3, MapPin, Phone } from "lucide-react";
import { readStoredArray } from "../utils/storage";

export default function CompanyLocations() {
  const [locations] = useState(() => readStoredArray("companyLocations"));

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <MapPin className="text-primary" size={22} />
          <h2 className="text-2xl font-bold text-navy">Visit Our Locations</h2>
        </div>
        {locations.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <article key={location.id} className="overflow-hidden border border-gray-200 bg-white">
              {location.image && <img src={location.image} alt={`${location.name} office`} className="aspect-[16/10] w-full object-cover" loading="lazy" />}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-navy">{location.name}</h3>
                <p className={`mt-1 inline-flex items-center gap-2 text-sm font-semibold ${location.isOpen ? "text-emerald-700" : "text-red-700"}`}>
                  <span className={`h-2 w-2 rounded-full ${location.isOpen ? "bg-emerald-600" : "bg-red-600"}`} />
                  {location.isOpen ? "Open now" : "Currently closed"}
                </p>
                <p className="mt-2 flex gap-2 text-sm text-gray-600"><MapPin size={16} className="mt-0.5 shrink-0" />{location.address}</p>
                {location.phone && <a href={`tel:${location.phone.replace(/[^\d+]/g, "")}`} className="mt-2 flex gap-2 text-sm text-gray-600"><Phone size={16} className="shrink-0" />{location.phone}</a>}
                {location.hours && <p className="mt-2 flex gap-2 text-sm text-gray-600"><Clock3 size={16} className="shrink-0" />{location.hours}</p>}
                {location.mapUrl && <a href={location.mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex font-medium text-navy underline">Get directions</a>}
              </div>
            </article>
          ))}
        </div> : (
          <p className="border-y border-gray-200 py-8 text-sm text-gray-600">
            We do not have any locations open for now. Branch details will appear here when a location is added.
          </p>
        )}
      </div>
    </section>
  );
}