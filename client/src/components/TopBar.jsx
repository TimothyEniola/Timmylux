import { Phone } from "lucide-react";
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
    <div className="bg-[#D4AF37] text-white py-2">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm gap-2">
          {/* Contact Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <a href="tel:+2348140838535" className="hover:text-[#011F5B] transition-colors">
                Call Us: +234 8140838535
              </a>
            </div>
          </div>

          {/* Sign Up Link & Social Icons */}
          <div className="flex items-center gap-6">
            <Link
              to="/signup"
              className="hover:text-[#011F5B] transition-colors">
              Sign up and GET 25% OFF for your first order.{" "}
              <span className="font-semibold underline">Sign up now</span>
            </Link>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.fb.com/l/6lp1kJRRR"
                className="hover:text-[#011F5B] transition-colors"
                aria-label="Facebook">
                <FaFacebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/timmy_lux?igsh=MXRuNThldzZkMDJ3NA=="
                className="hover:text-[#011F5B] transition-colors"
                aria-label="Instagram">
                <FaInstagram size={16} />
              </a>
              <a
                href="c:\Users\Timothy\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm\LocalState\sessions\7F56C44AF03239413CA2CEB98FB75207FC8CED42\transfers\2026-10\WhatsApp Image 2026-03-04 at 7.39.11 AM.jpeg"
                className="hover:text-[#011F5B] transition-colors"
                aria-label="Whatsapp">
                <FaWhatsapp size={16} />
              </a>
              <a
                href="https://x.com/YemitanT26859"
                className="hover:text-[#011F5B] transition-colors"
                aria-label="Twitter">
                <FaXTwitter size={16} />
              </a>
              <a
                href="www.linkedin.com/in/yemitan-timothy-6235b73ab"
                className="hover:text-[#011F5B] transition-colors"
                aria-label="Linkedin">
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}