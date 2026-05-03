import { useState } from "react";
import { Check } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function Notifications() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#011F5B]">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-[#D4AF37] hover:bg-[#b8942a] text-white px-4 py-2 rounded-lg transition"
            >
              Mark All Read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                  !notif.read ? "border-blue-200 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-3 h-3 mt-2 rounded-full flex-shrink-0 ${
                      notif.read ? "bg-gray-300" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#011F5B] mb-2">
                      {notif.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {notif.message}
                    </p>
                    {!notif.read && (
                      <div className="mt-3 flex items-center gap-2 text-blue-600">
                        <Check size={16} />
                        <span className="text-sm">Click to mark as read</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}