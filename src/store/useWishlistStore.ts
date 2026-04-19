// store/wishlistStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  slug?: string;
  discountPercentage?: number;
  averageRating?: number;
  isActive?: boolean;
  stock?: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  removeItems: (ids: string[]) => void;
  isInWishlist: (id: string) => boolean; // This exists
  getTotalCount: () => number;
  clearWishlist: () => void;
  updateItemPrice: (
    id: string,
    newPrice: number,
    originalPrice?: number,
  ) => void;
  updateItemStock: (id: string, stock: number) => void;
  updateItemRating: (id: string, rating: number) => void;
  getWishlistItems: () => WishlistItem[];
  getWishlistItem: (id: string) => WishlistItem | undefined;
  mergeItems: (items: WishlistItem[]) => void;
  removeInactiveItems: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().isInWishlist(item.id)) {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      toggleItem: (item) => {
        if (get().isInWishlist(item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      removeItems: (ids) => {
        set({ items: get().items.filter((i) => !ids.includes(i.id)) });
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      getTotalCount: () => {
        return get().items.length;
      },

      clearWishlist: () => set({ items: [] }),

      updateItemPrice: (id, newPrice, originalPrice) => {
        set({
          items: get().items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  price: newPrice,
                  originalPrice:
                    originalPrice !== undefined
                      ? originalPrice
                      : i.originalPrice,
                }
              : i,
          ),
        });
      },

      updateItemStock: (id, stock) => {
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, stock } : i)),
        });
      },

      updateItemRating: (id, rating) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, averageRating: rating } : i,
          ),
        });
      },

      getWishlistItems: () => {
        return get().items;
      },

      getWishlistItem: (id) => {
        return get().items.find((i) => i.id === id);
      },

      mergeItems: (items) => {
        const currentItems = get().items;
        const mergedMap = new Map<string, WishlistItem>();

        // Add current items
        currentItems.forEach((item) => {
          mergedMap.set(item.id, item);
        });

        // Merge new items (don't duplicate)
        items.forEach((item) => {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        });

        set({ items: Array.from(mergedMap.values()) });
      },

      removeInactiveItems: () => {
        set({ items: get().items.filter((item) => item.isActive !== false) });
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({
        items: state.items.map(({ stock, averageRating, ...item }) => item),
      }),
      onRehydrateStorage: () => {
        console.log("Wishlist store hydrated");
        return (state, error) => {
          if (error) {
            console.error("Error hydrating wishlist store:", error);
          }
        };
      },
    },
  ),
);
