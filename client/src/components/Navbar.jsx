import { Menu, X, Search, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/reallogo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link
              to="/about"
              className="hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              About
            </Link>
            <Link
              to="/custom-request"
              className="hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              Custom Request
            </Link>
          </div>

          {/* Action Icons */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Search Icon */}
            <button className="hover:text-[#D4AF37] transition-colors">
              <Search size={20} />
            </button>
            {/* Wishlist Icon */}
            <button className="hover:text-[#D4AF37] transition-colors relative">
              <Heart size={20} />
            </button>
            {/* Cart Icon */}
            <button className="hover:text-[#D4AF37] transition-colors relative">
              <ShoppingCart size={20} />
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

        {/* Mobile Navigation Content */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-3 border-t pt-4">
            <Link
              to="/"
              className="block hover:text-[#D4AF37]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block hover:text-[#D4AF37]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block hover:text-[#D4AF37]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/custom-request"
              className="block hover:text-[#D4AF37]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Custom Request
            </Link>
            {/* Mobile Action Icons */}
            <div className="flex items-center gap-4 pt-2">
              <button className="hover:text-[#D4AF37] transition-colors">
                <Search size={20} />
              </button>
              <button className="hover:text-[#D4AF37] transition-colors relative">
                <Heart size={20} />
              </button>
              <button className="hover:text-[#D4AF37] transition-colors relative">
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}