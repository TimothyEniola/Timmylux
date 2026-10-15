import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "../utils/api";
import useAuthStore from "./authStore";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const response = await apiRequest("/cart", { method: "GET" });
          const formattedItems = response.data.map((item) => ({
            ...item.product,
            cartItemId: item.id,
            quantity: item.quantity,
            selectedVariation: item.variation || null,
          }));
          set({ items: formattedItems });
        } catch (error) {
          console.error("Failed to fetch cart from database:", error);
        }
      },

      addItem: async (product) => {
        const { isAuthenticated } = useAuthStore.getState();
        const items = get().items;

        // FLaw Fix: Match by BOTH Product ID and Variation Name
        const existingItem = items.find(
          (item) =>
            item.id === product.id &&
            item.selectedVariation?.name === product.selectedVariation?.name,
        );

        if (isAuthenticated) {
          try {
            await apiRequest("/cart", {
              method: "POST",
              body: {
                productId: product.id,
                variationId: product.selectedVariation?.id || undefined,
                quantity: 1,
              },
            });
            await get().fetchCart();
          } catch (error) {
            console.error("Failed to add to database cart:", error);
          }
        } else {
          if (existingItem) {
            set({
              items: items.map((item) =>
                item.id === product.id &&
                item.selectedVariation?.name === product.selectedVariation?.name
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            });
          } else {
            // Generate a temporary local ID for guest cart management
            const localCartItemId = `local-${Date.now()}`;
            set({
              items: [
                ...items,
                {
                  ...product,
                  cartItemId: localCartItemId,
                  quantity: 1,
                  selectedVariation: product.selectedVariation || null,
                },
              ],
            });
          }
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (quantity <= 0) {
          return get().removeItem(cartItemId);
        }

        if (isAuthenticated && !String(cartItemId).startsWith("local-")) {
          try {
            await apiRequest(`/cart/${cartItemId}`, {
              method: "PUT",
              body: { quantity },
            });
            await get().fetchCart();
          } catch (error) {
            console.error("Failed to update quantity in database:", error);
          }
        } else {
          set({
            items: get().items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item,
            ),
          });
        }
      },

      removeItem: async (cartItemId) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated && !String(cartItemId).startsWith("local-")) {
          try {
            await apiRequest(`/cart/${cartItemId}`, { method: "DELETE" });
            await get().fetchCart();
          } catch (error) {
            console.error("Failed to remove item from database:", error);
          }
        } else {
          set({
            items: get().items.filter((item) => item.cartItemId !== cartItemId),
          });
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await apiRequest("/cart", { method: "DELETE" });
          } catch (error) {
            console.error("Failed to clear database cart:", error);
          }
        }
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.selectedVariation?.price || item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
