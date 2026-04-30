import { useState, useEffect, useRef } from "react";
import {
  User,
  Settings,
  Package,
  Truck,
  LogOut,
  HelpCircle,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../utils/userHelpers";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const ref = useRef(null);
  const navigate = useNavigate();

  const userName = user?.name || "Guest User";
  const profileImage = user?.profileImage || null;
  const isAuthenticated = Boolean(user?.email || user?.name);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handleClick);

    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener("userDataChanged", syncUser);

    return () => {
      document.removeEventListener("pointerdown", handleClick);
      window.removeEventListener("userDataChanged", syncUser);
    };
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* 🔥 FLOATING PANEL */}
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden transition-all duration-200">

          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-indigo-200 cursor-pointer hover:from-indigo-100 hover:to-blue-200 transition">
            <div className="w-10 h-10 rounded-full bg-[#011F5B] border-2 border-indigo-300 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
            </div>

            <ChevronRight size={14} className="text-gray-400" />
          </div>

          <div className="border-t border-gray-100" />

          {/* MAIN LINKS */}
          <div className="py-1">
            {[
              { to: "/profile", icon: <User size={14} />, label: "Profile" },
              { to: "/settings", icon: <Settings size={14} />, label: "Settings" },
              { to: "/orders", icon: <Package size={14} />, label: "Orders" },
              { to: "/track-order", icon: <Truck size={14} />, label: "Track Order" },
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span className="text-gray-400">{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100" />

          {/* FOOTER */}
          <div className="py-1">
            <Link
              to="/help"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <HelpCircle size={14} className="text-gray-400" />
              Help
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  clearCurrentUser();
                  setOpen(false);
                  navigate("/signin");
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[#011F5B] hover:bg-gray-50 transition"
              >
                <LogOut size={14} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 🔥 TRIGGER */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#011F5B] border-2 border-indigo-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="flex flex-col text-left flex-1">
          <span className="text-sm font-medium">{userName}</span>
        </div>

        <ChevronUp
          size={14}
          className={`text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}