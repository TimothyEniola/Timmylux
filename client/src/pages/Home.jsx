import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, Headphones, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import EventsSection from "../components/EventsSection";
import { products } from "../data/Products";

export default function Home() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState("07:00:00");
  const [timerColor, setTimerColor] = useState("bg-emerald-500");
  const saleEndTimeRef = useRef(Date.now() + 7 * 60 * 60 * 1000);

  // Load editable content from localStorage
  const [content, setContent] = useState({
    hero: {
      title: "Explore Our Modern Furniture Collection",
      subtitle: "Discover timeless elegance and modern comfort with our curated collection of premium furniture. Transform your space with pieces that blend luxury craftsmanship with contemporary design.",
      backgroundImage: "https://images.unsplash.com/photo-1759691555105-17e609a3e46f?auto=format&fit=crop&q=80",
      ctaText: "Shop Now →",
      secondaryCtaText: "View All Products"
    },
    features: {
      title: "Why Choose Us",
      subtitle: "Experience luxury furniture shopping like never before",
      features: [
        {
          title: "Free Shipping",
          description: "Free shipping for orders above $1000",
          icon: "Package"
        },
        {
          title: "Secure Payment",
          description: "100% secure payment methods",
          icon: "CreditCard"
        },
        {
          title: "24/7 Support",
          description: "Round the clock customer support",
          icon: "Headphones"
        },
        {
          title: "Quality Guarantee",
          description: "Premium quality furniture guaranteed",
          icon: "Star"
        }
      ]
    },
    categories: {
      title: "Browse by Category",
      subtitle: "Explore our wide range of collections",
      categories: [
        {
          name: "Living Room",
          count: "200+ Items",
          image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
          items: ["Sofa Sets", "Coffee Tables", "Armchairs", "TV Units"]
        },
        {
          name: "Bedroom",
          count: "150+ Items",
          image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg",
          items: ["Beds", "Wardrobes", "Nightstands", "Dressers"]
        },
        {
          name: "Dining",
          count: "80+ Items",
          image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          items: ["Dining Tables", "Chairs", "Sideboards", "Bar Stools"]
        }
      ]
    },
    products: {
      title: "Curated Home Highlights",
      subtitle: "Featured Products",
      flashSaleText: "Flash Sale",
      description: "Only 4 exclusive items featured here"
    }
  });

  const homepageProducts = products.filter(product => product.featured).slice(0, 4);

  useEffect(() => {
    // Load saved content from localStorage
    const savedContent = localStorage.getItem("adminContent");
    if (savedContent) {
      const loaded = JSON.parse(savedContent);
      if (loaded?.categories?.categories) {
        loaded.categories.categories = loaded.categories.categories.map((category) => ({
          ...category,
          count:
            category.count ||
            (Array.isArray(category.items)
              ? `${category.items.length} Items`
              : typeof category.items === "string"
              ? category.items
              : ""),
        }));
      }
      setContent(loaded);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = saleEndTimeRef.current - now;
      
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
      
      // Only update color if it changes
      const newColor = diff <= 6 * 60 * 60 * 1000 ? "bg-red-500" : "bg-emerald-500";
      setTimerColor(prev => prev !== newColor ? newColor : prev);
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
                {content.hero.title}
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                {content.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  className="btn-primary text-center inline-flex items-center justify-center"
                  onClick={() => navigate("/products")}
                >
                  {content.hero.ctaText}
                </button>
                <button
                  className="btn-outline text-center"
                  onClick={() => navigate("/products")}
                >
                  {content.hero.secondaryCtaText}
                </button>
              </div>

              {/*
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
              */}
            </div>

            {/* Right Content - Static Image */}
            <div className="relative">
              <div className="relative group overflow-hidden rounded-2xl">
                <img
                  src={content.hero.backgroundImage}
                  alt="Living Room"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white font-bold text-xl">
                    Living Room
                  </h3>
                  <p className="text-white/90 text-base">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.features.title}</h2>
            <p className="text-gray-600">{content.features.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.features.map((feature, index) => {
              const IconComponent = feature.icon === "Package" ? Package :
                                   feature.icon === "CreditCard" ? CreditCard :
                                   feature.icon === "Headphones" ? Headphones : Star;
              const bgColor = index === 0 ? "bg-[#fbbf24]" :
                             index === 1 ? "bg-[#D4AF37]" :
                             index === 2 ? "bg-[#011F5B]" : "bg-[#fbbf24]";
              
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.categories.title}</h2>
            <p className="text-gray-600">{content.categories.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.categories.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[#fbbf24] font-semibold text-sm mb-1">
                      {category.count}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {category.name}
                    </h3>
                    <ul className="space-y-2 text-gray-600 text-sm mb-4">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button 
                      className="text-[#D4AF37] font-semibold text-sm hover:text-[#011F5B] transition-colors"
                      onClick={() => navigate(`/products?category=${category.name}`)}
                    >
                      View Collection →
                    </button>
                  </div>
                  <div className="w-32 h-40 rounded-lg overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button 
              className="text-[#011F5B] font-semibold hover:text-[#D4AF37] transition-colors"
              onClick={() => navigate("/products")}
            >
              View All Categories →
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">{content.products.subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {content.products.title}
            </h2>
          </div>

          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">
              {content.products.flashSaleText}
            </p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {content.products.description}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepageProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDiscount={product.featured}
                showCardTimer={true}
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

      {/* Events Section */}
      <EventsSection />

    </div>
  );
}