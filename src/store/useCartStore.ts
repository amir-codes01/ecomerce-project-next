// store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  slug?: string;
  stock?: number;
  discountPercentage?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemPrice: (
    id: string,
    newPrice: number,
    originalPrice?: number,
  ) => void;
  updateItemStock: (id: string, stock: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getTotalPrice: () => number;
  getTotalDiscount: () => number;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean; // Add this method
  getCartItem: (id: string) => CartItem | undefined;
  mergeItems: (items: CartItem[]) => void;
  validateStock: () => { hasStockIssues: boolean; items: CartItem[] };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        const quantityToAdd = item.quantity || 1;

        if (existing) {
          // Check stock limit if available
          if (item.stock && existing.quantity + quantityToAdd > item.stock) {
            // If exceeds stock, set to max stock
            if (existing.quantity < item.stock) {
              set({
                items: get().items.map((i) =>
                  i.id === item.id ? { ...i, quantity: item.stock } : i,
                ),
              });
            }
            return;
          }

          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantityToAdd }
                : i,
            ),
          });
        } else {
          // Add new item with validation
          const newItem: CartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: Math.min(quantityToAdd, item.stock || quantityToAdd),
            image: item.image,
            slug: item.slug,
            stock: item.stock,
            discountPercentage: item.discountPercentage,
          };
          set({ items: [...get().items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);

        if (quantity <= 0) {
          get().removeItem(id);
        } else if (item && item.stock && quantity > item.stock) {
          // Don't allow quantity beyond stock
          return;
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i,
            ),
          });
        }
      },

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
        const item = get().items.find((i) => i.id === id);
        if (item && item.quantity > stock) {
          // If current quantity exceeds stock, reduce quantity
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, stock, quantity: stock } : i,
            ),
          });
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, stock } : i)),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        // Subtotal based on original prices
        return get().items.reduce((sum, item) => {
          const originalPrice = item.originalPrice || item.price;
          return sum + originalPrice * item.quantity;
        }, 0);
      },

      getTotalPrice: () => {
        // Total after discounts
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },

      getTotalDiscount: () => {
        return get().getSubtotal() - get().getTotalPrice();
      },

      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        return item?.quantity || 0;
      },

      // Add the missing isInCart method
      isInCart: (id) => {
        return get().items.some((i) => i.id === id);
      },

      getCartItem: (id) => {
        return get().items.find((i) => i.id === id);
      },

      mergeItems: (items) => {
        const currentItems = get().items;
        const mergedItems = [...currentItems];

        items.forEach((newItem) => {
          const existingIndex = mergedItems.findIndex(
            (i) => i.id === newItem.id,
          );
          if (existingIndex !== -1) {
            // Merge quantities
            const existing = mergedItems[existingIndex];
            const newQuantity = Math.min(
              existing.quantity + newItem.quantity,
              newItem.stock || Infinity,
            );
            mergedItems[existingIndex] = { ...existing, quantity: newQuantity };
          } else {
            mergedItems.push(newItem);
          }
        });

        set({ items: mergedItems });
      },

      validateStock: () => {
        const items = get().items;
        const hasStockIssues = items.some(
          (item) => item.stock !== undefined && item.quantity > item.stock,
        );

        const updatedItems = items.map((item) => {
          if (item.stock !== undefined && item.quantity > item.stock) {
            return { ...item, quantity: item.stock };
          }
          return item;
        });

        if (hasStockIssues) {
          set({ items: updatedItems });
        }

        return { hasStockIssues, items: updatedItems };
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items.map(({ stock, ...item }) => item), // Don't persist stock as it can change
      }),
      onRehydrateStorage: () => {
        console.log("Cart store hydrated");
        return (state, error) => {
          if (error) {
            console.error("Error hydrating cart store:", error);
          }
        };
      },
    },
  ),
);
