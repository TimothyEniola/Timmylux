import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#011F5B] text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
              Timmy Luxe Comfort
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Premium furniture crafted for comfort, style, and luxury. We bring
              elegance to every space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <span className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  View Cart
                </span>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone size={18} className="text-[#D4AF37]" />
                <span>+234 8140838535</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail size={18} className="text-[#D4AF37]" />
                <span>info@timmyluxe.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin size={18} className="text-[#D4AF37]" />
                <span>Ogun, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Timmy Luxe Comfort Furnitures &
            Interior Creations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
