import { Star, Eye, EyeOff, Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, showDiscount = false, timerText, timerColor }) {
  // Calculate discount (mock - 10% for featured items)
  const discountPercentage = product.featured ? 10 : 0;
  const timerClassName = timerText
    ? `absolute bottom-3 left-3 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white ${timerColor || "bg-emerald-500"}`
    : "";

  return (
    <div className="card card-elevated group relative">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />

        {timerText && (
          <div className={timerClassName}>
            {timerText}
          </div>
        )}

        {showDiscount && discountPercentage > 0 && (
          <span className="discount-badge">{discountPercentage}% off</span>
        )}

        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button className="p-2 rounded-full bg-white text-gray-600 hover:text-red-500 shadow-lg transition-colors">
            <Heart size={16} fill="none" />
          </button>
          <button className="p-2 rounded-full bg-white text-gray-600 hover:text-[#D4AF37] shadow-lg transition-colors">
            <ShoppingCart size={16} />
          </button>
          <div
            className={`p-2 rounded-full shadow-lg ${
              product.available
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {product.available ? <Eye size={16} /> : <EyeOff size={16} />}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating and Price Section */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-sm font-semibold text-gray-900 ml-1">4.9</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[#D4AF37]">
              ₦{Number(product.price).toLocaleString()}
            </p>
          </div>
        </div>
        {!product.available && (
          <div className="mt-3 text-sm font-semibold text-red-600 uppercase tracking-[0.08em]">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
}