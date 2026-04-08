import { Link } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import useCartStore from "../store/cartStore";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
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
                  <p className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-3">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  {/* Quantity + Delete */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-4 font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
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
                    ₦{getTotal().toLocaleString()}
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
                    ₦{getTotal().toLocaleString()}
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