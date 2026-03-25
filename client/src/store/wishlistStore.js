import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        if (!existingItem) {
          set({ items: [...items, product] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
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