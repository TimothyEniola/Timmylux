import { useEffect, useState } from "react";
import { Phone, Search, Bell, ShoppingCart, Heart, Check } from "lucide-react";
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
import { getCurrentUser, clearCurrentUser } from "../utils/userHelpers";

export default function TopBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const syncUser = () => setCurrentUser(getCurrentUser());
    window.addEventListener("userDataChanged", syncUser);
    return () => window.removeEventListener("userDataChanged", syncUser);
  }, []);

  // CART
  const { items: cartItems } = useCartStore();
  const cartCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  // WISHLIST
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems?.length || 0;

  // NOTIFICATIONS
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  return (
    <div className="bg-[#D4AF37] text-white px-4 py-3">
      <div className="container-custom flex flex-col md:flex-row items-center gap-3 md:gap-4">

        {/* LEFT SECTION */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} />
            <a
              href="tel:+2348140838535"
              className="hover:text-[#011F5B] transition-colors"
            >
              +234 8140838535
            </a>
          </div>

          {/* Mobile Bell */}
          <div className="relative md:hidden">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="relative hover:text-[#011F5B] transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute left-0 top-full mt-2 w-screen max-w-xs bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
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
              const query = searchQuery.trim();
              if (query) {
                navigate(`/products?q=${encodeURIComponent(query)}`);
              } else {
                navigate("/products");
              }
            }}
            className="flex items-center w-full max-w-xl bg-white rounded-full overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, services..."
              className="w-full px-4 py-2 text-black outline-none text-sm md:text-base"
            />
            <button
              type="submit"
              className="bg-[#011F5B] px-4 py-2 text-white hover:opacity-90"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">

          {/* Desktop Bell / Notifications */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative hover:text-[#011F5B] transition-colors"
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
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
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

          {/* ❤️ Wishlist */}
          <Link
            to="/wishlist"
            className="relative hover:text-[#011F5B] transition-colors"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🛒 Cart */}
          <Link
            to="/cart"
            className="relative hover:text-[#011F5B] transition-colors"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* SIGN IN / SIGN OUT */}
          {currentUser ? (
            <button
              onClick={() => {
                clearCurrentUser();
                navigate("/signin");
              }}
              className="text-sm hover:text-[#011F5B] transition-colors whitespace-nowrap"
            >
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/signin"
                className="text-sm hover:text-[#011F5B] transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm hover:text-[#011F5B] transition-colors whitespace-nowrap"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
            <a href="https://www.fb.com/l/6lp1kJRRR" aria-label="Facebook">
              <FaFacebook size={16} />
            </a>

            <a
              href="https://www.instagram.com/timmy_lux?igsh=MXRuNThldzZkMDJ3NA=="
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://wa.me/2348140838535"
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp size={16} />
            </a>

            <a href="https://x.com/YemitanT26859" aria-label="Twitter">
              <FaXTwitter size={16} />
            </a>

            <a
              href="https://www.linkedin.com/in/yemitan-timothy-6235b73ab"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={16} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}