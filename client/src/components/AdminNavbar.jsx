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

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false); // auto close when route changes
  }, [location.pathname]);

  const dashboardItem = {
    path: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  };

  const navItems = [
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/coupons", label: "Coupons", icon: Tag },
    { path: "/admin/content", label: "ContEdit", icon: Edit3 },
    { path: "/admin/events", label: "Events", icon: Calendar },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/collections", label: "Collections", icon: Layers },
    { path: "/admin/featured", label: "Featured", icon: Star },
    { path: "/admin/add-product", label: "AddPro", icon: Plus },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <nav className="bg-[#011F5B] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center h-16">

          {/* LEFT */}
          <div className="flex items-center gap-2 flex-1">
            <Link to="/admin">
              <img
                src={logo}
                alt="Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <Link
              to={dashboardItem.path}
              className={`hidden xl:flex items-center gap-1 text-sm font-medium transition-colors ${
                location.pathname === "/admin"
                  ? "text-[#D4AF37]"
                  : "text-gray-200 hover:text-[#D4AF37]"
              }`}
            >
              <LayoutDashboard size={16} />
              {dashboardItem.label}
            </Link>
          </div>

          {/* DESKTOP CENTER */}
          <div className="hidden xl:flex flex-1 justify-center">
            <div className="flex items-center gap-5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#D4AF37]"
                        : "text-gray-200 hover:text-[#D4AF37]"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden xl:flex flex-1 justify-end">
            <AdminDropdown />
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden ml-auto"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ✅ MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#011F5B] border-t border-[#D4AF37]/30 px-4 py-4 space-y-3">
          
          <Link
            to="/admin"
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#D4AF37]"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#D4AF37]"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#D4AF37]/30">
            <AdminDropdown />
          </div>
        </div>
      )}
    </nav>
  );
}