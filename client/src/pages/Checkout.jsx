import { useMemo, useState } from "react";
import { Truck, CreditCard, ChevronDown } from "lucide-react";
import useCartStore from "../store/cartStore";
import { products } from "../data/Products";

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const updateVariation = useCartStore((state) => state.updateVariation);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [expandedVariations, setExpandedVariations] = useState({});

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
              <div className="space-y-6">
                {items.map((item) => {
                  const product = products.find(p => p.id === item.id);
                  const hasVariations = product?.variations && product.variations.length > 0;
                  
                  return (
                    <div key={item.id} className="border-b pb-6 space-y-3">
                      {/* Product Image and Basic Info */}
                      <div className="flex items-start gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || item.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#011F5B]">
                            {item.name || item.title || "Product"}
                          </p>
                          {item.color && (
                            <p className="text-xs text-gray-500">
                              Selected: {item.color}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            Qty: <span className="font-semibold">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#D4AF37]">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₦{item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>

                      {/* Variation Selector */}
                      {hasVariations && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <button
                            type="button"
                            onClick={() => setExpandedVariations({
                              ...expandedVariations,
                              [item.id]: !expandedVariations[item.id]
                            })}
                            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-[#011F5B] transition-colors"
                          >
                            <span>Choose Collection Type</span>
                            <ChevronDown 
                              size={18} 
                              className={`transition-transform ${expandedVariations[item.id] ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {expandedVariations[item.id] && (
                            <div className="mt-3 space-y-2">
                              {product.variations.map((variation) => (
                                <button
                                  key={variation.id}
                                  onClick={() => {
                                    updateVariation(item.id, variation);
                                    setExpandedVariations({
                                      ...expandedVariations,
                                      [item.id]: false
                                    });
                                  }}
                                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm border transition-colors ${
                                    item.selectedVariation?.id === variation.id
                                      ? 'bg-[#D4AF37] border-[#D4AF37] text-white'
                                      : 'bg-white border-gray-200 hover:border-[#D4AF37] text-gray-700'
                                  }`}
                                >
                                  {variation.image && (
                                    <img
                                      src={variation.image}
                                      alt={variation.name}
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{variation.name}</p>
                                    <p className="text-xs opacity-75">
                                      {variation.color} • ₦{variation.price.toLocaleString()}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-4 space-y-2 border-t">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₦0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-[#011F5B]">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
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
