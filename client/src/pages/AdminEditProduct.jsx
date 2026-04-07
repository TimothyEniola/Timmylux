import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Save, X, Plus, Trash2 } from "lucide-react";
import { products } from "../data/Products";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    collection: "",
    description: "",
    featured: false,
    available: true,
    variations: []
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        collection: product.collection || "",
        description: product.description || "",
        featured: product.featured || false,
        available: product.available !== false,
        variations: product.variations || []
      });
      setImagePreview(product.variations?.[0]?.image || product.image);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[index] = { ...updatedVariations[index], [field]: value };
    setFormData(prev => ({ ...prev, variations: updatedVariations }));
  };

  const addVariation = () => {
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, {
        id: `variation-${Date.now()}`,
        name: "",
        image: "",
        price: "",
        color: "",
        material: ""
      }]
    }));
  };

  const removeVariation = (index) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Product updated successfully! (Frontend only)");
    navigate("/admin/products");
  };

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
                <option value="Dining Room">Dining Room</option>
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
                placeholder="e.g., Modern Bedroom Collection"
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
              placeholder="Product description..."
            />
          </div>

          {/* Checkboxes */}
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

          {/* Product Variations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Variations</h3>
              <button
                type="button"
                onClick={addVariation}
                className="btn-primary flex items-center gap-2 text-white text-sm"
              >
                <Plus size={16} /> Add Variation
              </button>
            </div>

            <div className="space-y-4">
              {formData.variations.map((variation, index) => (
                <div key={variation.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Variation {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Variation Name *
                      </label>
                      <input
                        type="text"
                        value={variation.name}
                        onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="e.g., Classic White"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        value={variation.price}
                        onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        min="0"
                        placeholder="Leave empty to use base price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        value={variation.color}
                        onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="e.g., White"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Material
                      </label>
                      <input
                        type="text"
                        value={variation.material}
                        onChange={(e) => handleVariationChange(index, 'material', e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="e.g., Wood & Fabric"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={variation.image}
                        onChange={(e) => handleVariationChange(index, 'image', e.target.value)}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.variations.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No variations added. Click "Add Variation" to create different versions of this product.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 text-white px-8 py-3"
            >
              <Save size={20} /> Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}