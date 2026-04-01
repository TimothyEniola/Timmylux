import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, Headphones, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/Products";

export default function Home() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState("00:00:00");
  const [timerColor, setTimerColor] = useState("bg-emerald-500");

  const homepageProducts = products.slice(0, 4);

  useEffect(() => {
    const saleEndTime = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = saleEndTime - now;
      if (diff <= 0) {
        setCountdown("00:00:00");
        setTimerColor("bg-red-500");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const nextCountdown = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      setCountdown(nextCountdown);
      setTimerColor(diff <= 6 * 60 * 60 * 1000 ? "bg-red-500" : "bg-emerald-500");
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                The Best Online Furniture Store
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Explore Our Modern
                <br />
                Furniture Collection
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                Discover timeless elegance and modern comfort with our curated
                collection of premium furniture. Transform your space with
                pieces that blend luxury craftsmanship with contemporary design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  className="btn-primary text-center inline-flex items-center justify-center"
                  onClick={() => navigate("/products")}
                >
                  Shop Now →
                </button>
                <button
                  className="btn-outline text-center"
                  onClick={() => navigate("/products")}
                >
                  View All Products
                </button>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    loading="lazy"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    loading="lazy"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    loading="lazy"
                  />
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                    500+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#fbbf24]">
                    <Star size={18} fill="#fbbf24" />
                    <Star size={18} fill="#fbbf24" />
                    <Star size={18} fill="#fbbf24" />
                    <Star size={18} fill="#fbbf24" />
                    <Star size={18} fill="#fbbf24" />
                    <span className="font-bold text-gray-900 ml-1">
                      4.9 Ratings
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Trusted by 500+ Customers
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Static Image */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-2xl col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1759691555105-17e609a3e46f?auto=format&fit=crop&q=80"
                  alt="Living Room"
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg">
                    Living Room
                  </h3>
                  <p className="text-white/90 text-sm">
                    2,500+ Items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600">Experience luxury furniture shopping like never before</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#fbbf24] rounded-full flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Free Shipping
                </h3>
                <p className="text-gray-600 text-sm">
                  Free shipping for orders above $1000
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Secure Payment
                </h3>
                <p className="text-gray-600 text-sm">
                  100% secure payment methods
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#011F5B] rounded-full flex items-center justify-center">
                  <Headphones className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  24/7 Support
                </h3>
                <p className="text-gray-600 text-sm">
                  Round the clock customer support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#fbbf24] rounded-full flex items-center justify-center">
                  <Star className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Quality Guarantee
                </h3>
                <p className="text-gray-600 text-sm">
                  Premium quality furniture guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600">Explore our wide range of collections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#fbbf24] font-semibold text-sm mb-1">
                    200+ Items
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Living Room
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Sofa Sets
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Coffee Tables
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Armchairs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      TV Units
                    </li>
                  </ul>
                  <span className="text-[#D4AF37] font-semibold text-sm">
                    View Collection →
                  </span>
                </div>
                <div className="w-32 h-40 rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                    alt="Living Room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#fbbf24] font-semibold text-sm mb-1">
                    150+ Items
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Bedroom
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Beds
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Wardrobes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Nightstands
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Dressers
                    </li>
                  </ul>
                  <span className="text-[#D4AF37] font-semibold text-sm">
                    View Collection →
                  </span>
                </div>
                <div className="w-32 h-40 rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg"
                    alt="Bedroom"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#fbbf24] font-semibold text-sm mb-1">
                    80+ Items
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Dining
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Dining Tables
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Chairs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Sideboards
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Bar Stools
                    </li>
                  </ul>
                  <span className="text-[#D4AF37] font-semibold text-sm">
                    View Collection →
                  </span>
                </div>
                <div className="w-32 h-40 rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg"
                    alt="Dining"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="text-[#011F5B] font-semibold hover:text-[#D4AF37] transition-colors">
              View All Categories →
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Featured Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Curated Home Highlights
            </h2>
          </div>

          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">
                Flash Sale
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                Only 4 exclusive items featured here
              </h3>
            </div>
            <div className={`rounded-full px-4 py-3 text-sm font-semibold text-white ${timerColor}`}>
              {countdown === "00:00:00" ? "Sale ended" : `Ends in ${countdown}`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepageProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDiscount={product.featured}
                timerText={countdown === "00:00:00" ? "Sale ended" : `Ends in ${countdown}`}
                timerColor={timerColor}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="btn-outline"
              onClick={() => navigate("/products")}
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}