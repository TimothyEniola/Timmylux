import { useState, useEffect } from "react";
import { Save, Edit3, Image, Type, Eye, EyeOff } from "lucide-react";

export default function AdminContentEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const [content, setContent] = useState({
    hero: {
      title: "Explore Our Modern Furniture Collection",
      subtitle:
        "Discover timeless elegance and modern comfort with our curated collection of premium furniture. Transform your space with pieces that blend luxury craftsmanship with contemporary design.",
      backgroundImage:
        "https://images.unsplash.com/photo-1759691555105-17e609a3e46f?auto=format&fit=crop&q=80",
      ctaText: "Shop Now →",
      secondaryCtaText: "View All Products",
    },
    features: {
      title: "Why Choose Us",
      subtitle: "Experience luxury furniture shopping like never before",
      features: [
        {
          title: "Free Shipping",
          description: "Free shipping for orders above $1000",
          icon: "Package",
        },
        {
          title: "Secure Payment",
          description: "100% secure payment methods",
          icon: "CreditCard",
        },
        {
          title: "24/7 Support",
          description: "Round the clock customer support",
          icon: "Headphones",
        },
        {
          title: "Quality Guarantee",
          description: "Premium quality furniture guaranteed",
          icon: "Star",
        },
      ],
    },
    categories: {
      title: "Browse by Category",
      subtitle: "Explore our wide range of collections",
      categories: [
        {
          name: "Living Room",
          count: "200+ Items",
          image:
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
          items: ["Sofa Sets", "Coffee Tables", "Armchairs", "TV Units"],
        },
        {
          name: "Bedroom",
          count: "150+ Items",
          image:
            "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg",
          items: ["Beds", "Wardrobes", "Nightstands", "Dressers"],
        },
        {
          name: "Dining",
          count: "80+ Items",
          image:
            "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
          items: ["Dining Tables", "Chairs", "Sideboards", "Bar Stools"],
        },
      ],
    },
    products: {
      title: "Curated Home Highlights",
      subtitle: "Featured Products",
      flashSaleText: "Flash Sale",
      description: "Only 4 exclusive items featured here",
    },
  });

  const [editing, setEditing] = useState({});
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem("adminContent");
    if (savedContent) {
      const loaded = JSON.parse(savedContent);
      if (loaded?.categories?.categories) {
        loaded.categories.categories = loaded.categories.categories.map((category) => ({
          ...category,
          count:
            category.count ||
            (Array.isArray(category.items)
              ? `${category.items.length} Items`
              : typeof category.items === "string"
              ? category.items
              : ""),
        }));
      }
      setContent(loaded);
    }
  }, []);

  const saveContent = () => {
    localStorage.setItem("adminContent", JSON.stringify(content));
    toast.success("Content saved successfully!");
  };

  const updateContent = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedContent = (section, subfield, index, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subfield]: prev[section][subfield].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const renderEditField = (
    label,
    value,
    onChange,
    type = "text",
    placeholder = ""
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
          rows={4}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6 md:py-8 px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Content Editor
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Edit text and images on your public pages
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="btn-outline flex items-center gap-2 px-3 py-2 text-sm md:text-base"
            >
              {previewMode ? <EyeOff size={18} /> : <Eye size={18} />}
              {previewMode ? "Edit Mode" : "Preview"}
            </button>
            <button
              onClick={saveContent}
              className="btn-primary flex items-center gap-2 px-3 py-2 text-sm md:text-base"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="border-b border-gray-200">
            <nav className="flex flex-nowrap">
              {[
                { id: "hero", label: "Hero Section", icon: Image },
                { id: "features", label: "Features", icon: Type },
                { id: "categories", label: "Categories", icon: Image },
                { id: "products", label: "Products", icon: Type },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === id
                      ? "border-[#D4AF37] text-[#D4AF37]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {/* Hero Section */}
          {activeSection === "hero" && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-6">
                Hero Section
              </h3>
              {renderEditField(
                "Title",
                content.hero.title,
                (value) => updateContent("hero", "title", value)
              )}
              {renderEditField(
                "Subtitle",
                content.hero.subtitle,
                (value) => updateContent("hero", "subtitle", value),
                "textarea"
              )}
              {renderEditField(
                "Background Image URL",
                content.hero.backgroundImage,
                (value) => updateContent("hero", "backgroundImage", value)
              )}
              {renderEditField(
                "Primary CTA Text",
                content.hero.ctaText,
                (value) => updateContent("hero", "ctaText", value)
              )}
              {renderEditField(
                "Secondary CTA Text",
                content.hero.secondaryCtaText,
                (value) => updateContent("hero", "secondaryCtaText", value)
              )}
            </div>
          )}

          {/* Features Section */}
          {activeSection === "features" && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-6">
                Features Section
              </h3>
              {renderEditField(
                "Section Title",
                content.features.title,
                (value) => updateContent("features", "title", value)
              )}
              {renderEditField(
                "Section Subtitle",
                content.features.subtitle,
                (value) => updateContent("features", "subtitle", value),
                "textarea"
              )}
              <h4 className="text-md md:text-lg font-medium mb-4 mt-6">
                Feature Items
              </h4>
              {content.features.features.map((feature, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderEditField(
                      "Title",
                      feature.title,
                      (value) =>
                        updateNestedContent(
                          "features",
                          "features",
                          index,
                          "title",
                          value
                        )
                    )}
                    {renderEditField(
                      "Description",
                      feature.description,
                      (value) =>
                        updateNestedContent(
                          "features",
                          "features",
                          index,
                          "description",
                          value
                        ),
                      "textarea"
                    )}
                    {renderEditField(
                      "Icon",
                      feature.icon,
                      (value) =>
                        updateNestedContent(
                          "features",
                          "features",
                          index,
                          "icon",
                          value
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Categories Section */}
          {activeSection === "categories" && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-6">
                Categories Section
              </h3>
              {renderEditField(
                "Section Title",
                content.categories.title,
                (value) => updateContent("categories", "title", value)
              )}
              {renderEditField(
                "Section Subtitle",
                content.categories.subtitle,
                (value) => updateContent("categories", "subtitle", value),
                "textarea"
              )}
              <h4 className="text-md md:text-lg font-medium mb-4 mt-6">
                Category Items
              </h4>
              {content.categories.categories.map((category, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderEditField(
                      "Name",
                      category.name,
                      (value) =>
                        updateNestedContent(
                          "categories",
                          "categories",
                          index,
                          "name",
                          value
                        )
                    )}
                    {renderEditField(
                      "Items Count",
                      category.count,
                      (value) =>
                        updateNestedContent(
                          "categories",
                          "categories",
                          index,
                          "count",
                          value
                        )
                    )}
                    {renderEditField(
                      "Image URL",
                      category.image,
                      (value) =>
                        updateNestedContent(
                          "categories",
                          "categories",
                          index,
                          "image",
                          value
                        )
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Items List
                      </label>
                      <textarea
                        value={category.items.join("\n")}
                        onChange={(e) =>
                          updateNestedContent(
                            "categories",
                            "categories",
                            index,
                            "items",
                            e.target.value.split("\n")
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        rows={4}
                        placeholder="Enter items one per line"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Section */}
          {activeSection === "products" && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-6">
                Products Section
              </h3>
              {renderEditField(
                "Section Title",
                content.products.title,
                (value) => updateContent("products", "title", value)
              )}
              {renderEditField(
                "Section Subtitle",
                content.products.subtitle,
                (value) => updateContent("products", "subtitle", value),
                "textarea"
              )}
              {renderEditField(
                "Flash Sale Text",
                content.products.flashSaleText,
                (value) => updateContent("products", "flashSaleText", value)
              )}
              {renderEditField(
                "Description",
                content.products.description,
                (value) => updateContent("products", "description", value)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}