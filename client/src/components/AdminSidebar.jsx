import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Package,
  Plus,
  ShoppingCart,
  Layers,
  Star,
  Edit3,
  Calendar,
  Tag,
  Bell,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import useNotificationStore from "../store/notificationStore";
import logo from "../assets/reallogo.png";
import AdminDropdown from "./AdminDropdown";

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState(false);
  const { getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dashboardItem = { path: "/admin", label: "Dashboard", icon: LayoutDashboard };

  const navItems = [
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/notifications", label: "Notifications", icon: Bell },
    { path: "/admin/coupons", label: "Coupons", icon: Tag },
    { path: "/admin/content", label: "Content Editor", icon: Edit3 },
    { path: "/admin/events", label: "Events", icon: Calendar },
    { path: "/admin/academy", label: "Academy", icon: GraduationCap },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/collections", label: "Collections", icon: Layers },
    { path: "/admin/featured", label: "Featured", icon: Star },
    { path: "/admin/add-product", label: "Add Product", icon: Plus },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="xl:hidden flex items-center justify-between bg-[#011F5B] text-white px-4 h-16">
        <img src={logo} alt="Logo" className="h-9" />
        <button onClick={() => setOpen(true)} className="p-1">
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
          w-72
          ${open ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0
          ${collapsed ? "xl:w-16" : "xl:w-64"}`}
      >
        <div className="flex h-full flex-col min-h-0">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-[#D4AF37]/30 flex-shrink-0">
            {!collapsed && <img src={logo} alt="Logo" className="h-9" />}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden xl:inline-flex p-1.5 hover:bg-[#D4AF37]/20 rounded transition"
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button className="xl:hidden p-1" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
          </div>

          {/* MOBILE QUICK ACTIONS */}
          <div className="xl:hidden px-4 py-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">Admin Panel</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <Link to="/admin/notifications" className="text-white/80 hover:text-[#D4AF37] transition">
                <Bell size={20} />
              </Link>
              <Link to="/admin/settings" className="text-white/80 hover:text-[#D4AF37] transition">
                <Settings size={20} />
              </Link>
              <Link to="/admin/profile" className="text-white/80 hover:text-[#D4AF37] transition">
                <User size={20} />
              </Link>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 min-h-0">
            {/* Dashboard */}
            <Link
              to={dashboardItem.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${collapsed ? "xl:justify-center" : ""}
                ${location.pathname === "/admin"
                  ? "bg-[#D4AF37] text-black"
                  : "hover:bg-[#D4AF37]/20"
                }`}
            >
              <LayoutDashboard size={18} className="flex-shrink-0" />
              <span className={`${collapsed ? "xl:hidden" : ""} truncate`}>
                {dashboardItem.label}
              </span>
            </Link>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                    ${collapsed ? "xl:justify-center" : ""}
                    ${isActive ? "bg-[#D4AF37] text-black" : "hover:bg-[#D4AF37]/20"}`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className={`${collapsed ? "xl:hidden" : ""} truncate`}>
                    {item.label}
                  </span>
                  {item.path === "/admin/notifications" && unreadCount > 0 && !collapsed && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full flex-shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* PROFILE */}
          <div className="border-t border-[#D4AF37]/30 p-4 flex-shrink-0">
            {/* Mobile: always show AdminDropdown */}
            <div className="xl:hidden">
              <AdminDropdown />
            </div>
            {/* Desktop: respect collapsed state */}
            <div className="hidden xl:block">
              {collapsed ? (
                <Link
                  to="/admin/profile"
                  className="flex items-center justify-center h-10 rounded-lg hover:bg-[#D4AF37]/20 transition"
                >
                  <User size={18} />
                </Link>
              ) : (
                <AdminDropdown />
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
