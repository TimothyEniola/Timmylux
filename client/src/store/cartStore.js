import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../utils/api';
import useAuthStore from './authStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // 1. Fetch Cart from Database
      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;
        
        try {
          const response = await apiRequest('/cart', { method: 'GET' });
          // Format backend data to match the frontend structure
          const formattedItems = response.data.map(item => ({
            ...item.product,
            cartItemId: item.id, // Save the DB cart item ID for updates/deletes
            quantity: item.quantity,
            selectedVariation: item.variation || null,
          }));
          set({ items: formattedItems });
        } catch (error) {
          console.error('Failed to fetch cart from database:', error);
        }
      },

      // 2. Add Item
      addItem: async (product) => {
        const { isAuthenticated } = useAuthStore.getState();
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (isAuthenticated) {
          try {
            await apiRequest('/cart', {
              method: 'POST',
              body: { 
                productId: product.id, 
                variationId: product.selectedVariation?.id || undefined,
                quantity: 1 
              }
            });
            await get().fetchCart(); // Re-sync perfectly with DB
          } catch (error) {
            console.error('Failed to add to database cart:', error);
          }
        } else {
          // Guest Fallback
          if (existingItem) {
            set({
              items: items.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            });
          } else {
            set({ items: [...items, { ...product, quantity: 1, selectedVariation: product.selectedVariation || null }] });
          }
        }
      },

      // 3. Update Quantity
      updateQuantity: async (id, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();
        const item = get().items.find(i => i.id === id);

        if (quantity <= 0) {
          return get().removeItem(id);
        }

        if (isAuthenticated && item?.cartItemId) {
          try {
            await apiRequest(`/cart/${item.cartItemId}`, {
              method: 'PUT',
              body: { quantity }
            });
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to update quantity in database:', error);
          }
        } else {
          // Guest Fallback
          set({
            items: get().items.map(item => item.id === id ? { ...item, quantity } : item)
          });
        }
      },

      // 4. Remove Item
      removeItem: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        const item = get().items.find(i => i.id === id);

        if (isAuthenticated && item?.cartItemId) {
          try {
            await apiRequest(`/cart/${item.cartItemId}`, { method: 'DELETE' });
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to remove item from database:', error);
          }
        } else {
          // Guest Fallback
          set({ items: get().items.filter(item => item.id !== id) });
        }
      },

      updateVariation: (id, variation) => {
        // Kept as a local UI adjustment for flexibility
        set({
          items: get().items.map(item =>
            item.id === id 
              ? { ...item, selectedVariation: variation, price: variation?.price || item.price, image: variation?.image || item.image, color: variation?.color }
              : item
          )
        });
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await apiRequest('/cart', { method: 'DELETE' });
          } catch (error) {
            console.error('Failed to clear database cart:', error);
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
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;