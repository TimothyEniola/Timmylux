import {
  HelpCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageSquare,
  FileText,
  AlertCircle,
  PhoneIcon,
  ShoppingCart,
  Heart,
  User,
  Package,
  Search,
  Bell,
  GraduationCap,
  ClipboardList,
  MapPin,
  ChevronDown,
  ChevronUp,
  LogIn,
  Settings,
  Star,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition"
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp size={18} className="text-[#011F5B] flex-shrink-0 ml-3" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children, accent = false }) => (
  <div
    className={`rounded-2xl p-6 border ${
      accent
        ? "bg-[#011F5B] border-[#011F5B] text-white"
        : "bg-white border-gray-200 hover:border-[#011F5B] transition-colors"
    }`}
  >
    <div className={`flex items-center gap-3 mb-3 ${accent ? "text-[#D4AF37]" : "text-[#011F5B]"}`}>
      <Icon size={20} />
      <h3 className={`font-semibold text-base ${accent ? "text-white" : "text-[#011F5B]"}`}>{title}</h3>
    </div>
    <div className={`text-sm leading-relaxed space-y-1.5 ${accent ? "text-white/80" : "text-gray-600"}`}>
      {children}
    </div>
  </div>
);

export default function Help() {
  const [activePolicy, setActivePolicy] = useState("repair");
  const [policies, setPolicies] = useState({
    repairPolicy:
      "For repairs, please call our support team. We only provide repair services for goods purchased directly from us.",
    returnPolicy:
      "Items must be returned within 1-2 weeks after delivery. Contact our support team to arrange collection. We only accept returns for goods purchased from us.",
  });

  useEffect(() => {
    const savedPolicies = localStorage.getItem("adminPolicies");
    if (savedPolicies) {
      setPolicies(JSON.parse(savedPolicies));
    }
  }, []);

  const siteFeatures = [
    {
      icon: Home,
      title: "Home Page",
      desc: "The home page shows featured furniture collections, flash sales, new arrivals, and highlights from TimmyLux. Use it as your starting point to explore what's available.",
    },
    {
      icon: Search,
      title: "Search & Browse Products",
      desc: "Use the search bar at the top (desktop) or inside the sidebar menu (mobile) to find specific furniture. You can also browse by category using the filter on the Shop page.",
    },
    {
      icon: ShoppingCart,
      title: "Cart",
      desc: "Add products to your cart by clicking the cart icon on any product card. Visit the Cart page to review items, update quantities, or remove products before checking out.",
    },
    {
      icon: Heart,
      title: "Wishlist",
      desc: "Save items you love but aren't ready to buy yet. Click the heart icon on any product to add it to your wishlist. From your wishlist, you can move items to cart when you're ready.",
    },
    {
      icon: CreditCard,
      title: "Checkout & Payment",
      desc: "At checkout, fill in your delivery details. We accept payment via Paystack (card, bank transfer) and Cash on Delivery. Your order is confirmed immediately after payment.",
    },
    {
      icon: Package,
      title: "Order History",
      desc: "View all your past and current orders under your account. Each order shows the status, items purchased, total cost, and delivery information.",
    },
    {
      icon: Truck,
      title: "Track Order",
      desc: "Track your delivery in real time using the Track Order page. Enter your order ID to see your current delivery status and estimated arrival time.",
    },
    {
      icon: User,
      title: "Your Account & Profile",
      desc: "Sign in or create an account to save your orders, wishlist, and preferences. Update your name, email, and profile photo from the Profile page under Account Settings.",
    },
    {
      icon: GraduationCap,
      title: "TimmyLux Academy",
      desc: "Our Academy offers hands-on furniture design and craftsmanship training. Learn woodworking, interior design basics, and how to run a furniture business. Visit the Academy page to apply.",
    },
    {
      icon: ClipboardList,
      title: "Custom Request",
      desc: "Want a furniture piece designed to your exact specs? Submit a custom request with your measurements, material preferences, and design ideas. Our team will contact you with a quote.",
    },
    {
      icon: Bell,
      title: "Notifications",
      desc: "The notifications bell keeps you updated on order confirmations, delivery updates, and important account activity. Find it in the top bar (desktop) or sidebar menu (mobile).",
    },
    {
      icon: Settings,
      title: "Account Settings",
      desc: "Manage your password, notification preferences, and personal details from the Settings page. Access it via your profile dropdown in the sidebar.",
    },
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on the profile icon at the bottom of the sidebar and select 'Sign In'. On the Sign In page, click 'Create Account' or 'Sign Up' to register with your name, email, and password.",
    },
    {
      question: "How do I search for a product?",
      answer:
        "On desktop, use the search bar in the top bar. On mobile, open the sidebar menu and use the search bar at the top. Type a product name, category, or collection and press Enter.",
    },
    {
      question: "How do I add a product to my cart?",
      answer:
        "Browse the Shop page and click the shopping cart icon on any product card. A toast notification will confirm it was added. You can then visit the Cart page to review your items.",
    },
    {
      question: "Can I save products for later?",
      answer:
        "Yes! Click the heart icon on any product to add it to your Wishlist. You need to be signed in to save wishlist items. From the Wishlist page, you can move items to your cart when ready.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Go to Track Order from the sidebar menu. Enter your order ID (found in your Order History or confirmation email) to see your real-time delivery status.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Paystack (debit/credit cards and bank transfers) and Cash on Delivery. All online payments are secured by Paystack.",
    },
    {
      question: "How do I change or cancel my order?",
      answer:
        "Contact our support team immediately after placing the order. Orders can be modified or cancelled before they are dispatched. Call +234 814 083 8535 or email support@timmyluxfurniture.com.",
    },
    {
      question: "How do I return an item?",
      answer: (
        <span>
          {policies.returnPolicy} Call us at{" "}
          <a href="tel:+2348140838535" className="text-[#011F5B] font-medium">
            +234 814 083 8535
          </a>{" "}
          to arrange collection.
        </span>
      ),
    },
    {
      question: "How do I request a repair?",
      answer: policies.repairPolicy,
    },
    {
      question: "How do I apply for TimmyLux Academy?",
      answer:
        "Visit the Academy page from the sidebar. Read about the program, then click 'Apply Now' and fill in the application form. Our team will review your application and contact you.",
    },
    {
      question: "How do I submit a custom furniture request?",
      answer:
        "Go to Custom Request from the sidebar. Fill in the form with your furniture specifications, preferred materials, dimensions, and any reference images. Our team will reach out with a quote.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Click on your profile at the bottom of the sidebar, then select 'Profile' from the dropdown. From there you can update your name, email, and profile photo.",
    },
    {
      question: "I forgot my password. What do I do?",
      answer:
        "On the Sign In page, click 'Forgot Password' to receive a reset link via your registered email address.",
    },
    {
      question: "Why am I not receiving notifications?",
      answer:
        "Make sure you are signed in to your account. Notifications appear for order updates and account activity. You can view all notifications by clicking the bell icon in the top bar or sidebar.",
    },
  ];

  return (
    <div className="container-custom py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── HEADER ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-start gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-[#011F5B] text-white flex items-center justify-center flex-shrink-0">
              <HelpCircle size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#011F5B]">Help Center</h1>
              <p className="text-gray-500 mt-2 max-w-2xl text-sm leading-relaxed">
                Everything you need to know about using TimmyLux Furniture — from
                shopping and checkout to your account, orders, and the academy.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Shop", to: "/products", icon: ShoppingCart },
              { label: "Track Order", to: "/track-order", icon: Truck },
              { label: "Academy", to: "/academy", icon: GraduationCap },
              { label: "Contact Us", to: "/custom-request", icon: MessageSquare },
            ].map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2 justify-center px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#011F5B] hover:bg-[#011F5B] hover:text-white hover:border-[#011F5B] transition"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── HOW TO USE THIS SITE ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center">
              <Star size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[#011F5B]">How to Use This Site</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            A complete guide to every feature available on TimmyLux Furniture.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {siteFeatures.map((feat, i) => (
              <SectionCard key={i} icon={feat.icon} title={feat.title}>
                <p>{feat.desc}</p>
              </SectionCard>
            ))}
          </div>
        </div>

        {/* ── GETTING STARTED ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#011F5B] text-white flex items-center justify-center">
              <LogIn size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[#011F5B]">Getting Started</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create an Account",
                desc: "Click the profile icon in the sidebar → Sign In → Create Account. Fill in your name, email, and password to register.",
              },
              {
                step: "2",
                title: "Browse the Shop",
                desc: "Go to Shop from the sidebar to explore all our furniture collections. Use the search bar or category filter to narrow results.",
              },
              {
                step: "3",
                title: "Add to Cart & Checkout",
                desc: "Click the cart icon on a product to add it. Review your cart, then proceed to checkout to enter delivery details and pay.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="rounded-2xl p-5 bg-[#F8F9FC] border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#011F5B] text-[#D4AF37] flex items-center justify-center font-bold text-sm mb-3">
                  {step}
                </div>
                <h4 className="font-semibold text-[#011F5B] mb-1">{title}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[#011F5B]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div id="contact" className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#011F5B] text-white flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[#011F5B]">Contact Support</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl p-5 bg-[#F8F9FC] border border-gray-200">
              <PhoneIcon size={18} className="text-[#011F5B] mb-3" />
              <p className="font-semibold text-sm text-[#011F5B] mb-1">Phone</p>
              <a href="tel:+2348140838535" className="text-sm text-[#D4AF37] font-medium hover:underline">
                +234 814 083 8535
              </a>
            </div>
            <div className="rounded-2xl p-5 bg-[#F8F9FC] border border-gray-200">
              <MessageSquare size={18} className="text-[#011F5B] mb-3" />
              <p className="font-semibold text-sm text-[#011F5B] mb-1">Email</p>
              <a
                href="mailto:support@timmyluxfurniture.com"
                className="text-sm text-[#D4AF37] font-medium hover:underline break-all"
              >
                support@timmyluxfurniture.com
              </a>
            </div>
            <div className="rounded-2xl p-5 bg-[#F8F9FC] border border-gray-200">
              <MapPin size={18} className="text-[#011F5B] mb-3" />
              <p className="font-semibold text-sm text-[#011F5B] mb-1">Hours</p>
              <p className="text-sm text-gray-600">Mon – Fri, 9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* ── POLICIES ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h2 className="text-3xl font-bold text-[#011F5B]">Our Policies</h2>
          </div>

          {/* Policy Tabs */}
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            <button
              onClick={() => setActivePolicy("repair")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activePolicy === "repair"
                  ? "border-[#011F5B] text-[#011F5B]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <PhoneIcon size={18} />
              Repair & Service
            </button>
            <button
              onClick={() => setActivePolicy("return")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activePolicy === "return"
                  ? "border-[#011F5B] text-[#011F5B]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Truck size={18} />
              Returns & Exchange
            </button>
            <button
              onClick={() => setActivePolicy("terms")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activePolicy === "terms"
                  ? "border-[#011F5B] text-[#011F5B]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShieldCheck size={18} />
              Terms
            </button>
          </div>

          {/* Repair Policy */}
          {activePolicy === "repair" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-[#011F5B] p-4 rounded">
                <p className="flex items-start gap-2 text-[#011F5B] font-semibold">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span>
                    Important: Repair services are only available for goods purchased directly from
                    TimmyLux Furniture
                  </span>
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <h3 className="text-lg font-semibold text-[#011F5B] mt-4">Repair & Service Policy</h3>
                <p className="mt-2">{policies.repairPolicy}</p>

                <h4 className="font-semibold text-[#011F5B] mt-4">How to Request a Repair:</h4>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>
                    Call our support team at{" "}
                    <a href="tel:+2348140838535" className="font-semibold text-[#011F5B]">
                      +234 814 083 8535
                    </a>
                  </li>
                  <li>Provide your purchase proof or order number</li>
                  <li>Describe the issue in detail</li>
                  <li>We will assess the damage and provide a quote</li>
                  <li>Our team will arrange pickup and delivery</li>
                </ol>

                <h4 className="font-semibold text-[#011F5B] mt-4">Warranty Information:</h4>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>All furniture comes with a 1-year manufacturing defect warranty</li>
                  <li>Warranty covers structural defects and craftsmanship issues</li>
                  <li>Warranty does NOT cover damage from misuse, accidents, or wear and tear</li>
                  <li>Normal usage marks and minor imperfections are not covered</li>
                </ul>
              </div>
            </div>
          )}

          {/* Return Policy */}
          {activePolicy === "return" && (
            <div className="space-y-4">
              <div className="bg-orange-50 border-l-4 border-[#D4AF37] p-4 rounded">
                <p className="flex items-start gap-2 text-orange-800 font-semibold">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Items must be returned within 1-2 weeks after delivery or we will not collect them</span>
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <h3 className="text-lg font-semibold text-[#011F5B] mt-4">Returns & Exchange Policy</h3>
                <p className="mt-2">{policies.returnPolicy}</p>

                <h4 className="font-semibold text-[#011F5B] mt-4">Return Timeline:</h4>
                <div className="space-y-3 mt-2 bg-gray-50 p-4 rounded">
                  <div>
                    <p className="font-semibold text-green-700">✓ Within 1-2 Weeks of Delivery</p>
                    <p className="text-sm text-gray-600">Full refund or exchange available. Contact us to arrange pickup.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-700">✗ After 2 Weeks of Delivery</p>
                    <p className="text-sm text-gray-600">We will not collect the item. No return accepted.</p>
                  </div>
                </div>

                <h4 className="font-semibold text-[#011F5B] mt-4">How to Request a Return:</h4>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Call our support team within 1-2 weeks of delivery</li>
                  <li>Provide your order number and reason for return</li>
                  <li>Item must be in good condition (unused, not damaged by misuse)</li>
                  <li>We will arrange pickup at no extra cost</li>
                  <li>Refund will be processed within 5-7 business days after inspection</li>
                </ol>

                <h4 className="font-semibold text-[#011F5B] mt-4">Non-Returnable Items:</h4>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Custom-made or personalized furniture</li>
                  <li>Items damaged by customer misuse or accidents</li>
                  <li>Items purchased more than 2 weeks ago</li>
                  <li>Items without proof of purchase</li>
                </ul>
              </div>
            </div>
          )}

          {/* Terms */}
          {activePolicy === "terms" && (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none text-gray-700">
                <h3 className="text-lg font-semibold text-[#011F5B] mt-4">General Terms & Conditions</h3>

                <h4 className="font-semibold text-[#011F5B] mt-4">Eligibility:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Repair and return services are ONLY for goods purchased directly from TimmyLux Furniture</li>
                  <li>Items purchased from third-party retailers are NOT eligible</li>
                  <li>Proof of purchase (receipt or order number) is required</li>
                </ul>

                <h4 className="font-semibold text-[#011F5B] mt-4">Important Deadlines:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Return Window:</strong> Items must be reported for return within 1-2 weeks of delivery
                  </li>
                  <li>
                    <strong>Pickup Deadline:</strong> We will only pick up items within this timeframe
                  </li>
                  <li>
                    <strong>After Deadline:</strong> We will NOT collect items after 2 weeks from delivery
                  </li>
                </ul>

                <h4 className="font-semibold text-[#011F5B] mt-4">Contacting Support:</h4>
                <div className="space-y-2 bg-gray-50 p-4 rounded mt-2">
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <a href="tel:+2348140838535" className="text-[#011F5B]">
                      +234 814 083 8535
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a href="mailto:support@timmyluxfurniture.com" className="text-[#011F5B]">
                      support@timmyluxfurniture.com
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">Hours:</span> Monday - Friday, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
