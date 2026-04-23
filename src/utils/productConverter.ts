// utils/productConverter.ts (updated with store integration)
import { Product } from "@/types/product";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { WishlistItem, useWishlistStore } from "@/store/useWishlistStore";

/**
 * Converts a product to a cart item
 * @param product - The product object from API
 * @param quantity - Optional quantity (default: 1)
 * @returns CartItem object ready for cart store
 */
export const productToCartItem = (
  product: Product,
  quantity: number = 1,
): Omit<CartItem, "quantity"> => {
  const hasDiscount = product.discountPrice && product.discountPrice > 0;
  const finalPrice = hasDiscount ? product.discountPrice! : product.price;
  const originalPrice = hasDiscount ? product.price : undefined;

  return {
    id: product._id,
    name: product.name,
    price: finalPrice,
    originalPrice: originalPrice,
    image: product.images[0]?.url || "/images/placeholder.jpg",
    slug: product.slug,
    stock: product.stock,
    discountPercentage:
      product.discountPercentage ||
      (hasDiscount
        ? Math.round(
            ((product.price - product.discountPrice!) / product.price) * 100,
          )
        : 0),
  };
};

/**
 * Converts a product to a wishlist item
 * @param product - The product object from API
 * @returns WishlistItem object ready for wishlist store
 */
export const productToWishlistItem = (product: Product): WishlistItem => {
  const hasDiscount = product.discountPrice && product.discountPrice > 0;
  const finalPrice = hasDiscount ? product.discountPrice! : product.price;
  const originalPrice = hasDiscount ? product.price : undefined;

  return {
    id: product._id,
    name: product.name,
    price: finalPrice,
    originalPrice: originalPrice,
    image: product.images[0]?.url || "/images/placeholder.jpg",
    slug: product.slug,
    discountPercentage:
      product.discountPercentage ||
      (hasDiscount
        ? Math.round(
            ((product.price - product.discountPrice!) / product.price) * 100,
          )
        : 0),
    averageRating: product.averageRating,
    isActive: product.isActive,
    stock: product.stock,
  };
};

/**
 * Adds product to cart with automatic stock validation
 * @param product - Product to add
 * @param quantity - Quantity to add
 * @returns boolean indicating success
 */
export const addProductToCart = (
  product: Product,
  quantity: number = 1,
): boolean => {
  const { addItem, getCartItem, updateQuantity } = useCartStore.getState();

  // Check stock
  if (product.stock === 0) {
    console.warn("Product is out of stock");
    return false;
  }

  const existingItem = getCartItem(product._id);
  const newQuantity = (existingItem?.quantity || 0) + quantity;

  if (newQuantity > product.stock) {
    console.warn(
      `Cannot add ${quantity} items. Only ${product.stock} available`,
    );
    return false;
  }

  const cartItem = productToCartItem(product);
  addItem({ ...cartItem, quantity });
  return true;
};

/**
 * Toggles product in wishlist
 * @param product - Product to toggle
 * @returns boolean indicating if added (true) or removed (false)
 */
export const toggleProductInWishlist = (product: Product): boolean => {
  const { toggleItem, isInWishlist } = useWishlistStore.getState();
  const wishlistItem = productToWishlistItem(product);
  toggleItem(wishlistItem);
  return !isInWishlist(product._id);
};

/**
 * Syncs entire cart with latest product data
 * @param products - Array of updated products
 * @returns Updated cart items
 */
export const syncCartWithProducts = (products: Product[]): CartItem[] => {
  const { items, updateItemPrice, updateItemStock } = useCartStore.getState();
  const productMap = new Map(products.map((p) => [p._id, p]));

  items.forEach((item) => {
    const product = productMap.get(item.id);
    if (product) {
      const hasDiscount = product.discountPrice && product.discountPrice > 0;
      const finalPrice = hasDiscount ? product.discountPrice! : product.price;
      const originalPrice = hasDiscount ? product.price : undefined;

      updateItemPrice(item.id, finalPrice, originalPrice);
      updateItemStock(item.id, product.stock);
    }
  });

  return useCartStore.getState().items;
};

/**
 * Syncs entire wishlist with latest product data
 * @param products - Array of updated products
 * @returns Updated wishlist items
 */
export const syncWishlistWithProducts = (
  products: Product[],
): WishlistItem[] => {
  const {
    items,
    updateItemPrice,
    updateItemStock,
    updateItemRating,
    removeItem,
  } = useWishlistStore.getState();
  const productMap = new Map(products.map((p) => [p._id, p]));

  items.forEach((item) => {
    const product = productMap.get(item.id);
    if (product) {
      const hasDiscount = product.discountPrice && product.discountPrice > 0;
      const finalPrice = hasDiscount ? product.discountPrice! : product.price;
      const originalPrice = hasDiscount ? product.price : undefined;

      updateItemPrice(item.id, finalPrice, originalPrice);
      updateItemStock(item.id, product.stock);
      updateItemRating(item.id, product.averageRating);

      // Remove if product is inactive
      if (!product.isActive) {
        removeItem(item.id);
      }
    }
  });

  return useWishlistStore.getState().items;
};

/**
 * Gets cart summary with detailed information
 */
export const getCartSummary = () => {
  const { getTotalCount, getSubtotal, getTotalPrice, getTotalDiscount, items } =
    useCartStore.getState();

  return {
    itemCount: getTotalCount(),
    subtotal: getSubtotal(),
    total: getTotalPrice(),
    discount: getTotalDiscount(),
    items: items,
    hasItems: items.length > 0,
  };
};

/**
 * Gets wishlist summary
 */
export const getWishlistSummary = () => {
  const { getTotalCount, items } = useWishlistStore.getState();

  return {
    itemCount: getTotalCount(),
    items: items,
    hasItems: items.length > 0,
  };
};

/**
 * Validates all cart items stock
 * @returns Object with validation results
 */
export const validateCartStock = () => {
  const { validateStock } = useCartStore.getState();
  return validateStock();
};

// ... rest of the existing utility functions (formatPrice, getStockStatusMessage, etc.)
