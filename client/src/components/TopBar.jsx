import { Phone, Search, Bell } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="bg-[#D4AF37] text-white px-4 py-3">
      <div className="container-custom flex flex-col md:flex-row items-center gap-3 md:gap-4">

        {/* TOP ROW (Mobile: contact + icons, Desktop: left section) */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} />
            <a
              href="tel:+2348140838535"
              className="hover:text-[#011F5B] transition-colors"
            >
              +234 8140838535
            </a>
          </div>

          {/* Mobile notification (visible only on small screens) */}
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

          {/* Desktop notification */}
          <button className="relative hidden md:flex hover:text-[#011F5B] transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
              3
            </span>
          </button>

          {/* Signup */}
          <Link
            to="/signup"
            className="text-sm hover:text-[#011F5B] transition-colors whitespace-nowrap"
          >
            Sign up
          </Link>

          {/* Social Icons (wrap on small screens) */}
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
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
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