import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { logout as apiLogout } from "../api/authService";
import { ShoppingCart, Menu, X, Search, Heart, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlistStore } from "../store/wishlistStore";
import logo from "../assets/reallogo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout: clearAuth } = useAuthStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const { getCartCount, fetchCart } = useCartStore(); // Use cart store
  const isAuthenticated = !!user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch cart on mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const handleSignOut = async () => {
    try {
      await apiLogout();
      clearAuth();
      setMobileMenuOpen(false);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest(".search-container")) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // ... (Keep existing useEffect for click outside) ...

  const cartCount = getCartCount();

  return (
    <nav className="bg-[#011F5B] text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Timmy Luxe Logo"
              className="h-10 w-10 object-cover"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Shop
            </Link>
            {/* ... other links ... */}
          </div>

          {/* Action Icons */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Search Icon Logic (Keep existing) */}
            <div className="relative search-container">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Search size={20} />
              </button>
              {/* ... Search dropdown ... */}
            </div>

            <Link
              to="/wishlist"
              className="hover:text-[#D4AF37] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="hover:text-[#D4AF37] transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Logic (Keep existing) */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  {/* ... User Icon ... */}
                  <span className="text-sm">{user?.name}</span>
                </button>
                {/* ... Dropdown ... */}
              </div>
            ) : (
              <Link
                to="/signin"
                className="hover:text-[#D4AF37] transition-colors"
              >
                <User size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Menu (Keep existing but update cart count link) */}
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
            {/* ... links ... */}
            <Link
              to="/cart"
              className="block hover:text-[#D4AF37]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart ({cartCount})
            </Link>
            {/* ... other links ... */}
          </div>
        )}
      </div>
    </nav>
  );
}
