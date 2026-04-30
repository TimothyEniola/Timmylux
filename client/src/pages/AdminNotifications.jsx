import { useState } from "react";
import { Bell, Plus, Trash2, Send, ShoppingCart, AlertCircle, Share2 } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification, markAsRead, getUnreadCount } = useNotificationStore();
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [activeTab, setActiveTab] = useState("received");

  const unreadCount = getUnreadCount();

  // Filter notifications by type
  const sentNotifications = notifications.filter(notif => !notif.type || notif.type !== "order");
  const receivedNotifications = notifications.filter(notif => notif.type === "order");

  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      alert("Please fill in both title and message");
      return;
    }
    addNotification(newNotification);
    setNewNotification({ title: "", message: "", type: "info" });
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
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "received"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Received ({receivedNotifications.length})
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "sent"
                ? "border-[#011F5B] text-[#011F5B]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sent ({sentNotifications.length})
          </button>
        </div>

        <div className="space-y-8">

          {/* Received Notifications Tab */}
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

          {/* Sent Notifications Tab */}
          {activeTab === "sent" && (
            <>
              {/* Add New Notification */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus size={18} />
                  Send New Notification
                </h2>

                <form onSubmit={handleAddNotification} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Notification Title"
                    value={newNotification.title}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, title: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg"
                    required
                  />

                  <textarea
                    placeholder="Notification Message"
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, message: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg h-24 resize-none"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Type
                    </label>
                    <select
                      value={newNotification.type}
                      onChange={(e) =>
                        setNewNotification({ ...newNotification, type: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Send size={16} />
                    Send Notification
                  </button>
                </form>
              </div>

              {/* Existing Sent Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bell size={18} />
                  Sent Notifications ({sentNotifications.length})
                </h2>

                {sentNotifications.length === 0 ? (
                  <p className="text-gray-500">No notifications sent yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sentNotifications.map((notif) => {
                      const labelStyles = {
                        info: "bg-blue-100 text-blue-700",
                        success: "bg-emerald-100 text-emerald-700",
                        warning: "bg-amber-100 text-amber-700",
                      };

                      return (
                        <div key={notif.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${labelStyles[notif.type || "info"]}`}>
                                  {notif.type?.toUpperCase() || "INFO"}
                                </span>
                              </div>
                              <h3 className="font-semibold">{notif.title}</h3>
                              <p className="text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                Sent: {new Date(notif.date).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className="flex flex-wrap gap-1">
                                <button
                                  onClick={() => shareNotification(notif)}
                                  className="p-2 bg-[#011F5B] text-white rounded-lg hover:bg-[#003366] transition-colors"
                                  title="Share Notification"
                                >
                                  <Share2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}