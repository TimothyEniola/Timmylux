import { Clock3, ExternalLink, MapPin, Phone } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { readStoredArray } from "../utils/storage";

export default function Locations() {
  const [searchParams] = useSearchParams();
  const gameTitle = searchParams.get("title");
  const [locations] = useState(() => readStoredArray("companyLocations"));
  const hasOpenLocation = locations.some((location) => location.isOpen === true);

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-primary"><MapPin size={16} /> Find us in person</div>
          <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">Our Locations</h1>
          <p className="mt-3 text-gray-600">
            {hasOpenLocation
              ? "Visit an open TimmyLux branch for furniture enquiries, custom requests, and in-person ticket purchases."
              : "We do not have any locations open for now. Branch details will appear here when a location is added."}
          </p>
        </div>

        {gameTitle && (
          <div className="mb-8 border-l-4 border-primary bg-primary/10 p-5">
            <h2 className="font-semibold text-navy">Play {gameTitle} at a branch</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Visit an open location, pay the ticket price only, then choose and open an available numbered paper. The assigned prize is revealed to you and belongs to you at no additional prize charge. Collect it at the branch or contact the team to arrange delivery.
            </p>
          </div>
        )}

        {locations.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <article key={location.id} className="overflow-hidden border border-gray-200 bg-white">
                {location.image ? (
                  <img src={location.image} alt={`${location.name} office`} className="aspect-[16/10] w-full bg-gray-100 object-cover" />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 text-gray-400"><MapPin size={30} /></div>
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-navy">{location.name}</h2>
                  <p className={`mt-2 inline-flex items-center gap-2 text-sm font-semibold ${location.isOpen ? "text-emerald-700" : "text-red-700"}`}>
                    <span className={`h-2 w-2 rounded-full ${location.isOpen ? "bg-emerald-600" : "bg-red-600"}`} />
                    {location.isOpen ? "Open now" : "Currently closed"}
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-gray-700"><MapPin size={16} className="mt-0.5 shrink-0 text-primary" />{location.address}</p>
                  {location.phone && <a href={`tel:${location.phone.replace(/[^\d+]/g, "")}`} className="mt-3 flex items-center gap-2 text-sm text-gray-700 hover:text-navy"><Phone size={16} className="text-primary" />{location.phone}</a>}
                  {location.hours && <p className="mt-3 flex items-start gap-2 text-sm text-gray-700"><Clock3 size={16} className="mt-0.5 shrink-0 text-primary" />{location.hours}</p>}
                  {location.mapUrl && <a href={location.mapUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-navy underline">Get directions <ExternalLink size={15} /></a>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-gray-200 py-12 text-center">
            <MapPin className="mx-auto text-primary" size={30} />
            <h2 className="mt-3 text-lg font-semibold text-navy">No locations are open for now</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">We do not have any open branches at the moment. Branch details and directions will appear here once a location is added and marked open.</p>
            <Link to="/help#contact" className="mt-4 inline-flex font-semibold text-navy underline">Contact support</Link>
          </div>
        )}
      </div>
    </main>
  );
}
