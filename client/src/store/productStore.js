import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { products as initialProducts } from "../data/Products";
import { readStoredArray } from "../utils/storage";

function getInitialProducts() {
  const featured = readStoredArray("featuredProducts");
  const currentTime = Date.now();

  return initialProducts.map((product) => {
    const legacyEntry = featured.find((item) => String(item.id) === String(product.id));
    if (!legacyEntry) return product;

    const expiry = Number(legacyEntry.expiryTime);
    return {
      ...product,
      featured: Number.isFinite(expiry) ? expiry > currentTime : true,
      ...(Number.isFinite(expiry) ? { featuredExpiry: expiry } : {}),
    };
  });
}

function isProductList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (product) =>
        product &&
        (typeof product.id === "string" || typeof product.id === "number") &&
        typeof product.name === "string" &&
        Number.isFinite(Number(product.price)) &&
        (product.variations === undefined || Array.isArray(product.variations))
    )
  );
}

function mergeCatalog(savedProducts) {
  if (!isProductList(savedProducts) || savedProducts.length === 0) {
    return getInitialProducts();
  }

  return savedProducts;
}

const useProductStore = create(
  persist(
    (set) => ({
      products: getInitialProducts(),
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (productId, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            String(product.id) === String(productId)
              ? { ...product, ...updates }
              : product
          ),
        })),
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => String(product.id) !== String(productId)
          ),
        })),
      setFeatured: (productId, featured, featuredExpiry = null) =>
        set((state) => ({
          products: state.products.map((product) => {
            if (String(product.id) !== String(productId)) return product;
            const nextProduct = { ...product, featured };
            if (featured && featuredExpiry) {
              nextProduct.featuredExpiry = featuredExpiry;
            } else {
              delete nextProduct.featuredExpiry;
            }
            return nextProduct;
          }),
        })),
    }),
    {
      name: "timmylux-product-catalog-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        products: mergeCatalog(persistedState?.products),
      }),
    }
  )
);

export default useProductStore;
