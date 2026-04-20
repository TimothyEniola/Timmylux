import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, Headphones, Star, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import EventsSection from "../components/EventsSection";
import { products } from "../data/Products";

export default function Home() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState("07:00:00");
  const [timerColor, setTimerColor] = useState("bg-emerald-500");
  const saleEndTimeRef = useRef(Date.now() + 7 * 60 * 60 * 1000);

  const [content, setContent] = useState({
    hero: {
      title: "Explore Our Modern Furniture Collection",
      subtitle:
        "Discover timeless elegance and modern comfort with our curated collection of premium furniture. Transform your space with pieces that blend luxury craftsmanship with contemporary design.",
      backgroundImage:
        "https://images.unsplash.com/photo-1759691555105-17e609a3e46f?auto=format&fit=crop&q=80",
      ctaText: "Shop Now →",
      secondaryCtaText: "View All Products",
    },
    features: {
      title: "Why Choose Us",
      subtitle: "Experience luxury furniture shopping like never before",
      features: [
        { title: "Free Shipping", description: "Free shipping for orders above $1000", icon: "Package" },
        { title: "Secure Payment", description: "100% secure payment methods", icon: "CreditCard" },
        { title: "24/7 Support", description: "Round the clock customer support", icon: "Headphones" },
        { title: "Quality Guarantee", description: "Premium quality furniture guaranteed", icon: "Star" },
      ],
    },
    categories: {
      title: "Browse by Category",
      subtitle: "Explore our wide range of collections",
      categories: [
        {
          name: "Living Room",
          count: "200+ Items",
          image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
          items: ["Sofa Sets", "Coffee Tables", "Armchairs", "TV Units"],
        },
        {
          name: "Bedroom",
          count: "150+ Items",
          image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg",
          items: ["Beds", "Wardrobes", "Nightstands", "Dressers"],
        },
        {
          name: "Dining",
          count: "80+ Items",
          image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          items: ["Dining Tables", "Chairs", "Sideboards", "Bar Stools"],
        },
      ],
    },
    products: {
      title: "Curated Home Highlights",
      subtitle: "Featured Products",
      flashSaleText: "Flash Sale",
      description: "Only 4 exclusive items featured here",
    },
  });

  const homepageProducts = products.filter((product) => product.featured).slice(0, 4);

  useEffect(() => {
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
      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
      const newColor = diff <= 6 * 60 * 60 * 1000 ? "bg-red-500" : "bg-emerald-500";
      setTimerColor((prev) => (prev !== newColor ? newColor : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <style>{`
        /* ── Global enhancements ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .home-page {
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Hero ── */
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #f9f7f2 0%, #ffffff 60%, #f5f0e8 100%);
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(1,31,91,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #D4AF37, #fbbf24);
          color: #fff;
          padding: 6px 18px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 14px rgba(212,175,55,0.35);
        }

        .hero-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          animation: pulse-dot 1.8s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
          color: #0d1117;
          letter-spacing: -0.02em;
        }

        .hero-title span {
          color: #D4AF37;
          font-style: italic;
        }

        .hero-subtitle {
          font-size: 1rem;
          line-height: 1.75;
          color: #6b7280;
          max-width: 420px;
        }

        .btn-primary-enhanced {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #011F5B, #0d2f7a);
          color: #fff;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(1,31,91,0.25);
          position: relative;
          overflow: hidden;
        }

        .btn-primary-enhanced::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(212,175,55,0.15));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .btn-primary-enhanced:hover::after { opacity: 1; }
        .btn-primary-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(1,31,91,0.35);
        }

        .btn-outline-enhanced {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #011F5B;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1.5px solid #011F5B;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-outline-enhanced:hover {
          background: #011F5B;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(1,31,91,0.2);
        }

        /* Hero image frame */
        .hero-image-frame {
          position: relative;
        }

        .hero-image-frame::before {
          content: '';
          position: absolute;
          top: -12px;
          left: -12px;
          right: 12px;
          bottom: 12px;
          border: 2px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          pointer-events: none;
          z-index: 0;
        }

        .hero-image-frame .img-wrap {
          position: relative;
          z-index: 1;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        }

        .hero-image-frame img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .hero-image-frame:hover img {
          transform: scale(1.03);
        }

        /* Floating stat cards */
        .stat-card {
          position: absolute;
          background: #fff;
          border-radius: 14px;
          padding: 12px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 10;
          animation: float-card 4s ease-in-out infinite;
        }

        .stat-card.top-right {
          top: 20px;
          right: -20px;
          animation-delay: 0s;
        }

        .stat-card.bottom-left {
          bottom: 60px;
          left: -20px;
          animation-delay: 2s;
        }

        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .stat-card .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0d1117;
          line-height: 1;
        }

        .stat-card .stat-label {
          font-size: 0.7rem;
          color: #9ca3af;
          font-weight: 500;
        }

        /* ── Features ── */
        .features-section {
          background: #fff;
          position: relative;
        }

        .features-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
        }

        .section-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 10px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          color: #0d1117;
          letter-spacing: -0.02em;
        }

        .feature-card {
          background: #fff;
          border: 1px solid #f1f0ec;
          border-radius: 18px;
          padding: 28px 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #D4AF37, #fbbf24);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .feature-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          transform: translateY(-4px);
          border-color: transparent;
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon-wrap {
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Categories ── */
        .categories-section {
          background: linear-gradient(180deg, #f9f7f2 0%, #f3efe6 100%);
          position: relative;
        }

        .category-card {
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: all 0.35s ease;
          position: relative;
        }

        .category-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 22px;
          border: 2px solid transparent;
          transition: border-color 0.35s ease;
          pointer-events: none;
        }

        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }

        .category-card:hover::after {
          border-color: rgba(212,175,55,0.4);
        }

        .category-card-inner {
          padding: 28px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .category-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #D4AF37;
          background: rgba(212,175,55,0.08);
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 8px;
        }

        .category-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #0d1117;
          letter-spacing: -0.01em;
          margin-bottom: 14px;
        }

        .category-item-list {
          list-style: none;
          padding: 0;
          margin: 0 0 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .category-item-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .category-item-list li::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D4AF37;
          flex-shrink: 0;
        }

        .category-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #D4AF37;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
        }

        .category-view-btn:hover {
          color: #011F5B;
          gap: 10px;
        }

        .category-image-wrap {
          width: 120px;
          height: 160px;
          flex-shrink: 0;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
        }

        .category-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .category-card:hover .category-image-wrap img {
          transform: scale(1.08);
        }

        .category-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(1,31,91,0.15));
        }

        /* ── Products Section ── */
        .products-section {
          background: #fff;
          position: relative;
        }

        .flash-sale-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 18px 24px;
          background: linear-gradient(135deg, #011F5B, #0d2f7a);
          border-radius: 16px;
          margin-bottom: 32px;
        }

        .flash-sale-label {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .flash-sale-label .dot {
          width: 8px;
          height: 8px;
          background: #fbbf24;
          border-radius: 50%;
          animation: pulse-dot 1.4s ease-in-out infinite;
        }

        .flash-sale-label span {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fbbf24;
        }

        .flash-sale-bar h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 0 auto 48px;
          max-width: 320px;
        }

        .divider-ornament::before,
        .divider-ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D4AF37);
        }

        .divider-ornament::after {
          background: linear-gradient(90deg, #D4AF37, transparent);
        }

        .divider-ornament .diamond {
          width: 8px;
          height: 8px;
          background: #D4AF37;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* View all link */
        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #011F5B;
          font-weight: 600;
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 12px 24px;
          border-radius: 10px;
          border: 1.5px solid rgba(1,31,91,0.2);
        }

        .view-all-link:hover {
          background: #011F5B;
          color: #fff;
          border-color: #011F5B;
          gap: 12px;
        }

        /* Scroll reveal */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          animation: fadeUp 0.6s ease forwards;
        }

        .fade-up-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-delay-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-delay-4 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      {/* ── Hero Section ── */}
      <section className="hero-section py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="fade-up">
              <div className="hero-badge">The Best Online Furniture Store</div>

              <h1 className="hero-title mb-6">
                {/* Split title to italicize last word for elegance */}
                Explore Our <span>Modern</span><br />Furniture Collection
              </h1>

              <p className="hero-subtitle mb-10">{content.hero.subtitle}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary-enhanced" onClick={() => navigate("/products")}>
                  {content.hero.ctaText}
                </button>
                <button className="btn-outline-enhanced" onClick={() => navigate("/products")}>
                  {content.hero.secondaryCtaText}
                </button>
              </div>
            </div>

            {/* Right — image with floating stats */}
            <div className="hero-image-frame fade-up fade-up-delay-2" style={{ position: "relative" }}>
              {/* Floating stat: Customers */}
              <div className="stat-card top-right">
                <div className="stat-icon" style={{ background: "rgba(212,175,55,0.12)" }}>
                  <Star size={18} fill="#D4AF37" color="#D4AF37" />
                </div>
                <div>
                  <div className="stat-value">4.9</div>
                  <div className="stat-label">Avg. Rating</div>
                </div>
              </div>

              {/* Floating stat: Items */}
              <div className="stat-card bottom-left">
                <div className="stat-icon" style={{ background: "rgba(1,31,91,0.08)" }}>
                  <Package size={18} color="#011F5B" />
                </div>
                <div>
                  <div className="stat-value">2,500+</div>
                  <div className="stat-label">Curated Items</div>
                </div>
              </div>

              <div className="img-wrap">
                <img src={content.hero.backgroundImage} alt="Living Room" loading="lazy" />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(1,31,91,0.75), transparent)",
                    padding: "28px 24px",
                  }}
                >
                  <h3 style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                    Living Room
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 4, fontSize: "0.9rem" }}>2,500+ Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Our Promise</span>
            <h2 className="section-title">{content.features.title}</h2>
            <p className="text-gray-500 mt-3 text-sm">{content.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.features.map((feature, index) => {
              const IconComponent =
                feature.icon === "Package" ? Package :
                feature.icon === "CreditCard" ? CreditCard :
                feature.icon === "Headphones" ? Headphones : Star;

              const iconStyles = [
                { bg: "rgba(251,191,36,0.12)", color: "#D4AF37" },
                { bg: "rgba(212,175,55,0.12)", color: "#b8971e" },
                { bg: "rgba(1,31,91,0.10)", color: "#011F5B" },
                { bg: "rgba(251,191,36,0.12)", color: "#D4AF37" },
              ];

              return (
                <div
                  key={index}
                  className={`feature-card fade-up fade-up-delay-${index + 1}`}
                >
                  <div
                    className="feature-icon-wrap"
                    style={{ background: iconStyles[index].bg }}
                  >
                    <IconComponent color={iconStyles[index].color} size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0d1117", marginBottom: 6 }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: "0.83rem", color: "#6b7280", lineHeight: 1.6 }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="categories-section py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Collections</span>
            <h2 className="section-title">{content.categories.title}</h2>
            <p className="text-gray-500 mt-3 text-sm">{content.categories.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {content.categories.categories.map((category, index) => (
              <div key={index} className={`category-card fade-up fade-up-delay-${index + 1}`}>
                <div className="category-card-inner">
                  <div style={{ flex: 1 }}>
                    <div className="category-count-badge">
                      <span>{category.count}</span>
                    </div>
                    <h3 className="category-name">{category.name}</h3>
                    <ul className="category-item-list">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                    <button
                      className="category-view-btn"
                      onClick={() => navigate(`/products?category=${category.name}`)}
                    >
                      View Collection <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="category-image-wrap">
                    <img src={category.image} alt={category.name} loading="lazy" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="view-all-link" onClick={() => navigate("/products")}>
              View All Categories <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Products Section ── */}
      <section className="products-section py-20">
        <div className="container-custom">
          <div className="text-center mb-4">
            <span className="section-eyebrow">{content.products.subtitle}</span>
            <h2 className="section-title">{content.products.title}</h2>
          </div>

          <div className="divider-ornament">
            <div className="diamond" />
          </div>

          {/* Flash Sale Bar */}
          <div className="flash-sale-bar">
            <div className="flash-sale-label">
              <div className="dot" />
              <span>{content.products.flashSaleText}</span>
            </div>
            <h3>{content.products.description}</h3>
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
            <button className="view-all-link" onClick={() => navigate("/products")}>
              View All Products <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Events Section — untouched component */}
      <EventsSection />
    </div>
  );
}
