import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, LogOut, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:text-[#D4AF37] transition-colors"
      >
        <div className="w-8 h-8 bg-[#011F5B] rounded-full flex items-center justify-center border-2 border-[#D4AF37]">
          <User size={16} className="text-white" />
        </div>
        <span className="text-sm">Admin</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <Link
            to="/admin/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#011F5B] transition-colors border-b border-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            <span className="font-medium">View Profile</span>
          </Link>

          <button
            onClick={() => {
              alert("Sign out functionality - Frontend only");
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors border-b border-gray-200"
          >
            <LogOut size={16} className="text-red-600" />
            <span className="font-medium text-red-600">Sign Out</span>
          </button>

          <Link
            to="/signin"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <LogIn size={16} className="text-green-600" />
            <span className="font-medium text-green-600">Sign In Again</span>
          </Link>
        </div>
      )}
    </div>
  );
}