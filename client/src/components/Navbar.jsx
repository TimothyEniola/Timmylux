import { Menu, X, Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useState, memo, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/reallogo.png";

const Navbar = memo(function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("userProfileImage") || null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const refreshProfileImage = () => {
      setProfileImage(localStorage.getItem("userProfileImage") || null);
    };

    window.addEventListener("storage", refreshProfileImage);
    window.addEventListener("userProfileImageUpdated", refreshProfileImage);

    return () => {
      window.removeEventListener("storage", refreshProfileImage);
      window.removeEventListener("userProfileImageUpdated", refreshProfileImage);
    };
  }, []);

  return (
    <nav className="bg-[#011F5B] text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Timmy Luxe Logo"
              className="h-12 w-12 object-cover"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`transition-colors duration-300 font-medium ${
                location.pathname === "/" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`transition-colors duration-300 font-medium ${
                location.pathname === "/products" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`transition-colors duration-300 font-medium ${
                location.pathname === "/about" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
            >
              About
            </Link>
            <Link
              to="/custom-request"
              className={`transition-colors duration-300 font-medium ${
                location.pathname === "/custom-request" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
            >
              Custom Request
            </Link>
          </div>

          {/* Action Icons */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/products"
              className="hover:text-[#D4AF37] transition-colors"
            >
              <Search size={20} />
            </Link>
            <Link
              to="/wishlist"
              className="hover:text-[#D4AF37] transition-colors relative"
            >
              <Heart size={20} />
            </Link>
            <Link
              to="/cart"
              className="hover:text-[#D4AF37] transition-colors relative"
            >
              <ShoppingCart size={20} />
            </Link>
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                title="User Menu"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-[#011F5B] flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 sm:right-0 sm:w-48 left-1/2 transform -translate-x-1/2 sm:left-auto sm:transform-none">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      My Profile
                    </div>
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} />
                      Order History
                    </div>
                  </Link>
                  <Link
                    to="/track-order"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Search size={16} />
                      Track Order
                    </div>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Heart size={16} />
                      Wishlist
                    </div>
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      Settings
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Content */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-3 border-t pt-4">
            <Link
              to="/"
              className={`block transition-colors ${
                location.pathname === "/" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block transition-colors ${
                location.pathname === "/products" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`block transition-colors ${
                location.pathname === "/about" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/custom-request"
              className={`block transition-colors ${
                location.pathname === "/custom-request" 
                  ? "text-[#D4AF37]" 
                  : "hover:text-[#D4AF37] text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Custom Request
            </Link>
            {/* Mobile Action Icons */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/products"
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Search size={20} />
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-[#D4AF37] transition-colors relative"
              >
                <Heart size={20} />
              </Link>
              <Link
                to="/cart"
                className="hover:text-[#D4AF37] transition-colors relative"
              >
                <ShoppingCart size={20} />
              </Link>
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                  title="User Menu"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-[#011F5B] flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 sm:right-0 sm:w-48 left-1/2 transform -translate-x-1/2 sm:left-auto sm:transform-none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        My Profile
                      </div>
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={16} />
                        Order History
                      </div>
                    </Link>
                    <Link
                      to="/track-order"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Search size={16} />
                        Track Order
                      </div>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Heart size={16} />
                        Wishlist
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        Settings
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

export default Navbar;