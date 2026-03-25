import ProductCard from "../components/ProductCard";
import { products } from "../data/Products";

export default function Products() {
  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-heading">
            Our Premium Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our exquisite range of luxury furniture
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}