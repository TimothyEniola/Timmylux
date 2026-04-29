import { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  LogIn,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    localStorage.getItem("adminProfileImage") || null
  );

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  useEffect(() => {
    const refreshAvatar = () => {
      setAvatarUrl(localStorage.getItem("adminProfileImage") || null);
    };

    window.addEventListener("storage", refreshAvatar);
    window.addEventListener("adminProfileImageUpdated", refreshAvatar);

    return () => {
      window.removeEventListener("storage", refreshAvatar);
      window.removeEventListener("adminProfileImageUpdated", refreshAvatar);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>

      {/* 🔥 FLOATING PANEL (ABOVE BUTTON) */}
      {isOpen && (
        <div className="absolute bottom-[calc(100%+10px)] right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden transition-all duration-200">

          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-indigo-200">
            <div className="w-10 h-10 rounded-full bg-[#011F5B] border-2 border-indigo-300 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Admin avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-white" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <span className="text-xs text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded">
                Dashboard Access
              </span>
            </div>
          </div>

          {/* MENU */}
          <div className="py-1">
            <Link
              to="/admin/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <User size={14} className="text-gray-400" />
              View Profile
            </Link>
          </div>

          <div className="border-t border-gray-100" />

          {/* ACTIONS */}
          <div className="py-1">
            <button
              onClick={() => {
                alert("Sign out logic here");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* 🔥 TRIGGER BUTTON (STAYS FIXED) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 hover:text-[#D4AF37] transition-colors"
      >
        <div className="w-8 h-8 bg-[#011F5B] rounded-full overflow-hidden flex items-center justify-center border-2 border-[#D4AF37]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Admin avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>

        <span className="text-sm">Admin</span>

        <ChevronUp
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}