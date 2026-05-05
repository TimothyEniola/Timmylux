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
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useNotificationStore from "../store/notificationStore";
import logo from "../assets/reallogo.png";
import ProfileDropdown from "./ProfileDropdown";

export default function UserSidebar({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { getUnreadCount } = useNotificationStore();

  const cartCount =
    cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const wishlistCount = wishlistItems?.length || 0;
  const unreadCount = getUnreadCount();

  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Shop", icon: Store },
    { path: "/academy", label: "Academy", icon: GraduationCap },
    { path: "/about", label: "About", icon: Info },
    { path: "/custom-request", label: "Custom Request", icon: ClipboardList },
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
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-[#D4AF37]/30">
            {!collapsed && <img src={logo} alt="Logo" className="h-9" />}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden xl:inline-flex p-2 hover:bg-[#D4AF37]/20 rounded transition"
              >
                {collapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
              <button className="xl:hidden" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="xl:hidden px-4 py-3 border-b border-white/10">
            <div className="flex items-center bg-white rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-2 w-full outline-none text-sm text-black"
              />
            </div>
          </div>

          {/* MOBILE QUICK ACTIONS */}
          <div className="xl:hidden px-4 py-4 border-b border-white/10 flex justify-between">
            {/* Notifications */}
            <Link to="/notifications" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] px-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
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

          {/* PROFILE */}
          <div className="border-t border-[#D4AF37]/30 p-4 flex-shrink-0">
            {!collapsed ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/profile"
                className="flex items-center justify-center h-12 text-white hover:bg-[#D4AF37]/20 rounded-lg transition"
              >
                <User size={18} />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}