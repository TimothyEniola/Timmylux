import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  Package,
  LogOut,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../utils/userHelpers";

export default function AdminDropdown({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const ref = useRef(null);
  const navigate = useNavigate();

  // Sync user when account changes
  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener("userDataChanged", syncUser);
    return () => window.removeEventListener("userDataChanged", syncUser);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  const adminName = user?.name || "Admin User";
  const profileImage = user?.profileImage || null;

  // First + Last name initials
  const nameParts = adminName.trim().split(/\s+/);
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0].slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* FLOATING PANEL — opens upward */}
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-indigo-200">
            <div className="w-10 h-10 rounded-full bg-[#011F5B] border-2 border-indigo-300 flex items-center justify-center text-white font-semibold text-sm overflow-hidden flex-shrink-0">
              {profileImage ? (
                <img src={profileImage} alt={adminName} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{adminName}</p>
              {user?.email && (
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              )}
            </div>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          </div>

          <div className="border-t border-gray-100" />

          {/* MAIN LINKS */}
          <div className="py-1">
            {[
              { to: "/admin/profile", icon: <User size={14} />, label: "My Profile" },
              { to: "/admin/settings", icon: <Settings size={14} />, label: "Settings" },
              { to: "/admin/orders", icon: <Package size={14} />, label: "Orders" },
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

          {/* SIGN OUT */}
          <div className="py-1">
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
          </div>
        </div>
      )}

      {/* TRIGGER */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-lg transition ${compact ? "p-0" : "w-full px-3 py-2 hover:bg-[#D4AF37]/20"}`}
      >
        <div className={`flex items-center justify-center ${compact ? "w-11 h-11" : "w-9 h-9"} rounded-full bg-[#011F5B] border-2 border-[#D4AF37]/50 text-white text-sm font-semibold flex-shrink-0 overflow-hidden`}>
          {profileImage ? (
            <img src={profileImage} alt={adminName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {!compact && (
          <>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-sm font-medium truncate">{adminName}</span>
            </div>
            <ChevronUp
              size={14}
              className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>
    </div>
  );
}
