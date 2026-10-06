import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock3, PackageCheck, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import useProductStore from "../store/productStore";
import useCurrentTime from "../hooks/useCurrentTime";
import { getProductPriceInfo } from "../utils/productPromotions";
import { isMadeToOrder, MADE_TO_ORDER_NOTICE } from "../utils/productAvailability";

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const products = useProductStore((state) => state.products);
  const hasTimedProducts = products.some((product) => product.promotion);
  const now = useCurrentTime(1000, hasTimedProducts);
  const cartItems = useMemo(() => items.map((item) => {
    const product = products.find((entry) => String(entry.id) === String(item.id));
    if (!product) return { ...item, isMadeToOrder: isMadeToOrder(item) };
    const selectedVariation = item.selectedVariation || product.variations?.[0];
    const priceInfo = getProductPriceInfo(product, selectedVariation, now);
    return { ...item, price: priceInfo.price, isMadeToOrder: isMadeToOrder(product) };
  }), [items, products, now]);
  const hasMadeToOrderItems = cartItems.some((item) => item.isMadeToOrder);
  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cartItems]
  );

  const handleRemoveItem = (item) => {
    removeItem(item.id);
    toast.error(`${item.name} removed from cart.`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleUpdateQuantity = (item, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(item);
    } else {
      updateQuantity(item.id, newQty);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16 sm:py-20 px-4">
        <div className="container-custom text-center">
          <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some beautiful furniture to get started!
          </p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-0">
      <div className="container-custom">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-4">
          Shopping Cart
        </h1>
        {hasMadeToOrderItems && (
          <div role="status" className="mb-8 flex gap-3 rounded-xl border border-primary/40 bg-[#F7F6F1] p-4 text-sm leading-relaxed text-navy">
            <Clock3 className="mt-0.5 shrink-0 text-primary" size={20} aria-hidden="true" />
            <p><span className="font-bold">Some items are made to order.</span> {MADE_TO_ORDER_NOTICE}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <img  
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#011F5B] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.category}
                  </p>
                  {item.isMadeToOrder && (
                    <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                      <PackageCheck size={14} aria-hidden="true" /> Made to order · timeline to be confirmed
                    </p>
                  )}
                  <p className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-3">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  {/* Quantity + Delete */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-4 font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500 hover:text-red-700 transition p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex sm:block justify-between items-center sm:text-right">
                  <p className="text-sm text-gray-500 sm:mb-1">
                    Subtotal
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-[#011F5B]">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#011F5B] mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">
                    Free
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full block text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block text-center mt-4 text-[#011F5B] hover:text-[#D4AF37] transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
