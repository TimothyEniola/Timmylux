import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, X, Info } from "lucide-react";
import PromotionFields from "../components/PromotionFields";
import useProductStore from "../store/productStore";
import { toDateTimeLocal, toIsoDateTime } from "../utils/productPromotions";
import { apiRequest } from "../utils/api";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const product = useProductStore((state) =>
    state.products.find((item) => String(item.id) === String(id)),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promotion, setPromotion] = useState(() => ({
    discountValue: product?.promotion?.discountValue
      ? String(product.promotion.discountValue)
      : "",
    startsAt: toDateTimeLocal(product?.promotion?.startsAt),
    endsAt: toDateTimeLocal(product?.promotion?.endsAt),
  }));

  const [formData, setFormData] = useState(() => {
    if (!product) return null;
    return {
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || "",
      collection: product.collection || "",
      description: product.description || "",
      featured: Boolean(product.featured),
      available: product.available !== false,
      variations: product.variations || [],
    };
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasPromotion = Object.values(promotion).some(Boolean);
    let featuredExpiry = null;

    if (hasPromotion) {
      const discountValue = Number(promotion.discountValue);
      const startsAt = toIsoDateTime(promotion.startsAt);
      const endsAt = toIsoDateTime(promotion.endsAt);

      if (
        !Number.isFinite(discountValue) ||
        discountValue <= 0 ||
        discountValue > 100 ||
        !startsAt ||
        !endsAt ||
        Date.parse(endsAt) <= Date.parse(startsAt)
      ) {
        toast.error(
          "Enter a valid discount percentage and ensure end time is after start time.",
        );
        setIsSubmitting(false);
        return;
      }
      featuredExpiry = endsAt;
    }

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        collection: formData.collection,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : null,
        description: formData.description,
        featured: formData.featured,
        available: formData.available,
        featuredExpiry:
          formData.featured && hasPromotion ? featuredExpiry : null,
      };

      await apiRequest(`/products/${id}`, {
        method: "PUT",
        body: payload,
      });

      await fetchProducts(); // Refresh the store with live DB data
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product || !formData) {
    return (
      <div className="container-custom py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          Product not found. Return to the product list and choose another item.
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">
            Edit Product
          </h1>
          <button
            onClick={() => navigate("/admin/products")}
            className="btn-outline flex items-center gap-2"
          >
            <X size={20} /> Cancel
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md space-y-6"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Dining">Dining</option>
                <option value="Office">Office</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Collection
              </label>
              <input
                type="text"
                name="collection"
                value={formData.collection}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Base Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Original Price (₦)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>

          <PromotionFields value={promotion} onChange={setPromotion} />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm">Featured Product</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm">Available for Purchase</span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Variations
              </h3>
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800 text-sm">
              <Info size={20} className="shrink-0 text-blue-600" />
              <p>
                Image uploads and variation configurations are permanently
                locked after initial product creation to ensure database
                integrity. To completely change this item, delete it and create
                a new product.
              </p>
            </div>

            <div className="space-y-4 opacity-75 pointer-events-none">
              {formData.variations.map((variation, index) => (
                <div
                  key={variation.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Variation {index + 1}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Variation Name
                      </label>
                      <input
                        type="text"
                        value={variation.name}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        value={variation.color || "N/A"}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Override Price
                      </label>
                      <input
                        type="text"
                        value={
                          variation.price
                            ? `₦${variation.price}`
                            : "Uses Base Price"
                        }
                        readOnly
                        className="w-full border p-2 rounded bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.variations.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No variations were attached to this product.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 text-white px-8 py-3 disabled:opacity-70"
            >
              <Save size={20} />{" "}
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
