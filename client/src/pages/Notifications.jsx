import { useState } from "react";
import { Check, Calendar, Package, Sparkles, ShoppingCart, Archive } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function Notifications() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = getUnreadCount();

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notif.read;
    return notif.category === activeFilter;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "event":
        return <Calendar size={20} className="text-purple-600" />;
      case "product":
        return <Package size={20} className="text-blue-600" />;
      case "update":
        return <Sparkles size={20} className="text-amber-600" />;
      case "order":
      default:
        return <ShoppingCart size={20} className="text-green-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "event":
        return "bg-purple-50 border-purple-200";
      case "product":
        return "bg-blue-50 border-blue-200";
      case "update":
        return "bg-amber-50 border-amber-200";
      case "order":
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "event":
        return "Event";
      case "product":
        return "Product";
      case "update":
        return "Update";
      case "order":
      default:
        return "Order";
    }
  };

  // Count notifications by category
  const eventCount = notifications.filter(n => n.category === "event").length;
  const productCount = notifications.filter(n => n.category === "product").length;
  const updateCount = notifications.filter(n => n.category === "update" || n.category === "info").length;
  const orderCount = notifications.filter(n => n.category === "order" || !n.category).length;

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#011F5B]">Notifications</h1>
            <p className="text-gray-600 text-sm mt-1">Stay updated with events, products, and order updates</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-[#D4AF37] hover:bg-[#b8942a] text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeFilter === "all"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeFilter === "unread"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter("event")}
            className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeFilter === "event"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar size={16} />
            Events ({eventCount})
          </button>
          <button
            onClick={() => setActiveFilter("product")}
            className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeFilter === "product"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package size={16} />
            Products ({productCount})
          </button>
          <button
            onClick={() => setActiveFilter("update")}
            className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeFilter === "update"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles size={16} />
            Updates ({updateCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📬</div>
              <p className="text-gray-600 text-lg font-medium">No notifications</p>
              {activeFilter !== "all" && (
                <p className="text-gray-500 text-sm mt-1">
                  Try changing the filter to see other notifications
                </p>
              )}
              {activeFilter === "all" && (
                <p className="text-gray-500 text-sm mt-1">
                  We'll notify you about events, new products, and important updates
                </p>
              )}
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                  !notif.read
                    ? `${getCategoryColor(notif.category)} shadow-sm`
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                <div className="flex gap-4">
                  {/* Category Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getCategoryIcon(notif.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0" onClick={() => markAsRead(notif.id)}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-200 text-gray-800">
                            {getCategoryLabel(notif.category)}
                          </span>
                          {!notif.read && (
                            <span className="inline-flex w-2 h-2 rounded-full bg-blue-500" title="New"></span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-[#011F5B] mb-2">
                          {notif.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed line-clamp-3">
                          {notif.message}
                        </p>

                        <p className="text-xs text-gray-500 mt-3">
                          {new Date(notif.date).toLocaleDateString()} at{" "}
                          {new Date(notif.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-2">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition text-blue-600 hover:text-blue-700"
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Banner */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> You'll receive notifications about academy events, new products, order updates, and important announcements. Click on any notification to mark it as read.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}