import { useState } from "react";
import { Bell, Plus, Trash2, Send } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification } = useNotificationStore();
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
  });

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-8">
          Manage Notifications
        </h1>

        <div className="space-y-8">

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

          {/* Existing Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell size={18} />
              Sent Notifications ({notifications.length})
            </h2>

            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications sent yet.</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => {
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
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}