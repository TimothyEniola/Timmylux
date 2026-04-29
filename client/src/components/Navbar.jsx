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
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/reallogo.png";
import ProfileDropdown from "./ProfileDropdown";

export default function UserSidebar() {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setOpen(false); // close sidebar on route change (mobile)
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/products", label: "Shop", icon: ShoppingCart },
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

        {/* FOOTER / USER */}
        <div className="absolute bottom-0 w-full border-t border-[#D4AF37]/30 p-4">
          <ProfileDropdown />
        </div>
      </aside>

      {/* CONTENT SPACING */}
      <div className="xl:ml-64" />
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