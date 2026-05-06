import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useNotificationStore from "../store/notificationStore";
import {
  Plus,
  Edit3,
  Trash2,
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
  Share2,
  Copy,
  Check as CheckIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function AdminEvents() {
  const { addNotification } = useNotificationStore();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [copiedEventId, setCopiedEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "promo",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    image: "",
    isActive: true,
    discountPercentage: "",
    promoCode: "",
    targetUrl: "",
    maxAttendees: "",
    contactInfo: "",
    // Worker fields
    position: "",
    requirements: "",
    salary: "",
    jobType: "full-time",
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem("adminEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem("adminEvents", JSON.stringify(newEvents));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "promo",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      location: "",
      image: "",
      isActive: true,
      discountPercentage: "",
      promoCode: "",
      targetUrl: "",
      maxAttendees: "",
      contactInfo: "",
      position: "",
      requirements: "",
      salary: "",
      jobType: "full-time",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingEvent) {
      const updatedEvents = events.map((event) =>
        event.id === editingEvent.id
          ? { ...formData, id: editingEvent.id }
          : event
      );
      saveEvents(updatedEvents);
    } else {
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      saveEvents([...events, newEvent]);
    }

    // Notify users about new event
    if (!editingEvent) {
      addNotification({
        title: `🎉 New Event: ${formData.title}`,
        message: `A new ${formData.type.replace("_", " ")} event has been posted: ${formData.description.slice(0, 120)}${formData.description.length > 120 ? "…" : ""}`,
        category: "event",
      });
    }
    resetForm();
    toast.success(editingEvent ? "Event updated!" : "New event created!");
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((event) => event.id !== eventId);
      saveEvents(updatedEvents);
      toast.success("Event deleted.");
    }
  };

  const toggleActive = (eventId) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId
        ? { ...event, isActive: !event.isActive }
        : event
    );
    saveEvents(updatedEvents);
  };

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

  const getEventTypeColor = (type) => {
    switch (type) {
      case "discount":
        return "bg-green-100 text-green-800";
      case "gift":
        return "bg-purple-100 text-purple-800";
      case "promo":
        return "bg-blue-100 text-blue-800";
      case "announcement":
        return "bg-yellow-100 text-yellow-800";
      case "party":
        return "bg-pink-100 text-pink-800";
      case "award":
        return "bg-indigo-100 text-indigo-800";
      case "compensation":
        return "bg-orange-100 text-orange-800";
      case "customer_year":
        return "bg-teal-100 text-teal-800";
      case "worker":
        return "bg-red-100 text-red-800";
      case "promo_season":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatEventDetails = (event) => {
    const details = `
Event Details:
🎉 ${event.title}
📝 ${event.description}

Type: ${event.type.replace("_", " ")}
${event.startDate && event.startTime ? `📅 Date: ${new Date(event.startDate).toLocaleDateString()} at ${event.startTime}` : ''}
${event.endDate && event.endTime ? `📅 Ends: ${new Date(event.endDate).toLocaleDateString()} at ${event.endTime}` : ''}
${event.location ? `📍 Location: ${event.location}` : ''}
${event.maxAttendees ? `👥 Max Attendees: ${event.maxAttendees}` : ''}
${event.contactInfo ? `📞 Contact: ${event.contactInfo}` : ''}
${event.discountPercentage ? `💰 Discount: ${event.discountPercentage}%` : ''}
${event.promoCode ? `🎫 Promo Code: ${event.promoCode}` : ''}
${event.targetUrl ? `🔗 Link: ${event.targetUrl}` : ''}

Status: ${event.isActive ? 'Active' : 'Inactive'}
    `.trim();
    return details;
  };

  const shareViaWhatsApp = (event) => {
    const details = formatEventDetails(event);
    const message = encodeURIComponent(`Check out this event:\n${details}`);
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = (event) => {
    const details = formatEventDetails(event);
    const subject = encodeURIComponent(`Event: ${event.title}`);
    const body = encodeURIComponent(`Hi,\n\nI wanted to share this event with you:\n\n${details}\n\nBest regards`);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async (event) => {
    const details = formatEventDetails(event);
    try {
      await navigator.clipboard.writeText(details);
      setCopiedEventId(event.id);
      setTimeout(() => setCopiedEventId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#011F5B]">
              Events & Promotions
            </h1>
            <p className="text-gray-600">
              Manage your promotional events and announcements
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#011F5B] text-white px-4 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-[#011F5B] transition"
          >
            <Plus size={18} />
            Add New Event
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => {
            const IconComponent = getEventIcon(event.type);

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        size={20}
                        className="text-[#D4AF37]"
                      />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(event.id)}
                        className={`w-3 h-3 rounded-full ${
                          event.isActive
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <button
                        onClick={() => shareViaWhatsApp(event)}
                        className="text-gray-400 hover:text-green-500"
                        title="Share via WhatsApp"
                      >
                        <FaWhatsapp size={16} />
                      </button>
                      <button
                        onClick={() => shareViaEmail(event)}
                        className="text-gray-400 hover:text-blue-500"
                        title="Share via Email"
                      >
                        <span className="text-sm font-bold">✉</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(event)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy to Clipboard"
                      >
                        {copiedEventId === event.id ? (
                          <CheckIcon size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-gray-400 hover:text-[#D4AF37]"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1">
                    {event.startDate && event.startTime && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        Max {event.maxAttendees} attendees
                      </div>
                    )}
                    {event.contactInfo && (
                      <div className="flex items-center gap-1">
                        <span>Contact: {event.contactInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar
              size={48}
              className="mx-auto text-gray-300 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600">
              Create your first promotional event to get started.
            </p>
          </div>
        )}

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#011F5B]">
                    {editingEvent ? "Edit Event" : "Add New Event"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        required
                      >
                        <option value="promo">Promotion</option>
                        <option value="discount">Discount</option>
                        <option value="gift">Gift</option>
                        <option value="announcement">Announcement</option>
                        <option value="party">Party</option>
                        <option value="award">Award Ceremony</option>
                        <option value="compensation">Compensation</option>
                        <option value="customer_year">Customer of the Year</option>
                        <option value="promo_season">Promo Season</option>
                        <option value="worker">Worker Broadcasting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Location and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="Venue or online link"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Info
                      </label>
                      <input
                        type="text"
                        value={formData.contactInfo}
                        onChange={(e) =>
                          setFormData({ ...formData, contactInfo: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="Phone or email"
                      />
                    </div>
                  </div>

                  {/* Image and Additional Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Conditional Fields based on Event Type */}
                  {(formData.type === "discount" || formData.type === "promo") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Percentage
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={(e) =>
                            setFormData({ ...formData, discountPercentage: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Promo Code
                        </label>
                        <input
                          type="text"
                          value={formData.promoCode}
                          onChange={(e) =>
                            setFormData({ ...formData, promoCode: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="SAVE20"
                        />
                      </div>
                    </div>
                  )}

                  {(formData.type === "party" || formData.type === "award" || formData.type === "customer_year") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxAttendees}
                        onChange={(e) =>
                          setFormData({ ...formData, maxAttendees: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="100"
                      />
                    </div>
                  )}

                  {formData.type === "worker" && (
                    <div className="border-t pt-6 mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-[#011F5B] mb-4">Worker Broadcast Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Position *
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) =>
                            setFormData({ ...formData, position: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="e.g., Receptionist, Secretary, Manager, etc."
                          required={formData.type === "worker"}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Requirements *
                        </label>
                        <textarea
                          value={formData.requirements}
                          onChange={(e) =>
                            setFormData({ ...formData, requirements: e.target.value })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          placeholder="List job requirements, qualifications, experience needed..."
                          required={formData.type === "worker"}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary Range
                          </label>
                          <input
                            type="text"
                            value={formData.salary}
                            onChange={(e) =>
                              setFormData({ ...formData, salary: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                            placeholder="e.g., ₦50,000 - ₦80,000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Type
                          </label>
                          <select
                            value={formData.jobType}
                            onChange={(e) =>
                              setFormData({ ...formData, jobType: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                          >
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="freelance">Freelance</option>
                            <option value="seasonal">Seasonal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.targetUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, targetUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      placeholder="https://example.com/event-details"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Event is active and visible to customers
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#D4AF37] hover:text-[#011F5B] transition"
                    >
                      {editingEvent ? "Update Event" : "Create Event"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}