import { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminCollections() {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Modern Bedroom Collection",
      description: "Contemporary bedroom furniture with sleek designs",
      image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
      featured: true,
      productCount: 5
    },
    {
      id: 2,
      name: "Luxury Living Collection",
      description: "Premium living room furniture for modern homes",
      image: "https://images.pexels.com/photos/8135267/pexels-photo-8135267.jpeg",
      featured: false,
      productCount: 8
    }
  ]);

  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    featured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddCollection = () => {
    if (formData.name.trim()) {
      const newCollection = {
        id: Date.now(),
        ...formData,
        productCount: 0
      };
      setCollections(prev => [...prev, newCollection]);
      setFormData({ name: "", description: "", image: "", featured: false });
      setIsAddingCollection(false);
      toast.success("Collection added successfully!");
    }
  };

  const handleEditCollection = (collection) => {
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      description: collection.description,
      image: collection.image,
      featured: collection.featured
    });
  };

  const handleUpdateCollection = () => {
    if (formData.name.trim()) {
      setCollections(prev => prev.map(collection =>
        collection.id === editingId
          ? { ...collection, ...formData }
          : collection
      ));
      setEditingId(null);
      setFormData({ name: "", description: "", image: "", featured: false });
      toast.success("Collection updated successfully!");
    }
  };

  const handleDeleteCollection = (id) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
    toast.success("Collection deleted successfully!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", image: "", featured: false });
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">Manage Collections</h1>
        <button
          onClick={() => setIsAddingCollection(true)}
          className="btn-primary flex items-center gap-2 text-white w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Collection
        </button>
      </div>

      {/* Add/Edit Collection Form */}
      {(isAddingCollection || editingId) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-[#011F5B] mb-4">
            {isAddingCollection ? "Add New Collection" : "Edit Collection"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Collection Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Enter collection name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="Collection description..."
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm">Featured Collection</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={isAddingCollection ? handleAddCollection : handleUpdateCollection}
              className="btn-primary flex items-center gap-2 text-white"
            >
              <Save size={20} />
              {isAddingCollection ? "Add Collection" : "Update Collection"}
            </button>
            <button
              onClick={() => {
                setIsAddingCollection(false);
                cancelEdit();
              }}
              className="btn-outline flex items-center gap-2"
            >
              <X size={20} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-48 object-cover"
              />
              {collection.featured && (
                <span className="absolute top-3 left-3 bg-[#D4AF37] text-white px-2 py-1 rounded text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#011F5B] mb-2">
                {collection.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {collection.description}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {collection.productCount} products
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCollection(collection)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No collections found.</p>
          <button
            onClick={() => setIsAddingCollection(true)}
            className="btn-primary mt-4"
          >
            Create Your First Collection
          </button>
        </div>
      )}
    </div>
  );
}