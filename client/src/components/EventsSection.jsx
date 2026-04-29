import { useState, useEffect } from "react";
import {
  Calendar,
  Gift,
  Tag,
  Percent,
  Star,
  PartyPopper,
  Trophy,
  Users,
  Award,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const demoEvent = {
    id: "demo-event",
    title: "Grand Promo Launch Party",
    description:
      "Join us for an exclusive launch party featuring premium furniture showcases, live demonstrations, complimentary refreshments, and special customer appreciation gifts.",
    type: "party",
    startDate: new Date().toISOString(),
    startTime: "18:00",
    location: "Timmy Luxe Showroom, Lagos",
    image:
      "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
    discountPercentage: 15,
    promoCode: "TUXSAVE15",
    targetUrl: "/products",
    maxAttendees: 200,
    contactInfo: "events@timmyluxe.com | +234 123 456 7890",
  };

  useEffect(() => {
    const savedEvents = localStorage.getItem("adminEvents");
    if (savedEvents) {
      const allEvents = JSON.parse(savedEvents);
      setEvents(allEvents.filter((event) => event.isActive));
    }
  }, []);

  const displayEvents = events.length > 0 ? events : [demoEvent];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getEventIcon = (type) => {
    const map = {
      discount: Percent,
      gift: Gift,
      promo: Tag,
      announcement: Star,
      party: PartyPopper,
      award: Trophy,
      compensation: Users,
      customer_year: Award,
      promo_season: Calendar,
    };
    return map[type] || Calendar;
  };

  return (
    <section className="relative bg-[#060C1A] py-24 px-6 overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] top-[-100px] right-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-900/40 blur-[120px] bottom-[-100px] left-[-100px]" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 uppercase tracking-widest text-xs mb-4">
              <Sparkles size={14} /> Curated for You
            </div>

            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Exclusive <span className="text-yellow-500 italic">Events</span>
              <br /> & Promotions
            </h2>

            <p className="text-white/50 mt-4 max-w-md text-sm">
              Limited-time luxury offers and immersive experiences crafted for
              the discerning.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full text-sm">
            <Calendar size={14} />
            {displayEvents.length} Active Event
            {displayEvents.length > 1 && "s"}
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((event) => {
            const Icon = getEventIcon(event.type);

            return (
              <div
                key={event.id}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060C1A] to-transparent" />

                  {/* type */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 text-xs bg-black/60 backdrop-blur px-3 py-1 rounded-full text-yellow-500 border border-yellow-500/30">
                    <Icon size={12} />
                    {event.type.toUpperCase()}
                  </div>

                  {/* discount */}
                  {event.discountPercentage && (
                    <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">
                      {event.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {/* BODY */}
                <div className="p-6">
                  <h3 className="text-xl font-serif mb-2 group-hover:text-yellow-500 transition">
                    {event.title}
                  </h3>

                  <p className="text-white/50 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* PROMO */}
                  {event.promoCode && (
                    <div className="flex justify-between items-center border border-dashed border-yellow-500/40 bg-yellow-500/5 px-4 py-3 rounded-lg mb-4">
                      <div>
                        <p className="text-[10px] uppercase text-white/40">
                          Promo Code
                        </p>
                        <p className="text-yellow-500 font-bold tracking-widest">
                          {event.promoCode}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(event.promoCode)}
                        className="text-xs border border-yellow-500/40 px-3 py-1 rounded hover:bg-yellow-500/20"
                      >
                        {copiedCode === event.promoCode ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}

                  {/* META */}
                  <div className="text-sm text-white/50 space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(event.startDate).toLocaleDateString()} ·{" "}
                      {event.startTime}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {event.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      {event.maxAttendees} seats
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="text-xs text-white/40 bg-white/5 p-3 rounded mb-4">
                    <strong className="block text-[10px] uppercase">
                      Contact
                    </strong>
                    {event.contactInfo}
                  </div>

                  {/* CTA */}
                  <Link
                    to={event.targetUrl}
                    className="flex items-center justify-between border border-yellow-500/30 text-yellow-500 px-4 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition"
                  >
                    <span>Explore Offer</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>     
            );
          })}
        </div>
      </div>
    </section> 
  );
}