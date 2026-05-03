import { useState } from "react";
import { Bell, Plus, Trash2, Send, ShoppingCart, AlertCircle, Share2, Calendar, Package, Sparkles } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification, markAsRead, getUnreadCount } = useNotificationStore();
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    category: "update",
  });
  const [activeTab, setActiveTab] = useState("received");

  const unreadCount = getUnreadCount();

  // Filter notifications by category
  const receivedNotifications = notifications.filter(notif => notif.category === "order" || !notif.category);
  const eventNotifications = notifications.filter(notif => notif.category === "event");
  const productNotifications = notifications.filter(notif => notif.category === "product");
  const updateNotifications = notifications.filter(notif => notif.category === "update" || notif.category === "info");
  const sentNotifications = notifications.filter(notif => notif.isSent);

  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      alert("Please fill in both title and message");
      return;
    }
    addNotification({
      ...newNotification,
      isSent: true,
    });
    setNewNotification({ title: "", message: "", type: "info", category: "update" });
    alert("Notification sent to all users!");
  };

  // SHARE FUNCTIONS
  const formatNotificationDetails = (notif) => {
    return `Admin Notification\nTitle: ${notif.title}\nMessage: ${notif.message}\nType: ${notif.type?.toUpperCase() || 'INFO'}\nDate: ${new Date(notif.date).toLocaleString()}`;
  };

  const shareNotification = async (notif) => {
    const message = formatNotificationDetails(notif);
    const shareData = {
      title: `Notification: ${notif.title}`,
      text: message,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(message);
        alert("Notification details copied to clipboard! Paste them into any app.");
      }
    } catch (error) {
      console.log("Share failed:", error);
      await navigator.clipboard.writeText(message);
      alert("Unable to open share sheet. Notification copied to clipboard.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-8">
          Notifications
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "received"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Orders ({receivedNotifications.length})
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "events"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Events ({eventNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Products ({productNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab("updates")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "updates"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Updates ({updateNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "sent"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Send New
          </button>
        </div>

        <div className="space-y-8">

          {/* Received/Orders Tab */}
          {activeTab === "received" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={18} />
                Order Notifications
              </h2>

              {receivedNotifications.length === 0 ? (
                <p className="text-gray-500">No order notifications yet.</p>
              ) : (
                <div className="space-y-4">
                  {receivedNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        !notif.read ? "bg-blue-50 border-blue-200" : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notif.id)}>
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingCart size={16} className="text-[#D4AF37]" />
                            <span className="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold bg-green-100 text-green-700">
                              ORDER
                            </span>
                            {!notif.read && (
                              <span className="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold bg-blue-100 text-blue-700">
                                NEW
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold">{notif.title}</h3>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Received: {new Date(notif.date).toLocaleString()}
                          </p>
                        </div>

                        {/* Share Buttons */}
                        <div className="flex flex-wrap gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              shareNotification(notif);
                            }}
                            className="p-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#003366] transition-colors"
                            title="Share Notification"
                          >
                            <Share2 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete Notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-purple-600" />
                Events & Announcements
              </h2>

              {eventNotifications.length === 0 ? (
                <p className="text-gray-500">No event notifications yet. Create one from the "Send New" tab to notify customers about upcoming events.</p>
              ) : (
                <div className="space-y-4">
                  {eventNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border-l-4 border-purple-600 rounded-lg p-4 bg-purple-50`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-purple-600" />
                            <span className="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold bg-purple-100 text-purple-700">
                              EVENT
                            </span>
                          </div>
                          <h3 className="font-semibold">{notif.title}</h3>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Sent: {new Date(notif.date).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete Notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package size={18} className="text-blue-600" />
                Product Updates
              </h2>

              {productNotifications.length === 0 ? (
                <p className="text-gray-500">No product notifications yet. Create one from the "Send New" tab to announce new products or updates.</p>
              ) : (
                <div className="space-y-4">
                  {productNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border-l-4 border-blue-600 rounded-lg p-4 bg-blue-50`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Package size={16} className="text-blue-600" />
                            <span className="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold bg-blue-100 text-blue-700">
                              PRODUCT
                            </span>
                          </div>
                          <h3 className="font-semibold">{notif.title}</h3>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Sent: {new Date(notif.date).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete Notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === "updates" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-600" />
                General Updates
              </h2>

              {updateNotifications.length === 0 ? (
                <p className="text-gray-500">No general updates yet. Create one from the "Send New" tab to share news and updates with customers.</p>
              ) : (
                <div className="space-y-4">
                  {updateNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border-l-4 border-amber-600 rounded-lg p-4 bg-amber-50`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-amber-600" />
                            <span className="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold bg-amber-100 text-amber-700">
                              UPDATE
                            </span>
                          </div>
                          <h3 className="font-semibold">{notif.title}</h3>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Sent: {new Date(notif.date).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete Notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Send New Notification Tab */}
          {activeTab === "sent" && (
            <>
              {/* Add New Notification */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus size={18} />
                  Send New Notification to Customers
                </h2>

                <form onSubmit={handleAddNotification} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Notification Title"
                    value={newNotification.title}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, title: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    required
                  />

                  <textarea
                    placeholder="Notification Message - Tell customers what's new or important"
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, message: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newNotification.category}
                        onChange={(e) =>
                          setNewNotification({ ...newNotification, category: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                      >
                        <option value="update">General Update</option>
                        <option value="event">Event</option>
                        <option value="product">Product Update</option>
                        <option value="info">Information</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Type
                      </label>
                      <select
                        value={newNotification.type}
                        onChange={(e) =>
                          setNewNotification({ ...newNotification, type: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                      >
                        <option value="info">Information</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#011F5B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0e2c5b] transition flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Send Notification to All Users
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}