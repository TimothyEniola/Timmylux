import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BarChart3,
  Package,
  Plus,
  ShoppingCart,
  User,
  Layers,
  Star,
  LogOut,
  LogIn,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/reallogo.png";
import AdminDropdown from "./AdminDropdown";

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [adminAvatar, setAdminAvatar] = useState(localStorage.getItem("adminProfileImage") || null);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    const refreshAvatar = () => {
      setAdminAvatar(localStorage.getItem("adminProfileImage") || null);
    };

    window.addEventListener("storage", refreshAvatar);
    window.addEventListener("adminProfileImageUpdated", refreshAvatar);

    return () => {
      window.removeEventListener("storage", refreshAvatar);
      window.removeEventListener("adminProfileImageUpdated", refreshAvatar);
    };
  }, []);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: BarChart3 },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/collections", label: "Collections", icon: Layers },
    { path: "/admin/featured", label: "Featured", icon: Star },
    { path: "/admin/add-product", label: "Add Product", icon: Plus },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <nav className="bg-[#011F5B] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="Logo" className="h-9 w-auto object-contain" />
            <span className="font-semibold text-[#D4AF37] hidden sm:block">
              Admin Panel
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const ActiveIcon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-[#D4AF37] ${
                    isActive ? "text-[#D4AF37]" : "text-gray-200"
                  }`}
                >
                  <ActiveIcon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <AdminDropdown />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#011F5B] border-t border-white/10 py-4 space-y-3">
            {navItems.map((item) => {
              const ActiveIcon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-[#D4AF37]" : "text-gray-200"
                  } hover:text-[#D4AF37]`}
                >
                  <ActiveIcon size={18} />
                  {item.label}
                </Link>
              );
            })}

            <div className="flex items-center gap-3 px-4 py-4 border-t border-white/10">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-[#011F5B] flex items-center justify-center">
                {adminAvatar ? (
                  <img src={adminAvatar} alt="Admin avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-300">Profile access</p>
              </div>
            </div>

            <div className="border-t border-white/10 mt-4 pt-4 px-4 space-y-3">
              <Link
                to="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors"
              >
                <User size={18} />
                Profile
              </Link>

              <button
                onClick={() => {
                  alert("Sign out functionality - Frontend only");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                <LogOut size={18} />
                Sign Out
              </button>

              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors text-sm"
              >
                <LogIn size={18} />
                Sign In Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}