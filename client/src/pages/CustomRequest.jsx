import { useState } from "react";
import {
  MessageSquare,
  User,
  Mail,
  Phone,
  Home,
  CheckCircle,
} from "lucide-react";

export default function CustomRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomType: "",
    topic: "",
    address: "",
    description: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.description
    ) {
      localStorage.setItem(
        `customRequest_${Date.now()}`,
        JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        })
      );

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          roomType: "",
          topic: "",
          address: "",
          description: "",
          budget: "",
        });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#D4AF37]/5 py-12">
      <div className="container-custom px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Custom Furniture Request
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Let us create custom furniture
              tailored to your needs.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Request Submitted!
                </h2>
                <p className="text-gray-600">
                  We'll contact you within 24–48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Room Type */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Room Type
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 text-[#D4AF37]" />
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                      >
                        <option value="">Select</option>
                        <option>Living Room</option>
                        <option>Bedroom</option>
                        <option>Dining Room</option>
                        <option>Office</option>
                      </select>
                    </div>
                  </div>

                  {/* Topic (full width) */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold">
                      Request Topic
                    </label>
                    <select
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-xl"
                    >
                      <option value="">Select</option>
                      <option>Custom Furniture</option>
                      <option>Order Tracking</option>
                      <option>Returns</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full p-3 border rounded-xl"
                />

                {/* Description */}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your request..."
                  className="w-full p-3 border rounded-xl min-h-[120px]"
                  required
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-white py-3 rounded-xl"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}