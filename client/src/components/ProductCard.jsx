import { Star, Eye, EyeOff, Heart, ShoppingCart } from "lucide-react";
import { memo, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

const ProductCard = memo(function ProductCard({
  product,
  showDiscount = false,
  timerText,
  timerColor,
  showCardTimer = false,
}) {
  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  // For card timer
  const [cardCountdown, setCardCountdown] = useState("07:00:00");
  const [cardTimerColor, setCardTimerColor] = useState("bg-emerald-500");
  const saleEndTimeRef = useRef(Date.now() + 7 * 60 * 60 * 1000);

  // Set up timer for this card if showCardTimer is true
  useEffect(() => {
    if (!showCardTimer) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = saleEndTimeRef.current - now;
      
      if (diff <= 0) {
        setCardCountdown("00:00:00");
        setCardTimerColor("bg-red-500");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const nextCountdown = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      
      setCardCountdown(nextCountdown);
      
      const newColor = diff <= 6 * 60 * 60 * 1000 ? "bg-red-500" : "bg-emerald-500";
      setCardTimerColor(prev => prev !== newColor ? newColor : prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [showCardTimer]);

  // Use first variation image if available
  const displayImage = product?.variations?.[0]?.image || product?.image;
  const displayPrice = product?.variations?.[0]?.price || product?.price;
  const originalPrice = product?.originalPrice || null;

  // ✅ Calculate discount safely
  const discountPercentage =
    originalPrice && displayPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  const timerClassName = (showCardTimer ? cardCountdown : timerText)
    ? `absolute bottom-3 left-3 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white ${
        showCardTimer ? cardTimerColor : (timerColor || "bg-emerald-500")
      }`
    : "";

  const displayTimerText = showCardTimer 
    ? (cardCountdown === "00:00:00" ? "Sale ended" : `Ends in ${cardCountdown}`)
    : timerText;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.error(`${product.name} removed from wishlist.`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="card card-elevated group relative">
      <div className="relative overflow-hidden h-64">
        <img
          src={displayImage}
          alt={product?.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />

        {displayTimerText && <div className={timerClassName}>{displayTimerText}</div>}

        {/* ✅ Discount Badge */}
        {showDiscount && discountPercentage > 0 && (
          <span className="discount-badge">
            {discountPercentage}% off
          </span>
        )}

        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              isInWishlist(product.id)
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:text-red-500"
            }`}
            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-white text-gray-600 hover:text-[#D4AF37] shadow-lg transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>

          <div
            className={`p-2 rounded-full shadow-lg ${
              product?.available
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {product?.available ? <Eye size={16} /> : <EyeOff size={16} />}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product?.category}</p>

        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
          {product?.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-sm font-semibold text-gray-900 ml-1">
            4.9
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[#D4AF37]">
              ₦{Number(displayPrice || 0).toLocaleString()}
            </p>

            {originalPrice && discountPercentage > 0 && (
              <p className="text-sm text-gray-400 line-through">
                ₦{Number(originalPrice).toLocaleString()}
              </p>
            )}

            {product?.variations?.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                {product.variations.length} variations available
              </p>
            )}
          </div>
        </div>

        {!product?.available && (
          <div className="mt-3 text-sm font-semibold text-red-600 uppercase tracking-[0.08em]">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductCard;
