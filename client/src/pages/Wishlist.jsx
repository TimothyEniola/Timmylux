import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";

export default function Wishlist() {
  const { items = [], removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product) => {
    addItem(product);

    // OPTIONAL: remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  if (!items || items.length === 0) {
    return (
      <div className="py-20 bg-gray-50 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-6" />

          <h2 className="text-2xl font-bold text-[#011F5B] mb-2">
            Your Wishlist is Empty
          </h2>

          <p className="text-gray-500 mb-6">
            Save items you love to buy later.
          </p>

          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-[#011F5B] mb-8">
          My Wishlist
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="card card-elevated group relative"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* DELETE BUTTON */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* DETAILS */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">
                  {product.category}
                </p>

                <h3 className="font-bold text-[#011F5B] mb-2 truncate">
                  {product.name}
                </h3>

                <p className="text-lg font-bold text-[#D4AF37] mb-4">
                  ₦{Number(product.price).toLocaleString()}
                </p>

                {/* ADD TO CART */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full btn-outline flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37]"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}