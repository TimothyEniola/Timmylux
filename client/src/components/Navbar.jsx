
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  User,
  Settings,
  Home,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/reallogo.png";

export default function UserSidebar() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("userProfileImage") || null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setOpen(false); // close sidebar on route change (mobile)
  }, [location.pathname]);

  // close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Shop", icon: ShoppingCart },
    { path: "/about", label: "About", icon: User },
    { path: "/custom-request", label: "Custom Request", icon: Settings },
    { path: "/wishlist", label: "Wishlist", icon: Heart },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
    { path: "/track-order", label: "Track Order", icon: Search },
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
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#D4AF37]/30">
          <img src={logo} alt="Logo" className="h-9" />
          <button className="xl:hidden" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* NAV ITEMS */}
        <div className="flex flex-col px-3 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${isActive
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

        {/* FOOTER / USER */}
        <div
          className="absolute bottom-0 w-full border-t border-[#D4AF37]/30 p-4"
          ref={dropdownRef}
        >
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-3 w-full"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
            <span className="text-sm">My Account</span>
          </button>

          {userDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white text-black rounded-lg shadow-xl border border-gray-200 py-2 z-[100]">
              <DropdownLink to="/profile" label="My Profile" />
              <DropdownLink to="/orders" label="Order History" />
              <DropdownLink to="/settings" label="Settings" />
            </div>
          )}
        </div>
      </aside>

      {/* CONTENT SPACING (SAME AS ADMIN) */}
      <div className="xl:ml-64" />
    </>
  );
}

/* Reusable dropdown link */
const DropdownLink = ({ to, label }) => (
  <Link to={to} className="block px-4 py-2 hover:bg-gray-100">
    {label}
  </Link>
);