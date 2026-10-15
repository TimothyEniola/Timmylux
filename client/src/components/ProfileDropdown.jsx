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
import useAuthStore from "../store/authStore";

export default function ProfileDropdown({ compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const userName = user?.name || "User";
  const profileImage = user?.profileImage || null;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handleClick);

    return () => {
      document.removeEventListener("pointerdown", handleClick);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/signin");
  };

  return (
    <div ref={ref} className="relative">
      {/* 🔥 FLOATING PANEL */}
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden transition-all duration-200">
          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-[#011F5B]/5 to-[#D4AF37]/10 border-b border-[#D4AF37]/20 cursor-pointer hover:to-[#D4AF37]/15 transition">
            <div className="w-10 h-10 rounded-full bg-[#011F5B] border-2 border-[#D4AF37]/50 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            <ChevronRight size={14} className="text-gray-400" />
          </div>

          <div className="border-t border-gray-100" />

          {/* MAIN LINKS */}
          <div className="py-1">
            {[
              { to: "/profile", icon: <User size={14} />, label: "Profile" },
              {
                to: "/settings",
                icon: <Settings size={14} />,
                label: "Settings",
              },
              { to: "/orders", icon: <Package size={14} />, label: "Orders" },
              {
                to: "/track-order",
                icon: <Truck size={14} />,
                label: "Track Order",
              },
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

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* 🔥 TRIGGER */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-3 rounded-lg transition ${compact ? "p-0" : "w-full px-3 py-2 hover:bg-[#D4AF37]/10"}`}
      >
        <div
          className={`flex items-center justify-center ${compact ? "w-11 h-11" : "w-9 h-9"} rounded-full overflow-hidden bg-[#011F5B] border-2 border-[#D4AF37]/50 text-white text-sm font-semibold flex-shrink-0`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {!compact && (
          <>
            <div className="flex flex-col text-left flex-1 overflow-hidden">
              <span className="text-sm font-medium truncate">{userName}</span>
            </div>
            <ChevronUp
              size={14}
              className={`text-gray-500 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>
    </div>
  );
}
