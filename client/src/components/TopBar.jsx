import { Phone, Search, Bell, ShoppingCart, Heart } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

export default function TopBar() {
  // CART
  const { items: cartItems } = useCartStore();
  const cartCount = cartItems?.length || 0;

  // WISHLIST
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <div className="bg-[#D4AF37] text-white px-4 py-3">
      <div className="container-custom flex flex-col md:flex-row items-center gap-3 md:gap-4">

        {/* LEFT SECTION */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} />
            <a
              href="tel:+2348140838535"
              className="hover:text-[#011F5B] transition-colors"
            >
              +234 8140838535
            </a>
          </div>

          {/* Mobile Bell */}
          <button className="relative md:hidden hover:text-[#011F5B] transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
              3
            </span>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full md:flex-1 flex justify-center">
          <div className="flex items-center w-full max-w-xl bg-white rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search products, services..."
              className="w-full px-4 py-2 text-black outline-none text-sm md:text-base"
            />
            <button className="bg-[#011F5B] px-4 py-2 text-white hover:opacity-90">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">

          {/* Desktop Bell */}
          <button className="relative hidden md:flex hover:text-[#011F5B] transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
              3
            </span>
          </button>

          {/* ❤️ Wishlist */}
          <Link
            to="/wishlist"
            className="relative hover:text-[#011F5B] transition-colors"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🛒 Cart */}
          <Link
            to="/cart"
            className="relative hover:text-[#011F5B] transition-colors"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* SIGN UP */}
          <Link
            to="/signup"
            className="text-sm hover:text-[#011F5B] transition-colors whitespace-nowrap"
          >
            Sign up
          </Link>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
            <a href="https://www.fb.com/l/6lp1kJRRR" aria-label="Facebook">
              <FaFacebook size={16} />
            </a>

            <a
              href="https://www.instagram.com/timmy_lux?igsh=MXRuNThldzZkMDJ3NA=="
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://wa.me/2348140838535"
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp size={16} />
            </a>

            <a href="https://x.com/YemitanT26859" aria-label="Twitter">
              <FaXTwitter size={16} />
            </a>

            <a
              href="https://www.linkedin.com/in/yemitan-timothy-6235b73ab"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={16} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}