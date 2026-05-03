import { useState } from "react";
import { Bell, Check, Search, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

import useNotificationStore from "../store/notificationStore";

export default function AdminTopBar({ collapsed }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // NOTIFICATIONS
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = useNotificationStore();
  const unreadCount = getUnreadCount();

  return (
    <div className={`hidden md:block bg-[#011F5B] text-white px-3 py-2 transition-all duration-300 ${collapsed ? 'xl:ml-16' : 'xl:ml-64'}`}>
      <div className="container-custom flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        {/* TOP ROW */}
        <div className="flex items-center justify-between w-full">

          {/* Admin Title */}
          <span className="font-semibold text-sm md:text-base">
            Admin Panel
          </span>

          {/* MOBILE ICONS */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Notification */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="hover:text-[#D4AF37]"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-w-[90vw] bg-white text-black rounded-xl shadow-xl z-[999]">
                  <div className="p-3 border-b flex justify-between items-center">
                    <span className="font-semibold text-sm">
                      Admin Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600"
                      >
                        Mark all
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500 text-center">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3 border-b text-sm cursor-pointer ${
                            !notif.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex gap-2">
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                notif.read ? "bg-gray-300" : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{notif.title}</p>
                              <p className="text-gray-500 text-xs">
                                {notif.message}
                              </p>
                            </div>
                            {!notif.read && (
                              <Check size={14} className="text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <Link to="/admin/settings" className="hover:text-[#D4AF37]">
              <Settings size={18} />
            </Link>

            {/* Profile */}
            <Link to="/admin/profile" className="hover:text-[#D4AF37]">
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full md:max-w-xl bg-white rounded-full overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search admin panel..."
            className="flex-1 px-4 py-2 text-black text-sm outline-none"
          />
          <button className="bg-[#D4AF37] px-4 text-white">
            <Search size={18} />
          </button>
        </form>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-4">

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="hover:text-[#D4AF37]"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white text-black rounded-xl shadow-xl z-[999]">
                <div className="p-4 border-b flex justify-between">
                  <span className="font-semibold">
                    Admin Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600"
                    >
                      Mark all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 border-b cursor-pointer ${
                          !notif.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-2 h-2 mt-2 rounded-full ${
                              notif.read ? "bg-gray-300" : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notif.message}
                            </p>
                          </div>
                          {!notif.read && (
                            <Check size={14} className="text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link to="/admin/settings" className="hover:text-[#D4AF37]">
            <Settings size={18} />
          </Link>

          {/* Profile */}
          <Link to="/admin/profile" className="hover:text-[#D4AF37]">
            <User size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}