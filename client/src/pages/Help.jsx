import { HelpCircle, ShieldCheck, Truck, CreditCard, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Help() {
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
                <p className="text-sm mt-1">Open a support request through the contact form or email our support team for return instructions.</p>
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
      </div>
    </div>
  );
}
