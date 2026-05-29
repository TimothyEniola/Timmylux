import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Star, StarOff, Clock } from "lucide-react";
import { products } from "../data/Products";

export default function AdminFeatured() {
  const [productsList, setProductsList] = useState(products);
  const [featuredDuration, setFeaturedDuration] = useState(3); // days

  useEffect(() => {
    // Load featured products from localStorage
    const savedFeatured = localStorage.getItem("featuredProducts");
    if (savedFeatured) {
      const featuredData = JSON.parse(savedFeatured);
      const now = Date.now();

      // Check for expired featured products
      const updatedProducts = products.map(product => {
        const featuredInfo = featuredData.find(f => f.id === product.id);
        if (featuredInfo && featuredInfo.expiryTime > now) {
          return { ...product, featured: true, featuredExpiry: featuredInfo.expiryTime };
        } else if (featuredInfo && featuredInfo.expiryTime <= now) {
          // Remove expired featured
          return { ...product, featured: false };
        }
        return product;
      });

      setProductsList(updatedProducts);

      // Clean up expired from localStorage
      const activeFeatured = featuredData.filter(f => f.expiryTime > now);
      localStorage.setItem("featuredProducts", JSON.stringify(activeFeatured));
    }

    // Set up interval to check for expired featured products every minute
    const interval = setInterval(() => {
      const savedFeatured = localStorage.getItem("featuredProducts");
      if (savedFeatured) {
        const featuredData = JSON.parse(savedFeatured);
        const now = Date.now();

        // Check for newly expired products
        const expiredIds = featuredData.filter(f => f.expiryTime <= now).map(f => f.id);
        
        if (expiredIds.length > 0) {
          // Update products list
          setProductsList(prev => prev.map(product => 
            expiredIds.includes(product.id) 
              ? { ...product, featured: false } 
              : product
          ));

          // Remove expired from localStorage
          const activeFeatured = featuredData.filter(f => f.expiryTime > now);
          localStorage.setItem("featuredProducts", JSON.stringify(activeFeatured));
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const toggleFeatured = (productId) => {
    const now = Date.now();
    const expiryTime = now + (featuredDuration * 24 * 60 * 60 * 1000); // Convert days to milliseconds

    setProductsList(prev => prev.map(product =>
      product.id === productId
        ? { ...product, featured: !product.featured, featuredExpiry: expiryTime }
        : product
    ));

    // Update localStorage
    const savedFeatured = JSON.parse(localStorage.getItem("featuredProducts") || "[]");
    if (productsList.find(p => p.id === productId)?.featured) {
      // Removing from featured
      const updated = savedFeatured.filter(f => f.id !== productId);
      localStorage.setItem("featuredProducts", JSON.stringify(updated));
    } else {
      // Adding to featured
      const newFeatured = { id: productId, expiryTime };
      const updated = [...savedFeatured, newFeatured];
      localStorage.setItem("featuredProducts", JSON.stringify(updated));
    }

    toast.success(`Product ${productsList.find(p => p.id === productId)?.featured ? 'removed from' : 'added to'} featured!`);
  };

  const getTimeRemaining = (expiryTime) => {
    const now = Date.now();
    const diff = expiryTime - now;
    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const featuredProducts = productsList.filter(product => product.featured);
  const regularProducts = productsList.filter(product => !product.featured);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B] mb-4">Manage Featured Products</h1>
        <p className="text-gray-600">Mark products as featured to highlight them on the homepage and product listings.</p>
      </div>

      {/* Featured Products Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-[#011F5B] mb-6 flex items-center gap-2">
          <Star className="text-[#D4AF37]" size={24} />
          Featured Products ({featuredProducts.length})
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Duration (days)</label>
          <select
            value={featuredDuration}
            onChange={(e) => setFeaturedDuration(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value={1}>1 day</option>
            <option value={2}>2 days</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-[#D4AF37]">
              <div className="relative">
                <img
                  src={product.variations?.[0]?.image || product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleFeatured(product.id)}
                    className="bg-[#D4AF37] text-white p-2 rounded-full hover:bg-[#B8952A] transition-colors"
                    title="Remove from featured"
                  >
                    <Star size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-[#D4AF37] text-white px-2 py-1 rounded text-xs font-semibold">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {getTimeRemaining(product.featuredExpiry)}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[#011F5B] mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.collection}</p>
                <p className="text-lg font-bold text-[#D4AF37]">₦{Number(product.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {featuredProducts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <StarOff className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No featured products yet.</p>
            <p className="text-gray-400 text-sm">Select products below to feature them.</p>
          </div>
        )}
      </div>

      {/* Regular Products Section */}
      <div>
        <h2 className="text-xl font-semibold text-[#011F5B] mb-6">All Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.variations?.[0]?.image || product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleFeatured(product.id)}
                    className="bg-white text-gray-600 p-2 rounded-full hover:text-[#D4AF37] hover:bg-gray-50 transition-colors shadow-lg"
                    title="Add to featured"
                  >
                    <StarOff size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[#011F5B] mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.collection}</p>
                <p className="text-lg font-bold text-[#D4AF37]">₦{Number(product.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {regularProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">All products are currently featured!</p>
          </div>
        )}
      </div>
    </div>
  );
}