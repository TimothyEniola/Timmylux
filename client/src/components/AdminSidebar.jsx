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
  const { notifications, getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();
  const location = useLocation();

  useEffect(() => {
    setOpen(false); // close on route change (mobile)
  }, [location.pathname]);

  const dashboardItem = {
    path: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  };

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
                className="p-1 hover:bg-[#D4AF37]/20 rounded transition"
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button className="xl:hidden" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="xl:hidden px-4 py-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Admin Menu</span>
              <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded-full">{unreadCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <Link to="/admin/notifications" className="text-white hover:text-[#D4AF37]">
                <Bell size={20} />
              </Link>
              <Link to="/admin/settings" className="text-white hover:text-[#D4AF37]">
                <Settings size={20} />
              </Link>
              <Link to="/admin/profile" className="text-white hover:text-[#D4AF37]">
                <User size={20} />
              </Link>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            <Link
              to={dashboardItem.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${collapsed ? "justify-center" : ""}
              ${
                location.pathname === "/admin"
                  ? "bg-[#D4AF37] text-black"
                  : "hover:bg-[#D4AF37]/20"
              }`}
            >
              <LayoutDashboard size={collapsed ? 16 : 18} />
              {!collapsed && dashboardItem.label}
            </Link>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

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
                  <Icon size={collapsed ? 16 : 18} />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#D4AF37]/30 p-4 flex-shrink-0">
            {collapsed ? (
              <Link
                to="/admin/profile"
                className="flex items-center justify-center h-12 rounded-lg hover:bg-[#D4AF37]/20 transition"
              >
                <User size={16} />
              </Link>
            ) : (
              <AdminDropdown />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
