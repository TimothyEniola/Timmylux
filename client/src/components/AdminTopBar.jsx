import { useEffect, useState } from "react";
import { Bell, Check, Search, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useNotificationStore from "../store/notificationStore";

export default function AdminTopBar() {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // NOTIFICATIONS
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  return (
    <div className="bg-[#011F5B] text-white px-4 py-3">
      <div className="container-custom flex flex-col md:flex-row items-center gap-3 md:gap-4">

        {/* LEFT SECTION */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Admin Panel</span>
          </div>

          {/* Mobile Bell */}
          <div className="relative md:hidden">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="relative hover:text-[#D4AF37] transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute -right-32 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Admin Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                          !notif.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.read ? "bg-gray-300" : "bg-blue-500"
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {notif.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notif.date).toLocaleString()}
                            </p>
                          </div>
                          {!notif.read && (
                            <Check size={14} className="text-blue-500 mt-1" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full md:flex-1 flex justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Admin search functionality can be added later
            }}
            className="flex items-center w-full max-w-xl bg-white rounded-full overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search admin panel..."
              className="w-full px-4 py-2 text-black outline-none text-sm md:text-base"
            />
            <button
              type="submit"
              className="bg-[#D4AF37] px-4 py-2 text-white hover:opacity-90"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center justify-center md:justify-end gap-3 sm:gap-4">

          {/* Action Icons Row */}
          <div className="flex items-center justify-center gap-4 order-2 sm:order-1">
            {/* Desktop Bell / Notifications */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative hover:text-[#D4AF37] transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Admin Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                            !notif.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notif.read ? "bg-gray-300" : "bg-blue-500"
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {notif.title}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notif.date).toLocaleString()}
                              </p>
                            </div>
                            {!notif.read && (
                              <Check size={14} className="text-blue-500 mt-1" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Settings */}
            <Link
              to="/admin/settings"
              className="hover:text-[#D4AF37] transition-colors"
            >
              <Settings size={18} />
            </Link>

            {/* Admin Profile */}
            <Link
              to="/admin/profile"
              className="hover:text-[#D4AF37] transition-colors"
            >
              <User size={18} />
            </Link>
          </div>

          {/* Mobile Bell */}
          <div className="relative md:hidden order-1 sm:order-2">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="relative hover:text-[#D4AF37] transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute -right-32 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Admin Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                          !notif.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.read ? "bg-gray-300" : "bg-blue-500"
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {notif.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notif.date).toLocaleString()}
                            </p>
                          </div>
                          {!notif.read && (
                            <Check size={14} className="text-blue-500 mt-1" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}