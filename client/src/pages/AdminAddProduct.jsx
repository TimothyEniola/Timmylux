import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

export default function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    collection: "",
    price: "",
    originalPrice: "",
    image: "",
    description: "",
    featured: false,
    available: true,
    variations: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const updated = [...formData.variations];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, variations: updated }));
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          id: `variation-${Date.now()}`,
          name: "",
          price: "",
          color: "",
          material: "",
        },
      ],
    }));
  };

  const removeVariation = (index) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Product added successfully! (Frontend only)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#011F5B]/5 via-white to-[#D4AF37]/5 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#011F5B] to-[#D4AF37] bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage your store inventory with ease.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-10"
        >
          {/* BASIC INFO */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Product Name *">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </Input>

              <Input label="Category *">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-premium"
                  required
                >
                  <option value="">Select Category</option>
                  <option>Living Room</option>
                  <option>Bedroom</option>
                  <option>Dining Room</option>
                  <option>Office</option>
                  <option>Outdoor</option>
                </select>
              </Input>

              <Input label="Collection">
                <input
                  type="text"
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  className="input-premium"
                />
              </Input>

              <Input label="Base Price (₦) *">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </Input>

              <Input label="Original Price (₦)">
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="input-premium"
                />
              </Input>

              <Input label="Main Image URL">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-premium"
                />
              </Input>
            </div>

            <div className="mt-6">
              <Input label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input-premium"
                />
              </Input>
            </div>

            <div className="flex flex-wrap gap-6 mt-6">
              <Checkbox
                label="Featured Product"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <Checkbox
                label="Available for Purchase"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* VARIATIONS */}
          <Section title="Product Variations">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">
                Add different versions (color, material, price, etc.)
              </p>
              <button
                type="button"
                onClick={addVariation}
                className="bg-[#011F5B] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#011F5B]/90 transition shadow-md"
              >
                <Plus size={16} /> Add Variation
              </button>
            </div>

            {formData.variations.map((variation, index) => (
              <div
                key={variation.id}
                className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-[#011F5B]">
                    Variation {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Variation Name"
                    value={variation.name}
                    onChange={(e) =>
                      handleVariationChange(index, "name", e.target.value)
                    }
                    className="input-premium"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variation.price}
                    onChange={(e) =>
                      handleVariationChange(index, "price", e.target.value)
                    }
                    className="input-premium"
                  />
                  <input
                    type="text"
                    placeholder="Color"
                    value={variation.color}
                    onChange={(e) =>
                      handleVariationChange(index, "color", e.target.value)
                    }
                    className="input-premium"
                  />
                  <input
                    type="text"
                    placeholder="Material"
                    value={variation.material}
                    onChange={(e) =>
                      handleVariationChange(index, "material", e.target.value)
                    }
                    className="input-premium"
                  />
                </div>
              </div>
            ))}

            {formData.variations.length === 0 && (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                No variations added yet.
              </div>
            )}
          </Section>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#D4AF37] text-white px-10 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-[#b8942a] hover:shadow-xl transition-all"
            >
              <Save size={18} /> Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#011F5B] mb-6 border-b pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}