import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiRequest } from "../utils/api";

const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,

      // Fetch products dynamically from the database
      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRequest("/products", { method: "GET" });
          set({
            products: response.data || [],
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch products from database:", error);
          set({
            error: error.message || "Failed to load products",
            isLoading: false,
          });
        }
      },

      // Admin optimisitic UI updates (Backend CRUD happens in Admin components)
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),

      updateProduct: (productId, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            String(product.id) === String(productId)
              ? { ...product, ...updates }
              : product,
          ),
        })),

      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => String(product.id) !== String(productId),
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
      name: "timmylux-product-catalog-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }), // Cache products for instant paint
    },
  ),
);

export default useProductStore;
