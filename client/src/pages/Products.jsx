import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/Products";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="section-heading">
            Our Premium Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our exquisite range of luxury furniture
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">
              Search products
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Find what you need quickly
            </h2>
          </div>
          <div className="w-full md:w-1/3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search furniture, categories, or rooms"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDiscount={product.featured} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
              No products found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}