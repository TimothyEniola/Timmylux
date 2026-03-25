import { useState } from "react";
import { CheckCircle, Truck } from "lucide-react";

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="section-heading mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#011F5B] mb-6">
              Delivery Information
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <textarea
                name="address"
                placeholder="Delivery Address *"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                rows="3"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  required
                />
              </div>

              {/* Payment Method (COD Only) */}
              <div className="flex items-center gap-3 p-4 border rounded-lg mt-4">
                <Truck className="text-[#D4AF37]" />
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">
                    Pay when you receive your order
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="btn-secondary w-full mt-6"
                disabled
              >
                Place Order (Disabled)
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-[#011F5B] mb-6">
              Order Summary
            </h2>

            <div className="text-center text-gray-500">
              No items in cart
            </div>

            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-[#D4AF37]">
                ₦0.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
