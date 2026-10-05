import { memo } from "react";
import { Clock, Eye, EyeOff, Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useCurrentTime from "../hooks/useCurrentTime";
import { formatRemainingTime, getProductPriceInfo } from "../utils/productPromotions";

const ProductCard = memo(function ProductCard({ product, showDiscount = false }) {
  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const now = useCurrentTime(1000, Boolean(product?.promotion));

  const displayImage = product?.variations?.[0]?.image || product?.image;
  const priceInfo = getProductPriceInfo(product, product?.variations?.[0], now);
  const isPromotionActive = priceInfo.status === "active";
  const showPriceDiscount = isPromotionActive || (showDiscount && priceInfo.discountPercentage > 0);
  const originalPrice = isPromotionActive
    ? priceInfo.regularPrice
    : priceInfo.originalPrice;
  const discountPercentage = isPromotionActive
    ? priceInfo.discountPercentage
    : priceInfo.discountPercentage;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!product?.available) return;
    const cartProduct = {
      ...product,
      price: priceInfo.price,
      originalPrice: isPromotionActive ? priceInfo.regularPrice : product.originalPrice,
      image: displayImage,
      selectedVariation: product.variations?.[0] || null,
    };
    addToCart(cartProduct);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleWishlistToggle = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <article className="card card-elevated group relative">
      <div className="relative h-64 overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product?.name || "Furniture item"}
            className="product-image h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            Product image unavailable
          </div>
        )}

        {showPriceDiscount && (
          <span className="discount-badge" aria-label={`${discountPercentage}% off`}>
            {discountPercentage}% off
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`rounded-full p-2 shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--navy) ${
              wishlisted ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-red-500"
            }`}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product?.available}
            className="rounded-full bg-white p-2 text-gray-600 shadow-lg transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Add ${product.name} to cart`}
            title="Add to Cart"
          >
            <ShoppingCart size={16} aria-hidden="true" />
          </button>

          <span
            className={`rounded-full p-2 text-white shadow-lg ${
              product?.available ? "bg-green-600" : "bg-red-500"
            }`}
            aria-label={product?.available ? "In stock" : "Out of stock"}
          >
            {product?.available ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-1 text-sm text-gray-500">{product?.category}</p>
        <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900">
          {product?.name}
        </h3>

        <div className="mb-3 flex items-center gap-1" aria-label="Rated 4.9 out of 5">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={14} className="fill-primary text-primary" aria-hidden="true" />
          ))}
          <span className="ml-1 text-sm font-semibold text-gray-900">4.9</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-primary">
              ₦{Number(priceInfo.price).toLocaleString()}
            </p>
            {showPriceDiscount && originalPrice > priceInfo.price && (
              <p className="text-sm text-gray-400 line-through">
                ₦{Number(originalPrice).toLocaleString()}
              </p>
            )}
            {product?.variations?.length > 1 && (
              <p className="mt-1 text-xs text-gray-500">
                {product.variations.length} variations available
              </p>
            )}
          </div>
        </div>

        {showDiscount && isPromotionActive && priceInfo.endsAt && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-navy" aria-live="off">
            <Clock size={14} aria-hidden="true" />
            <span>Ends in {formatRemainingTime(priceInfo.endsAt - now)}</span>
          </p>
        )}

        {!product?.available && (
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-red-600">
            Out of Stock
          </p>
        )}
      </div>
    </article>
  );
});

export default ProductCard;
