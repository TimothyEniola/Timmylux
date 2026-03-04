

import { Link, useLocation } from "react-router-dom";
import { Menu, X, BarChart3, Package, Plus, ShoppingCart, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/reallogo.png";

export default function AdminNavbar() {
  // ❌ REMOVED useAuth
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: BarChart3 },
    { path: "/admin/products", label: "Manage Products", icon: Package },
    { path: "/admin/add-product", label: "Add New Product", icon: Plus },
    { path: "/admin/orders", label: "Recent Orders", icon: ShoppingCart },
  ];

  return (
    <nav className="bg-[#011F5B] text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logo} alt="Timmy Luxe Logo" className="h-10" />
            <span className="font-bold text-[#D4AF37]">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-[#D4AF37] transition-colors duration-300 font-medium flex items-center gap-2 ${
                  location.pathname === item.path ? "text-[#D4AF37]" : ""
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Actions (STATIC PLACEHOLDER) */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#011F5B] rounded-full flex items-center justify-center border-2 border-[#D4AF37]">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm">Admin</span>
            </div>

            {/* Sign Out Button (DUMMY) */}
            <button
              onClick={() => alert("Sign out logic removed")}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-3 border-t pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-2 ${
                  location.pathname === item.path ? "text-[#D4AF37]" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#011F5B] rounded-full flex items-center justify-center border-2 border-[#D4AF37]">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <span className="block text-sm text-gray-300">Admin</span>
                  <span className="block text-xs text-gray-400">Administrator</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert("Sign out logic removed");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
