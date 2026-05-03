import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  Home,
  Info,
  ClipboardList,
  Package,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Store,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { useState, useEffect } from "react";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useNotificationStore from "../store/notificationStore";
import logo from "../assets/reallogo.png";
import ProfileDropdown from "./ProfileDropdown";

export default function UserSidebar({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState(false);
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { getUnreadCount } = useNotificationStore();

  const cartCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;
  const unreadCount = getUnreadCount();

  const location = useLocation();

  useEffect(() => {
    setOpen(false); // close sidebar on route change (mobile)
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Shop", icon: Store },
    { path: "/academy", label: "Academy", icon: GraduationCap },
    { path: "/about", label: "About", icon: Info },
    { path: "/custom-request", label: "Custom Request", icon: ClipboardList },
    { path: "/wishlist", label: "Wishlist", icon: Heart },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    { path: "/track-order", label: "Track Order", icon: Package },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="xl:hidden flex items-center justify-between bg-[#011F5B] text-white px-4 h-16">
        <img src={logo} alt="Logo" className="h-9" />
        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#011F5B] text-white z-50 transform transition-all duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0
        ${collapsed ? "xl:w-16" : "xl:w-64"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-[#D4AF37]/30">
            {!collapsed && <img src={logo} alt="Logo" className="h-9" />}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden xl:inline-flex p-2 hover:bg-[#D4AF37]/20 rounded transition"
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button className="xl:hidden" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
          </div>

          {/* MOBILE TOPBAR ACTIONS */}
          <div className="xl:hidden px-4 py-4 border-b border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="relative">
                <Link to="/notifications" className="text-white hover:text-[#D4AF37]">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-medium px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37]">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37]">
                <FaInstagram size={20} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37]">
                <FaWhatsapp size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37]">
                <FaXTwitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37]">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 pb-28">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-[#D4AF37] text-black"
                      : "hover:bg-[#D4AF37]/20"
                  }`}
                >
                  <Icon size={18} />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#D4AF37]/30 p-4 flex-shrink-0">
            {!collapsed ? (
              <ProfileDropdown />
            ) : (
              <Link to="/profile" className="flex items-center justify-center h-12 text-white hover:bg-[#D4AF37]/20 rounded-lg transition">
                <User size={18} />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* Reusable dropdown link */
const DropdownLink = ({ to, label, icon: Icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
  >
    <Icon size={16} />
    {label}
  </Link>
);