import { useEffect, useState } from "react";
import { Search, Bell, ShoppingCart, Heart, Check } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useNotificationStore from "../store/notificationStore";

export default function TopBar({ collapsed }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // CART
  const { items: cartItems } = useCartStore();
  const cartCount =
    cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  // WISHLIST
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems?.length || 0;

  // NOTIFICATIONS
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  // Notification Dropdown
  const NotificationDropdown = () => (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-80 max-w-[90vw] bg-white text-black rounded-xl shadow-xl z-[9999] overflow-hidden">
      <div className="p-3 border-b flex justify-between items-center bg-gray-50">
        <span className="font-semibold text-sm">Notifications</span>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-6 text-sm text-gray-500 text-center">
            No notifications yet
          </p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                !notif.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                    notif.read ? "bg-gray-300" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{notif.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <Check size={16} className="text-blue-500 flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={`hidden md:block bg-[#011F5B] text-white px-4 py-3 transition-all duration-300 ${collapsed ? 'xl:ml-16' : 'xl:ml-64'}`}>
      <div className="container-custom flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* LEFT SIDE (now only mobile icons) */}
        <div className="flex items-center justify-between md:justify-start gap-6 w-full md:w-auto">
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = searchQuery.trim();
            navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
          }}
          className="flex w-full md:max-w-xl bg-white rounded-full overflow-hidden shadow-sm"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-5 py-2.5 text-black text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-[#D4AF37] px-6 hover:bg-[#0a2a7a] transition-colors"
          >
            <Search size={20} />
          </button>
        </form>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/wishlist" className="relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-medium px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-medium px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-medium px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && <NotificationDropdown />}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-lg">
            <FaFacebook className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
            <FaInstagram className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
            <FaWhatsapp className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
            <FaXTwitter className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
            <FaLinkedin className="hover:text-[#D4AF37] transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}