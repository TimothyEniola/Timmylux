import { useMemo, useState } from "react";
import { Truck, CreditCard } from "lucide-react";
import useCartStore from "../store/cartStore";

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state) {
      alert("Please complete all required delivery fields before continuing.");
      return false;
    }
    if (items.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return false;
    }
    return true;
  };

  const handlePaystack = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    alert(`Paystack checkout simulated for ₦${total.toFixed(2)}. This is a frontend-only demo.`);
  };

  const handleCodOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    alert("Cash on Delivery order placed successfully! This is a frontend-only demo.");
  };

  const handleContinuePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === "paystack") {
      handlePaystack(e);
    } else {
      handleCodOrder(e);
    }
  };

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

              <div className="flex flex-col gap-4 mt-4">
                <h3 className="font-semibold text-[#011F5B] mb-2">Payment Method</h3>
                
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <Truck className="text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">
                        Pay when you receive your order.
                      </p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <CreditCard className="text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold">Pay with Paystack</p>
                      <p className="text-sm text-gray-600">
                        Secure payment with Paystack (frontend demo only).
                      </p>
                    </div>
                  </div>
                </label>

                <button
                  type="submit"
                  onClick={handleContinuePayment}
                  className="btn-primary w-full mt-4 text-white font-semibold"
                >
                  Continue with Payment
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-[#011F5B] mb-6">
              Order Summary
            </h2>

            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || item.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#011F5B] truncate">
                        {item.name || item.title || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#D4AF37]">
                        ₦{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₦{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₦0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-[#011F5B]">
                    <span>Total</span>
                    <span>₦{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No items in cart. Add products to see your order summary.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
