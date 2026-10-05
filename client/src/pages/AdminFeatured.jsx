import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Clock, Star, StarOff } from "lucide-react";
import useProductStore from "../store/productStore";
import useCurrentTime from "../hooks/useCurrentTime";
import { formatRemainingTime } from "../utils/productPromotions";

const getFeaturedExpiry = (durationDays) => Date.now() + durationDays * 24 * 60 * 60 * 1000;

export default function AdminFeatured() {
  const products = useProductStore((state) => state.products);
  const setFeatured = useProductStore((state) => state.setFeatured);
  const [featuredDuration, setFeaturedDuration] = useState(3);
  const now = useCurrentTime(1000);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured && (!product.featuredExpiry || Number(product.featuredExpiry) > now)),
    [products, now]
  );
  const regularProducts = useMemo(
    () => products.filter((product) => !featuredProducts.some((featured) => String(featured.id) === String(product.id))),
    [products, featuredProducts]
  );

  const toggleFeatured = (product) => {
    const isFeatured = featuredProducts.some((item) => String(item.id) === String(product.id));
    setFeatured(product.id, !isFeatured, isFeatured ? null : getFeaturedExpiry(featuredDuration));
    toast.success(isFeatured ? "Product removed from featured." : "Product added to featured.");
  };

  const getRemainingLabel = (expiryTime) => {
    if (!expiryTime) return "Always featured";
    return formatRemainingTime(Number(expiryTime) - now);
  };

  const ProductTile = ({ product, featured = false }) => (
    <article key={product.id} className={`overflow-hidden rounded-xl border bg-white ${featured ? "border-primary" : "border-gray-200"}`}>
      <div className="relative">
        <img
          src={product.variations?.[0]?.image || product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute left-3 top-3 rounded bg-navy px-2 py-1 text-xs font-semibold text-white">
          {featured ? "Featured" : product.category}
        </div>
        {featured && product.featuredExpiry && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
            <Clock size={12} aria-hidden="true" /> {getRemainingLabel(product.featuredExpiry)}
          </div>
        )}
        <button
          type="button"
          onClick={() => toggleFeatured(product)}
          className={`absolute right-3 top-3 rounded-full p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${featured ? "bg-primary text-navy hover:bg-primary/90" : "bg-white text-gray-600 hover:text-primary"}`}
          title={featured ? "Remove from featured" : "Add to featured"}
          aria-label={featured ? `Remove ${product.name} from featured` : `Feature ${product.name}`}
        >
          {featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-navy">{product.name}</h3>
        <p className="mb-2 text-sm text-gray-600">{product.collection}</p>
        <p className="font-bold text-primary">₦{Number(product.price).toLocaleString()}</p>
      </div>
    </article>
  );

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-navy sm:text-3xl">Manage Featured Products</h1>
        <p className="text-gray-600">Choose products to highlight on the homepage and set how long each feature stays visible.</p>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <label htmlFor="featuredDuration" className="text-sm font-medium text-gray-700">Featured duration</label>
        <select
          id="featuredDuration"
          value={featuredDuration}
          onChange={(event) => setFeaturedDuration(Number(event.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value={1}>1 day</option>
          <option value={2}>2 days</option>
          <option value={3}>3 days</option>
          <option value={7}>7 days</option>
        </select>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-navy">
          <Star className="text-primary" size={22} /> Featured Products ({featuredProducts.length})
        </h2>
        {featuredProducts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => <ProductTile key={product.id} product={product} featured />)}
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 py-12 text-center">
            <StarOff className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-gray-600">No featured products yet. Select products below to feature them.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-navy">All Products</h2>
        {regularProducts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularProducts.map((product) => <ProductTile key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">All products are currently featured.</p>
        )}
      </section>
    </div>
  );
}
