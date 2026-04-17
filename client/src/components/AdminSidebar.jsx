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
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/reallogo.png";
import AdminDropdown from "./AdminDropdown";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
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
    { path: "/admin/coupons", label: "Coupons", icon: Tag },
    { path: "/admin/content", label: "Content Editor", icon: Edit3 },
    { path: "/admin/events", label: "Events", icon: Calendar },
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#011F5B] text-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#D4AF37]/30">
          <img src={logo} alt="Logo" className="h-9" />
          <button className="xl:hidden" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* NAV ITEMS */}
        <div className="flex flex-col px-3 py-4 space-y-2">
          {/* Dashboard */}
          <Link
            to={dashboardItem.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
            ${
              location.pathname === "/admin"
                ? "bg-[#D4AF37] text-black"
                : "hover:bg-[#D4AF37]/20"
            }`}
          >
            <LayoutDashboard size={18} />
            {dashboardItem.label}
          </Link>

          {/* Other Links */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-[#D4AF37] text-black"
                    : "hover:bg-[#D4AF37]/20"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* FOOTER / PROFILE */}
        <div className="absolute bottom-0 w-full border-t border-[#D4AF37]/30 p-4">
          <AdminDropdown />
        </div>
      </aside>

      {/* CONTENT SPACING (VERY IMPORTANT) */}
      <div className="xl:ml-64" />
    </>
  );
}
