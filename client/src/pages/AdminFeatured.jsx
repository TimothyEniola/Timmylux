import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { products } from "../data/Products";

export default function AdminFeatured() {
  const [productsList, setProductsList] = useState(products);

  const toggleFeatured = (productId) => {
    setProductsList(prev => prev.map(product =>
      product.id === productId
        ? { ...product, featured: !product.featured }
        : product
    ));
    alert("Product featured status updated!");
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