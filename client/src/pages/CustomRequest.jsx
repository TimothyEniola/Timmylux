import { Link } from "react-router-dom";
import { MessageSquare, User, Mail, Phone, Home } from "lucide-react";

export default function CustomRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#D4AF37]/5 py-12">
      <div className="container-custom px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Custom Furniture Request
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Can't find what you're looking for? Let us create custom furniture
              tailored to your specific needs and space requirements.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-[#D4AF37]/10 p-6 md:p-10 transition-all duration-300 hover:shadow-2xl">
            <form className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 pl-10 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 pl-10 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
                    <input
                      type="tel"
                      placeholder="+234 123 456 7890"
                      className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 pl-10 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
                    <select
                      className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 pl-10 appearance-none outline-none transition"
                      required
                    >
                      <option value="">Select room type</option>
                      <option>Living Room</option>
                      <option>Bedroom</option>
                      <option>Dining Room</option>
                      <option>Office</option>
                      <option>Kitchen</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Request Topic *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
                    <select
                      className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 pl-10 appearance-none outline-none transition"
                      required
                    >
                      <option value="">Select request topic</option>
                      <option>Custom Furniture Request</option>
                      <option>How do I return an item?</option>
                      <option>Order Status / Tracking</option>
                      <option>Other Support</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your delivery address"
                  className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 outline-none transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe Your Custom Furniture Needs *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-[#D4AF37]" size={20} />
                  <textarea
                    placeholder="Tell us about the furniture you need, dimensions, style preferences, materials, colors..."
                    className="w-full border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 rounded-xl p-3 pl-10 min-h-[150px] resize-y outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-2xl p-5">
                <h3 className="font-semibold text-[#D4AF37] mb-3 text-lg">
                  What Happens Next?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✔ Our team will review your request within 24 hours</li>
                  <li>✔ We'll contact you to discuss design details</li>
                  <li>✔ You'll receive a custom quote and 3D preview</li>
                  <li>✔ Upon approval, we begin production</li>
                </ul>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[#D4AF37] hover:bg-[#b9962e] text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                Submit Custom Request
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="bg-white rounded-2xl border border-[#D4AF37]/10 shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4AF37] text-white rounded-full mb-4 shadow-md">
                  <span className="font-bold text-lg">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {step === 1 && "Free Consultation"}
                  {step === 2 && "Custom Design"}
                  {step === 3 && "Expert Craftsmanship"}
                </h3>
                <p className="text-sm text-gray-600">
                  {step === 1 && "Discuss your vision with our expert designers"}
                  {step === 2 && "Get a personalized design that fits your space"}
                  {step === 3 && "Handcrafted with premium materials"}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}