import { useState, useEffect } from "react";
import {
  Calendar,
  Gift,
  Tag,
  Percent,
  Star,
  ExternalLink,
  PartyPopper,
  Trophy,
  Users,
  Award,
  MapPin,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EventsSection() {
  const [events, setEvents] = useState([]);

  const demoEvent = {
    id: "demo-event",
    title: "Grand Promo Launch Party",
    description:
      "Join us for an exclusive launch party featuring premium furniture showcases, live demonstrations, complimentary refreshments, and special customer appreciation gifts. Network with fellow design enthusiasts and discover the latest in luxury home decor.",
    type: "party",
    startDate: new Date().toISOString(),
    endDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    startTime: "18:00",
    endTime: "22:00",
    location: "Timmy Luxe Showroom, Lagos",
    image:
      "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
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

  const getEventIcon = (type) => {
    switch (type) {
      case "discount":
        return Percent;
      case "gift":
        return Gift;
      case "promo":
        return Tag;
      case "announcement":
        return Star;
      case "party":
        return PartyPopper;
      case "award":
        return Trophy;
      case "compensation":
        return Users;
      case "customer_year":
        return Award;
      case "promo_season":
        return Calendar;
      default:
        return Calendar;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#011F5B] to-[#0a2c7a]">
      <div className="container-custom">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Exclusive Events & Promotions
          </h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover limited-time luxury offers crafted specially for you.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.slice(0, 6).map((event) => {
            const IconComponent = getEventIcon(event.type);

            return (
              <div
                key={event.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* IMAGE */}
                {event.image && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* GOLD GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011F5B]/80 via-transparent to-transparent"></div>

                    {/* TYPE BADGE */}
                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#011F5B] text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <IconComponent size={14} />
                      {event.type.toUpperCase()}
                    </div>

                    {/* DISCOUNT BADGE */}
                    {event.discountPercentage && (
                      <div className="absolute bottom-4 right-4 bg-white text-[#011F5B] font-bold text-sm px-4 py-2 rounded-lg shadow-md">
                        {event.discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#011F5B] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                    {event.description}
                  </p>

                  {/* PROMO CODE */}
                  {event.promoCode && (
                    <div className="mb-5 bg-[#f9f7f1] border border-[#D4AF37]/30 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">
                        USE PROMO CODE
                      </p>
                      <p className="text-lg font-bold text-[#D4AF37] tracking-widest">
                        {event.promoCode}
                      </p>
                    </div>
                  )}

                  {/* DATES & TIME */}
                  <div className="space-y-2 mb-6">
                    {event.startDate && event.startTime && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                        </span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users size={14} />
                        <span>Max {event.maxAttendees} attendees</span>
                      </div>
                    )}
                  </div>

                  {/* CONTACT INFO */}
                  {event.contactInfo && (
                    <div className="mb-5 bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                      <p className="text-sm font-medium text-[#011F5B]">{event.contactInfo}</p>
                    </div>
                  )}

                  {/* CTA BUTTON */}
                  {event.targetUrl && (
                    <Link
                      to={event.targetUrl}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#011F5B] text-white py-3 rounded-xl font-medium hover:bg-[#D4AF37] hover:text-[#011F5B] transition-all duration-300"
                    >
                      Explore Offer <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {events.length > 6 && (
          <div className="text-center mt-10 text-gray-300">
            And {events.length - 6} more premium events waiting for you...
          </div>
        )}
      </div>
    </section>
  );
}