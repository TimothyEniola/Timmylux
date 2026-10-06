import { useMemo, useState } from "react";
import {
  Truck,
  CreditCard,
  ChevronDown,
  Tag,
  CheckCircle2,
  Clock3,
  PackageCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import useNotificationStore from "../store/notificationStore";
import useProductStore from "../store/productStore";
import useCurrentTime from "../hooks/useCurrentTime";
import { getProductPriceInfo } from "../utils/productPromotions";
import { isMadeToOrder, MADE_TO_ORDER_NOTICE } from "../utils/productAvailability";
import { readStoredArray } from "../utils/storage";
import { Link } from "react-router-dom";

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const products = useProductStore((state) => state.products);
  const hasTimedProducts = products.some((product) => product.promotion);
  const now = useCurrentTime(1000, hasTimedProducts);
  const checkoutItems = useMemo(() => items.map((item) => {
    const catalogProduct = products.find((product) => String(product.id) === String(item.id));
    if (!catalogProduct) return { ...item, isMadeToOrder: isMadeToOrder(item) };
    const selectedVariation = item.selectedVariation || catalogProduct.variations?.[0];
    const priceInfo = getProductPriceInfo(catalogProduct, selectedVariation, now);
    return {
      ...item,
      price: priceInfo.price,
      isMadeToOrder: isMadeToOrder(catalogProduct),
    };
  }), [items, products, now]);
  const updateVariation = useCartStore((state) => state.updateVariation);
  const clearCart = useCartStore((state) => state.clearCart);
  const { addNotification } = useNotificationStore();
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons] = useState(() => readStoredArray("adminCoupons"));

  const madeToOrderItems = useMemo(
    () => checkoutItems.filter((item) => item.isMadeToOrder),
    [checkoutItems]
  );
  const hasMadeToOrderItems = madeToOrderItems.length > 0;
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const total = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [checkoutItems]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return (total * appliedCoupon.discount) / 100;
    } else {
      return Math.min(appliedCoupon.discount, total);
    }
  }, [appliedCoupon, total]);

  const finalTotal = total - discount;

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase() && c.active);
    
    if (!coupon) {
      toast.error("Invalid or inactive coupon code");
      return;
    }

    const expiryDate = new Date(coupon.expiryDate);
    const now = new Date();
    
    if (expiryDate < now) {
      toast.error("This coupon has expired");
      return;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied! ${coupon.type === "percentage" ? coupon.discount + "%" : "₦" + coupon.discount} discount`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!formData.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    return true;
  };

  const resetCheckoutForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
    });
    setPaymentMethod("cod");
    setCouponCode("");
    setAppliedCoupon(null);
  };

  const finishOrder = (message) => {
    const orderId = `TML-${Date.now()}`;
    const orderItems = checkoutItems.map((item) => ({
      name: item.name || item.title || "Furniture item",
      quantity: item.quantity,
      price: Number(item.price),
      isMadeToOrder: Boolean(item.isMadeToOrder),
    }));
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      total: finalTotal,
      status: "Pending",
      paymentMethod: hasMadeToOrderItems ? "CONTACT_TO_CONFIRM" : paymentMethod,
      isMadeToOrder: orderItems.some((item) => item.isMadeToOrder),
      items: orderItems,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
      },
    };
    const madeToOrderNames = orderItems
      .filter((item) => item.isMadeToOrder)
      .map((item) => `${item.name} (x${item.quantity})`);

    try {
      const savedOrders = readStoredArray("adminOrders");
      window.localStorage.setItem("adminOrders", JSON.stringify([order, ...savedOrders]));
    } catch (error) {
      console.warn("Unable to save this demo order on this device:", error);
    }

    addNotification({
      title: order.isMadeToOrder ? "Made-to-order request received" : "New Order Placed",
      message: `${formData.fullName} placed an order for ₦${finalTotal.toLocaleString()} via ${paymentMethod}. ${orderItems.length} item(s), delivering to ${formData.city}, ${formData.state}.${madeToOrderNames.length ? ` Please contact the customer to confirm the build timeline for: ${madeToOrderNames.join(", ")}.` : ""}`,
      type: "order",
    });

    clearCart();
    resetCheckoutForm();
    setOrderConfirmation({ orderId, hasMadeToOrderItems: madeToOrderNames.length > 0, message });
    toast.success("Your order request has been received.");
  };

  const handlePaystack = (e) => {
    e.preventDefault();
    if (hasMadeToOrderItems) {
      toast.info("Online payment is unavailable for made-to-order requests until the build timeline is confirmed.");
      return;
    }
    if (!validateForm()) return;

    finishOrder("Paystack is currently in demo mode; no payment was charged.");
  };

  const handleCodOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    finishOrder("Your Cash on Delivery order request has been saved.");
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

  if (orderConfirmation) {
    return (
      <div className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-700" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Order request received</h1>
          <p className="mt-3 text-gray-600">Your order reference is <span className="font-semibold text-navy">{orderConfirmation.orderId}</span>.</p>
          {orderConfirmation.hasMadeToOrderItems && (
            <div role="status" className="mt-6 flex gap-3 rounded-xl border border-primary/40 bg-[#F7F6F1] p-4 text-left text-sm leading-relaxed text-navy">
              <Clock3 size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <p><span className="font-bold">Made-to-order item(s):</span> {MADE_TO_ORDER_NOTICE}</p>
            </div>
          )}
          <p className="mt-5 text-sm leading-relaxed text-gray-600">
            {orderConfirmation.hasMadeToOrderItems
              ? "Our team will use the contact details you provided to confirm the estimated build schedule and next steps."
              : "We’ll follow up using the contact details you provided with your order update."}
          </p>
          {orderConfirmation.message && (
            <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">{orderConfirmation.message}</p>
          )}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/products" className="btn-primary">Continue shopping</Link>
            <Link to="/" className="rounded-lg border border-navy/20 px-6 py-3 font-semibold text-navy transition hover:bg-gray-50">Back to home</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="section-heading mb-4">Checkout</h1>
        {hasMadeToOrderItems && (
          <div role="status" className="mb-8 flex gap-3 rounded-xl border border-primary/40 bg-[#F7F6F1] p-4 text-sm leading-relaxed text-navy">
            <Clock3 size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <p><span className="font-bold">Your order includes furniture made to order.</span> {MADE_TO_ORDER_NOTICE}</p>
          </div>
        )}

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
                      <p className="font-semibold">{hasMadeToOrderItems ? "Submit build request" : "Cash on Delivery"}</p>
                      <p className="text-sm text-gray-600">
                        {hasMadeToOrderItems
                          ? "Our team will confirm the build schedule and payment steps with you."
                          : "Pay when you receive your order."}
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 rounded-lg border p-4 transition ${hasMadeToOrderItems ? "cursor-not-allowed bg-gray-50 opacity-70" : "cursor-pointer hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={hasMadeToOrderItems}
                    className="h-4 w-4"
                  />
                  <div className="flex flex-1 items-center gap-3">
                    <CreditCard className="text-[#D4AF37]" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">Pay with Paystack</p>
                      <p className="text-sm text-gray-600">
                        {hasMadeToOrderItems
                          ? "Online payment is paused until we confirm the build schedule with you."
                          : "Secure payment with Paystack (frontend demo only)."}
                      </p>
                    </div>
                  </div>
                </label>

                <button
                  type="submit"
                  onClick={handleContinuePayment}
                  className="btn-primary w-full mt-4 text-white font-semibold"
                >
                  {hasMadeToOrderItems ? "Send build request" : "Continue with Payment"}
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
                {checkoutItems.map((item) => {
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
                          {item.isMadeToOrder && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                              <PackageCheck size={13} aria-hidden="true" /> Made to order
                            </span>
                          )}
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
                  {/* Coupon Section */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="text-[#D4AF37]" size={16} />
                      <span className="text-sm font-medium text-gray-700">Have a coupon?</span>
                    </div>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-4 py-2 bg-[#D4AF37] text-white text-sm font-medium rounded-md hover:bg-[#011F5B] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium text-sm">{appliedCoupon.code}</span>
                          <span className="text-green-600 text-xs">
                            ({appliedCoupon.type === "percentage" ? appliedCoupon.discount + "%" : "₦" + appliedCoupon.discount} off)
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₦{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₦0.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-[#011F5B]">
                    <span>Total</span>
                    <span>₦{finalTotal.toLocaleString()}</span>
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
