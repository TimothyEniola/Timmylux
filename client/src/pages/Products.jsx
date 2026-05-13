import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/Products";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useSearchParams } from "react-router-dom";
import { useSearchParams, Link } from "react-router-dom";

export default function Products() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    const searchMatch = query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.collection?.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  // Group products by collection
  const collections = filteredProducts.reduce((acc, product) => {
    if (!acc[product.collection]) {
      acc[product.collection] = [];
    }
    acc[product.collection].push(product);
    return acc;
  }, {});

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="section-heading">
            Our Premium Collections
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated collections with multiple design variations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]">
              Search collections
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Find your perfect style
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-auto lg:flex-row">
            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="w-full lg:w-80">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections, products..."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Collections Display */}
        {Object.keys(collections).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(collections).map(([collectionName, collectionProducts]) => (
              <div key={collectionName} className="collection-section">
                {/* Collection Header */}
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {collectionName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {collectionProducts.length} design{collectionProducts.length > 1 ? 's' : ''} available
                  </p>
                </div>

                {/* Collection Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {collectionProducts.map((product) => (
                    <div key={product.id} className="space-y-4">
                      {/* Main Product Card */}
                      <ProductCard
                        product={product}
                        showDiscount={product.featured}
                      />
                      
                      <Link 
                        to={`/product/${product.id}#variations`}
                        className="block w-full text-center py-2 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-[#011F5B] hover:bg-[#011F5B] hover:text-white hover:border-[#011F5B] transition-all"
                      >
                        {product.variations?.length > 0 ? "View Design Variations" : "View Details"}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No collections found</p>
            <p className="text-sm">
              {searchQuery && selectedCategory !== "All"
                ? `for "${searchQuery}" in ${selectedCategory}`
                : searchQuery
                ? `for "${searchQuery}"`
                : selectedCategory !== "All"
                ? `in ${selectedCategory}`
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}