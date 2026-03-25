import { Link } from "react-router-dom";
import { MessageSquare, User, Mail, Phone, Home, CheckCircle } from "lucide-react";

export default function CustomRequest() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Custom Furniture Request
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Let us create custom furniture
              tailored to your specific needs and space requirements.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      placeholder="+234 123 456 7890"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      className="input-field pl-10 appearance-none"
                      required
                    >
                      <option value="">Select room type</option>
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Dining Room">Dining Room</option>
                      <option value="Office">Office</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your delivery address"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe Your Custom Furniture Needs *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    placeholder="Tell us about the furniture you need, dimensions, style preferences, materials, colors, or any special requirements..."
                    className="input-field pl-10 min-h-[150px] resize-y"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Be as detailed as possible to help us understand your requirements better
                </p>
              </div>

              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-4">
                <h3 className="font-semibold text-[#D4AF37] mb-2">What Happens Next?</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Our team will review your request within 24 hours</li>
                  <li>• We'll contact you to discuss design details and measurements</li>
                  <li>• You'll receive a custom quote and 3D preview</li>
                  <li>• Upon approval, we'll start crafting your furniture</li>
                </ul>
              </div>

              <button type="submit" className="btn-primary w-full text-center">
                Submit Custom Request
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4AF37] text-white rounded-full mb-3">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Consultation</h3>
              <p className="text-sm text-gray-600">
                Discuss your vision with our expert designers
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4AF37] text-white rounded-full mb-3">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Design</h3>
              <p className="text-sm text-gray-600">
                Get a personalized design that fits your space
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4AF37] text-white rounded-full mb-3">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Craftsmanship</h3>
              <p className="text-sm text-gray-600">
                Handcrafted with premium materials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
