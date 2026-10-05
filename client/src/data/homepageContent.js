import { readStoredJson } from "../utils/storage";

export const defaultHomeContent = {
  hero: {
    title: "Explore Our Modern Furniture Collection",
    subtitle:
      "Discover timeless elegance and modern comfort with our curated collection of premium furniture. Transform your space with pieces that blend luxury craftsmanship with contemporary design.",
    backgroundImage:
      "https://images.unsplash.com/photo-1759691555105-17e609a3e46f?auto=format&fit=crop&w=1200&q=75",
    ctaText: "Shop Now →",
    secondaryCtaText: "View All Products",
  },
  features: {
    title: "Why Choose Us",
    subtitle: "Experience luxury furniture shopping like never before",
    features: [
      { title: "Free Shipping", description: "Free shipping for orders above $1000", icon: "Package" },
      { title: "Secure Payment", description: "100% secure payment methods", icon: "CreditCard" },
      { title: "24/7 Support", description: "Round the clock customer support", icon: "Headphones" },
      { title: "Quality Guarantee", description: "Premium quality furniture guaranteed", icon: "Star" },
    ],
  },
  categories: {
    title: "Browse by Category",
    subtitle: "Explore our wide range of collections",
    categories: [
      {
        name: "Living Room",
        count: "200+ Items",
        image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900",
        items: ["Sofa Sets", "Coffee Tables", "Armchairs", "TV Units"],
      },
      {
        name: "Bedroom",
        count: "150+ Items",
        image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=900",
        items: ["Beds", "Wardrobes", "Nightstands", "Dressers"],
      },
      {
        name: "Dining",
        count: "80+ Items",
        image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=900",
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
};

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeCategory(category, index) {
  const fallback = defaultHomeContent.categories.categories[index] || {};
  const source = asObject(category);
  const items = Array.isArray(source.items)
    ? source.items.filter((item) => typeof item === "string")
    : typeof source.items === "string"
      ? source.items.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
      : fallback.items || [];

  return {
    ...fallback,
    ...source,
    items,
    count:
      source.count ||
      (items.length ? `${items.length} Items` : ""),
  };
}

export function loadHomeContent() {
  const saved = asObject(readStoredJson("adminContent", {}));
  const savedFeatures = asObject(saved.features);
  const savedCategories = asObject(saved.categories);
  const savedProducts = asObject(saved.products);

  return {
    ...defaultHomeContent,
    ...saved,
    hero: { ...defaultHomeContent.hero, ...asObject(saved.hero) },
    features: {
      ...defaultHomeContent.features,
      ...savedFeatures,
      features: Array.isArray(savedFeatures.features)
        ? savedFeatures.features
        : defaultHomeContent.features.features,
    },
    categories: {
      ...defaultHomeContent.categories,
      ...savedCategories,
      categories: Array.isArray(savedCategories.categories)
        ? savedCategories.categories.map(normalizeCategory)
        : defaultHomeContent.categories.categories,
    },
    products: { ...defaultHomeContent.products, ...savedProducts },
  };
}
