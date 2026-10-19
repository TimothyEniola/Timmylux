import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Clock, Star, StarOff, Loader2 } from "lucide-react";
import useProductStore from "../store/productStore";
import useCurrentTime from "../hooks/useCurrentTime";
import { formatRemainingTime } from "../utils/productPromotions";
import { apiRequest } from "../utils/api";

const getFeaturedExpiry = (durationDays) =>
  Date.now() + durationDays * 24 * 60 * 60 * 1000;

export default function AdminFeatured() {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const [featuredDuration, setFeaturedDuration] = useState(3);
  const [processingId, setProcessingId] = useState(null);
  const now = useCurrentTime(1000);

  const featuredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.featured &&
          (!product.featuredExpiry || Number(product.featuredExpiry) > now),
      ),
    [products, now],
  );

  const regularProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          !featuredProducts.some(
            (featured) => String(featured.id) === String(product.id),
          ),
      ),
    [products, featuredProducts],
  );

  const toggleFeatured = async (product) => {
    const isFeatured = featuredProducts.some(
      (item) => String(item.id) === String(product.id),
    );
    const expiry = isFeatured ? null : getFeaturedExpiry(featuredDuration);

    setProcessingId(product.id);
    try {
      await apiRequest(`/products/${product.id}`, {
        method: "PUT",
        body: {
          featured: !isFeatured,
          featuredExpiry: expiry ? new Date(expiry).toISOString() : null,
        },
      });

      await fetchProducts(); // Sync live store
      toast.success(
        isFeatured ? "Removed from featured." : "Added to featured.",
      );
    } catch (error) {
      toast.error("Failed to update featured status");
    } finally {
      setProcessingId(null);
    }
  };

  const getRemainingLabel = (expiryTime) => {
    if (!expiryTime) return "Always featured";
    return formatRemainingTime(Number(expiryTime) - now);
  };

  const ProductTile = ({ product, featured = false }) => (
    <article
      key={product.id}
      className={`overflow-hidden rounded-xl border bg-white ${featured ? "border-[#D4AF37]" : "border-gray-200"}`}
    >
      <div className="relative">
        <img
          src={
            product.variations?.[0]?.image ||
            product.image?.[0] ||
            product.image
          }
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute left-3 top-3 rounded bg-[#011F5B] px-2 py-1 text-xs font-semibold text-white">
          {featured ? "Featured" : product.category}
        </div>
        {featured && product.featuredExpiry && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
            <Clock size={12} aria-hidden="true" />{" "}
            {getRemainingLabel(product.featuredExpiry)}
          </div>
        )}
        <button
          type="button"
          onClick={() => toggleFeatured(product)}
          disabled={processingId === product.id}
          className={`absolute right-3 top-3 rounded-full p-2 transition-colors ${featured ? "bg-[#D4AF37] text-[#011F5B] hover:bg-[#b8942a]" : "bg-white text-gray-600 hover:text-[#D4AF37]"} disabled:opacity-50`}
        >
          {processingId === product.id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : featured ? (
            <Star size={16} fill="currentColor" />
          ) : (
            <StarOff size={16} />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-[#011F5B]">{product.name}</h3>
        <p className="font-bold text-[#D4AF37]">
          ₦{Number(product.price).toLocaleString()}
        </p>
      </div>
    </article>
  );

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-[#011F5B] sm:text-3xl">
          Manage Featured Products
        </h1>
        <p className="text-gray-600">
          Choose products to highlight on the homepage and set how long each
          feature stays visible.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <label
          htmlFor="featuredDuration"
          className="text-sm font-medium text-gray-700"
        >
          Featured duration
        </label>
        <select
          id="featuredDuration"
          value={featuredDuration}
          onChange={(e) => setFeaturedDuration(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value={1}>1 day</option>
          <option value={2}>2 days</option>
          <option value={3}>3 days</option>
          <option value={7}>7 days</option>
        </select>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-[#011F5B]">
          <Star className="text-[#D4AF37]" size={22} /> Featured Products (
          {featuredProducts.length})
        </h2>
        {featuredProducts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <ProductTile key={p.id} product={p} featured />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-gray-200 py-12 text-center text-gray-500">
            No featured products yet. Click a star below to highlight a product.
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-[#011F5B]">
          All Products
        </h2>
        {regularProducts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularProducts.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">
            All products are currently featured.
          </p>
        )}
      </section>
    </div>
  );
}
