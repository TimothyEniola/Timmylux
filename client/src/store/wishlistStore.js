import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '../utils/api';
import useAuthStore from './authStore';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // 1. Fetch Wishlist from Database
      fetchWishlist: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;
        
        try {
          const response = await apiRequest('/wishlist', { method: 'GET' });
          const formattedItems = response.data.map(item => ({
            ...item.product,
            wishlistId: item.id // Map the DB relation ID for deletions
          }));
          set({ items: formattedItems });
        } catch (error) {
          console.error('Failed to fetch wishlist from database:', error);
        }
      },

      // 2. Add to Wishlist
      addItem: async (product) => {
        const { isAuthenticated } = useAuthStore.getState();
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (!existingItem) {
          if (isAuthenticated) {
            try {
              await apiRequest('/wishlist', {
                method: 'POST',
                body: { productId: product.id }
              });
              await get().fetchWishlist();
            } catch (error) {
              console.error('Failed to add to database wishlist:', error);
            }
          } else {
            set({ items: [...items, product] });
          }
        }
      },

      // 3. Remove from Wishlist
      removeItem: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        const item = get().items.find(i => i.id === id);

        if (isAuthenticated && item?.wishlistId) {
          try {
            await apiRequest(`/wishlist/${item.wishlistId}`, { method: 'DELETE' });
            await get().fetchWishlist();
          } catch (error) {
            console.error('Failed to remove from database wishlist:', error);
          }
        } else {
          set({ items: get().items.filter(item => item.id !== id) });
        }
      },

      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },

      clearWishlist: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.length;
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;