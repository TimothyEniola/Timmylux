import { useMemo, useState } from "react";
import {
  Truck,
  CreditCard,
  ChevronDown,
  Tag,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notificationStore";
import useProductStore from "../store/productStore";
import useCurrentTime from "../hooks/useCurrentTime";
import { getProductPriceInfo } from "../utils/productPromotions";
import {
  isMadeToOrder,
  MADE_TO_ORDER_NOTICE,
} from "../utils/productAvailability";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { items, updateVariation, clearCart } = useCartStore();
  const products = useProductStore((state) => state.products);
  const { addNotification } = useNotificationStore();

  const hasTimedProducts = products.some((product) => product.promotion);
  const now = useCurrentTime(1000, hasTimedProducts);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("PAYSTACK");
  const [expandedVariations, setExpandedVariations] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync cart items with latest catalog pricing and variations
  const checkoutItems = useMemo(
    () =>
      items.map((item) => {
        const catalogProduct = products.find(
          (product) => String(product.id) === String(item.id),
        );
        if (!catalogProduct)
          return { ...item, isMadeToOrder: isMadeToOrder(item) };
        const selectedVariation =
          item.selectedVariation || catalogProduct.variations?.[0];
        const priceInfo = getProductPriceInfo(
          catalogProduct,
          selectedVariation,
          now,
        );
        return {
          ...item,
          price: priceInfo.price,
          isMadeToOrder: isMadeToOrder(catalogProduct),
        };
      }),
    [items, products, now],
  );

  const madeToOrderItems = useMemo(
    () => checkoutItems.filter((item) => item.isMadeToOrder),
    [checkoutItems],
  );

  const hasMadeToOrderItems = madeToOrderItems.length > 0;

  const total = useMemo(
    () =>
      checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [checkoutItems],
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

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await apiRequest(`/coupons/verify/${couponCode}`);
      setAppliedCoupon(response.data);
      toast.success(`Coupon applied successfully!`);
    } catch (error) {
      toast.error(error.message || "Invalid or expired coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your purchase");
      navigate("/signin", { state: { from: { pathname: "/checkout" } } });
      return false;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      toast.error("Please fill in all required delivery fields");
      return false;
    }
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // For MTO items, the backend overrides paymentMethod to CONTACT_TO_CONFIRM
    const method = hasMadeToOrderItems ? "CONTACT_TO_CONFIRM" : paymentMethod;

    setIsSubmitting(true);

    try {
      // Create the order via the backend API
      const response = await apiRequest("/orders", {
        method: "POST",
        body: {
          paymentMethod: method,
          couponCode: appliedCoupon?.code || undefined,
          shippingDetails: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            phone: formData.phone,
          },
        },
      });

      clearCart();

      // Handle response based on payment method and item types
      if (response.data?.madeToOrder) {
        setOrderConfirmation({
          orderId: response.data.order.id,
          hasMadeToOrderItems: true,
          message:
            "Our team will contact you to confirm build timelines before collecting payment.",
        });
        toast.success("Build request submitted successfully!");
      } else if (paymentMethod === "PAYSTACK" && response.data?.paymentUrl) {
        // Redirect user to Paystack checkout page
        window.location.href = response.data.paymentUrl;
      } else {
        // Bank Transfer / COD fallback
        setOrderConfirmation({
          orderId: response.data.order.id,
          hasMadeToOrderItems: false,
          message:
            "Please proceed with bank transfer to the details provided in your email.",
        });
        toast.success("Order placed successfully!");
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to process order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmation) {
    return (
      <div className="px-4 py-16 sm:py-20 min-h-[60vh] flex items-center justify-center bg-gray-50">
        <section className="mx-auto max-w-2xl w-full rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <CheckCircle2
            size={56}
            className="mx-auto mb-4 text-emerald-600"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold text-[#011F5B] sm:text-3xl">
            Request Received Successfully
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Your reference number is{" "}
            <span className="font-bold text-[#011F5B]">
              {orderConfirmation.orderId}
            </span>
          </p>

          {orderConfirmation.hasMadeToOrderItems && (
            <div
              role="status"
              className="mt-6 flex gap-3 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4 text-left text-sm leading-relaxed text-[#011F5B]"
            >
              <Clock3
                size={20}
                className="mt-0.5 shrink-0 text-[#D4AF37]"
                aria-hidden="true"
              />
              <p>
                <span className="font-bold">Made-to-order item(s):</span>{" "}
                {MADE_TO_ORDER_NOTICE}
              </p>
            </div>
          )}

          <p className="mt-6 text-sm leading-relaxed text-gray-600 bg-gray-50 p-4 rounded-lg">
            {orderConfirmation.message}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/orders"
              className="btn-primary flex-1 sm:flex-none justify-center"
            >
              View Order History
            </Link>
            <Link
              to="/products"
              className="btn-outline flex-1 sm:flex-none justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-5xl">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-2">
          Secure Checkout
        </h1>
        <p className="text-gray-500 mb-8">Complete your order details below</p>

        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 flex items-center justify-between">
            <span>You must be signed in to complete your purchase.</span>
            <Link
              to="/signin"
              state={{ from: { pathname: "/checkout" } }}
              className="font-bold underline hover:text-[#011F5B]"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {hasMadeToOrderItems && (
          <div
            role="status"
            className="mb-8 flex gap-3 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4 text-sm leading-relaxed text-[#011F5B]"
          >
            <Clock3
              size={20}
              className="mt-0.5 shrink-0 text-[#D4AF37]"
              aria-hidden="true"
            />
            <p>
              <span className="font-bold">
                Your order includes furniture made to order.
              </span>{" "}
              {MADE_TO_ORDER_NOTICE}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Checkout Form - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#011F5B] mb-6 border-b pb-4">
                1. Delivery Information
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-premium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-premium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-premium"
                    rows="2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-premium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-premium"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#011F5B] mb-6 border-b pb-4">
                2. Payment Method
              </h2>

              <div className="flex flex-col gap-4">
                <label
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 transition cursor-pointer ${paymentMethod === "PAYSTACK" && !hasMadeToOrderItems ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-200 hover:border-gray-300"} ${hasMadeToOrderItems ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYSTACK"
                    checked={paymentMethod === "PAYSTACK"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={hasMadeToOrderItems}
                    className="h-5 w-5 accent-[#D4AF37]"
                  />
                  <div className="flex flex-1 items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#011F5B]/10 flex items-center justify-center">
                      <CreditCard className="text-[#011F5B]" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Secure Online Payment
                      </p>
                      <p className="text-sm text-gray-500">
                        {hasMadeToOrderItems
                          ? "Paused for made-to-order items until timeline is confirmed."
                          : "Pay securely via Paystack with Card or Bank Transfer."}
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 transition cursor-pointer ${paymentMethod === "BANK_TRANSFER" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#D4AF37]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                      <Truck className="text-[#D4AF37]" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {hasMadeToOrderItems
                          ? "Submit Build Request"
                          : "Direct Bank Transfer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hasMadeToOrderItems
                          ? "We will contact you to confirm timeline and payment."
                          : "Make your payment directly into our bank account."}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting || items.length === 0}
                className="btn-primary w-full mt-8 py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </>
                ) : hasMadeToOrderItems ? (
                  "Submit Build Request"
                ) : (
                  `Pay ₦${finalTotal.toLocaleString()}`
                )}
              </button>
            </div>
          </div>

          {/* Order Summary - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#011F5B] mb-6 border-b pb-4">
                Order Summary
              </h2>

              {items.length > 0 ? (
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                  {checkoutItems.map((item) => {
                    const product = products.find((p) => p.id === item.id);
                    const hasVariations =
                      product?.variations && product.variations.length > 0;

                    return (
                      <div
                        key={item.cartItemId || item.id}
                        className="border-b border-gray-50 pb-4 space-y-3"
                      >
                        <div className="flex items-start gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || item.title}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {item.name || item.title || "Product"}
                            </p>
                            {item.color && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.color}
                              </p>
                            )}
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-gray-600">
                                Qty:{" "}
                                <span className="font-bold">
                                  {item.quantity}
                                </span>
                              </p>
                              <p className="font-bold text-[#011F5B] text-sm">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                            {item.isMadeToOrder && (
                              <span className="mt-2 inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-100">
                                <PackageCheck size={10} aria-hidden="true" />{" "}
                                Made to order
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Guest Variation Selector (Disabled if logged in as DB handles cart) */}
                        {hasVariations && !item.cartItemId && (
                          <div className="bg-gray-50 rounded-lg p-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedVariations({
                                  ...expandedVariations,
                                  [item.id]: !expandedVariations[item.id],
                                })
                              }
                              className="w-full flex items-center justify-between text-xs font-medium text-gray-600 hover:text-[#011F5B]"
                            >
                              <span>Change Variation</span>
                              <ChevronDown
                                size={14}
                                className={`transition-transform ${expandedVariations[item.id] ? "rotate-180" : ""}`}
                              />
                            </button>

                            {expandedVariations[item.id] && (
                              <div className="mt-2 space-y-1">
                                {product.variations.map((variation) => (
                                  <button
                                    key={variation.id}
                                    onClick={() => {
                                      updateVariation(item.id, variation);
                                      setExpandedVariations({
                                        ...expandedVariations,
                                        [item.id]: false,
                                      });
                                    }}
                                    className={`w-full flex items-center gap-2 p-1.5 rounded text-left text-xs border ${
                                      item.selectedVariation?.name ===
                                      variation.name
                                        ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#011F5B] font-semibold"
                                        : "bg-white border-transparent hover:border-gray-200 text-gray-600"
                                    }`}
                                  >
                                    <span className="truncate flex-1">
                                      {variation.name}
                                    </span>
                                    <span>
                                      ₦{variation.price.toLocaleString()}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Your cart is empty.
                </div>
              )}

              <div className="pt-4 space-y-4">
                {/* Coupon Section */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="text-[#D4AF37]" size={16} />
                    <span className="text-sm font-bold text-[#011F5B]">
                      Apply Coupon
                    </span>
                  </div>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-[#011F5B] text-white text-sm font-semibold rounded-lg hover:bg-[#0e2c5b] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-green-700 font-bold text-sm">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-green-600 text-xs font-medium">
                          {appliedCoupon.type === "percentage"
                            ? `${appliedCoupon.discount}%`
                            : `₦${appliedCoupon.discount}`}{" "}
                          off applied
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-white rounded shadow-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₦{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-gray-400 italic">
                      Calculated next
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                  <div>
                    <p className="text-lg font-bold text-[#011F5B]">Total</p>
                    <p className="text-xs text-gray-400">Including VAT</p>
                  </div>
                  <span className="text-2xl font-extrabold text-[#D4AF37]">
                    ₦{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
