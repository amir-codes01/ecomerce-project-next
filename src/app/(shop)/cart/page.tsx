// app/cart/page.tsx or components/cart/Cart.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Tag,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { productApi } from "@/api/product";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalCount,
    getTotalPrice,
  } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [stockStatus, setStockStatus] = useState<Map<string, number>>(
    new Map(),
  );
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);

  // Fetch stock status for items
  useEffect(() => {
    const fetchStockStatus = async () => {
      const stockMap = new Map<string, number>();
      console.log(items);
      for (const item of items) {
        try {
          const product = await productApi.getProductBySlug(item.slug);
          stockMap.set(item.id, product.stock);
        } catch (error) {
          console.error(`Failed to fetch stock for ${item.id}:`, error);
        }
      }
      setStockStatus(stockMap);
    };

    if (items.length > 0) {
      fetchStockStatus();
    }
  }, [items]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    const stock = stockStatus.get(itemId);
    if (stock && newQuantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    updateQuantity(itemId, newQuantity);

    setTimeout(() => {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 500);
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeItem(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const handleMoveToWishlist = (item: CartItem) => {
    addToWishlist({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    removeItem(item.id);
    toast.success(`${item.name} moved to wishlist`);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setApplyingPromo(true);
    // Simulate API call for promo validation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
      toast.success("10% discount applied!");
    } else if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
      toast.success("20% discount applied!");
    } else {
      toast.error("Invalid promo code");
      setDiscount(0);
    }
    setApplyingPromo(false);
  };

  const subtotal = getTotalPrice();
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax
  const total = subtotal - discountAmount + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                <ShoppingCart className="h-12 w-12 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:gap-3"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {getTotalCount()} {getTotalCount() === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>

            <button
              onClick={() => clearCart()}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-1 text-center">Total</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>

                <AnimatePresence>
                  {items.map((item, index) => {
                    const stock = stockStatus.get(item.id) || 0;
                    const isLowStock = stock <= 5 && stock > 0;
                    const isOutOfStock = stock === 0;
                    const isUpdating = updatingItems.has(item.id);
                    const itemTotal = item.price * item.quantity;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                          {/* Product Info */}
                          <div className="col-span-12 md:col-span-6 flex gap-4">
                            <Link href={`/product/${item.id}`}>
                              <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                                    No img
                                  </div>
                                )}
                              </div>
                            </Link>
                            <div className="flex-1">
                              <Link href={`/product/${item.id}`}>
                                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Unit Price: {formatPrice(item.price)}
                              </p>
                              {isLowStock && !isOutOfStock && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Only {stock} left in stock
                                </p>
                              )}
                              {isOutOfStock && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                  Out of stock
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Price (Mobile) */}
                          <div className="md:hidden flex justify-between items-center py-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              Price:
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatPrice(item.price)}
                            </span>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-12 md:col-span-2">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={item.quantity <= 1 || isUpdating}
                                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-12 text-center font-medium">
                                {isUpdating ? (
                                  <div className="inline-block h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                                disabled={
                                  item.quantity >= stock ||
                                  isUpdating ||
                                  isOutOfStock
                                }
                                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="col-span-12 md:col-span-1 text-center">
                            <div className="flex md:block justify-between items-center">
                              <span className="md:hidden text-gray-600 dark:text-gray-400">
                                Total:
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {formatPrice(itemTotal)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-12 md:col-span-1">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleMoveToWishlist(item)}
                                className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                aria-label="Move to wishlist"
                                title="Move to wishlist"
                              >
                                <Tag className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveItem(item.id, item.name)
                                }
                                className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                aria-label="Remove item"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={applyingPromo}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      {applyingPromo ? (
                        <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {discount}% discount applied!
                    </p>
                  )}
                </div>

                <div className="space-y-3 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount ({discount}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Estimated Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(total)}
                  </span>
                </div>

                {subtotal < 100 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Add ${formatPrice(100 - subtotal)} more for free shipping
                  </p>
                )}

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    toast.success("Proceeding to checkout...");
                    // Redirect to checkout page
                    // router.push('/checkout');
                  }}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Payment Methods */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
                    Secure payment methods
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="h-3 w-3" />
                    Secure checkout
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <RefreshCw className="h-3 w-3" />
                    30-day return policy
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Truck className="h-3 w-3" />
                    Free shipping on orders over $100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
