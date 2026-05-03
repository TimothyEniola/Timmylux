import { HelpCircle, ShieldCheck, Truck, CreditCard, MessageSquare, FileText, AlertCircle, PhoneIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Help() {
  const [activePolicy, setActivePolicy] = useState("repair");
  const [policies, setPolicies] = useState({
    repairPolicy: "For repairs, please call our support team. We only provide repair services for goods purchased directly from us.",
    returnPolicy: "Items must be returned within 1-2 weeks after delivery. Contact our support team to arrange collection. We only accept returns for goods purchased from us.",
  });

  useEffect(() => {
    const savedPolicies = localStorage.getItem("adminPolicies");
    if (savedPolicies) {
      setPolicies(JSON.parse(savedPolicies));
    }
  }, []);
  return (
    <div className="container-custom py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#011F5B] text-white flex items-center justify-center">
              <HelpCircle size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#011F5B]">Help Center</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Find answers to common questions, learn how to use your account, track orders, and get support fast.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4 text-[#011F5B]">
                <Truck size={20} />
                <h2 className="text-xl font-semibold">Order Tracking</h2>
              </div>
              <p className="text-gray-600">
                Track your order status, delivery time, and shipping updates in one place. Use the track order page for live status.
              </p>
              <Link
                to="/track-order"
                className="mt-4 inline-flex items-center gap-2 text-[#011F5B] font-medium hover:text-[#0e2c5b]"
              >
                Go to tracking
              </Link>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4 text-[#011F5B]">
                <CreditCard size={20} />
                <h2 className="text-xl font-semibold">Payment & Shipping</h2>
              </div>
              <p className="text-gray-600">
                Learn about our payment options, secure checkout, and delivery timelines so you can shop confidently.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4 text-[#011F5B]">
                <ShieldCheck size={20} />
                <h2 className="text-xl font-semibold">Account Safety</h2>
              </div>
              <p className="text-gray-600">
                Keep your account secure with best practices for passwords, personal info, and safe browsing.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4 text-[#011F5B]">
                <MessageSquare size={20} />
                <h2 className="text-xl font-semibold">Customer Support</h2>
              </div>
              <p className="text-gray-600">
                Need more help? Contact our customer care team for quick support with orders, returns, and product questions.
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>Phone: <a href="tel:+2348140838535" className="text-[#011F5B]">+234 814 083 8535</a></p>
                <p>Email: <a href="mailto:support@timmyluxfurniture.com" className="text-[#011F5B]">support@timmyluxfurniture.com</a></p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#011F5B] mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="font-medium">How do I change my order?</p>
                <p className="text-sm mt-1">You can update or cancel orders before they are shipped by contacting support.</p>
              </div>
              <div>
                <p className="font-medium">What payment methods do you accept?</p>
                <p className="text-sm mt-1">We accept cash on delivery and payment with Paystack.</p>
              </div>
              <div>
                <p className="font-medium">How do I return an item?</p>
                <p className="text-sm mt-1">{policies.returnPolicy}</p>
              </div>
              <div>
                <p className="font-medium">How do I request a repair?</p>
                <p className="text-sm mt-1">{policies.repairPolicy}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm col-span-2">
            <h3 className="text-lg font-semibold text-[#011F5B] mb-3">Quick Help Topics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-3xl border border-gray-200 p-5 hover:border-[#011F5B] transition">
                <h4 className="font-semibold mb-2">Shopping Guide</h4>
                <p className="text-sm text-gray-600">Find products, manage your cart, and complete checkout with clear steps.</p>
              </article>
              <article className="rounded-3xl border border-gray-200 p-5 hover:border-[#011F5B] transition">
                <h4 className="font-semibold mb-2">Academy Programs</h4>
                <p className="text-sm text-gray-600">Learn about our furniture design and craftsmanship training programs.</p>
                <Link to="/academy" className="text-sm text-[#011F5B] font-medium mt-2 inline-block">Explore Academy →</Link>
              </article>
              <article className="rounded-3xl border border-gray-200 p-5 hover:border-[#011F5B] transition">
                <h4 className="font-semibold mb-2">Account Management</h4>
                <p className="text-sm text-gray-600">Update your profile, reset passwords, and manage saved addresses from your account area.</p>
              </article>
              <article className="rounded-3xl border border-gray-200 p-5 hover:border-[#011F5B] transition">
                <h4 className="font-semibold mb-2">Delivery & Returns</h4>
                <p className="text-sm text-gray-600">Understand shipping timelines and how to request a return or exchange.</p>
              </article>
              <article className="rounded-3xl border border-gray-200 p-5 hover:border-[#011F5B] transition">
                <h4 className="font-semibold mb-2">Support Contact</h4>
                <p className="text-sm text-gray-600">Reach our team by phone or email when you need fast help.</p>
              </article>
            </div>
          </div>
        </div>

        {/* Detailed Policies Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h2 className="text-3xl font-bold text-[#011F5B]">Our Policies</h2>
          </div>

          {/* Policy Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActivePolicy("repair")}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
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
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
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
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
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
                  <span>Important: Repair services are only available for goods purchased directly from TimmyLux Furniture</span>
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <h3 className="text-lg font-semibold text-[#011F5B] mt-4">Repair & Service Policy</h3>
                <p className="mt-2">{policies.repairPolicy}</p>

                <h4 className="font-semibold text-[#011F5B] mt-4">How to Request a Repair:</h4>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Call our support team at <a href="tel:+2348140838535" className="font-semibold text-[#011F5B]">+234 814 083 8535</a></li>
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
                  <li><strong>Return Window:</strong> Items must be reported for return within 1-2 weeks of delivery</li>
                  <li><strong>Pickup Deadline:</strong> We will only pick up items within this timeframe</li>
                  <li><strong>After Deadline:</strong> We will NOT collect items after 2 weeks from delivery</li>
                </ul>

                <h4 className="font-semibold text-[#011F5B] mt-4">Contacting Support:</h4>
                <div className="space-y-2 bg-gray-50 p-4 rounded mt-2">
                  <p><span className="font-semibold">Phone:</span> <a href="tel:+2348140838535" className="text-[#011F5B]">+234 814 083 8535</a></p>
                  <p><span className="font-semibold">Email:</span> <a href="mailto:support@timmyluxfurniture.com" className="text-[#011F5B]">support@timmyluxfurniture.com</a></p>
                  <p><span className="font-semibold">Hours:</span> Monday - Friday, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
