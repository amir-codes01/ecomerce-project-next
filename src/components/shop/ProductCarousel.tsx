"use client";
import { productApi } from "@/api/product";
import { Product } from "@/types/product";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

interface ProductCarouselProps {
  title: string;
  type: "bestsellers" | "new" | "trending" | "featured";
  limit?: number;
  category?: string;
  showViewAll?: boolean;
}

export default function ProductCarousel({
  title,
  type,
  limit = 6,
  category,
  showViewAll = true,
}: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { addItem, items: cartItems } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let filters: any = {
        limit: limit,
        isActive: true,
      };

      if (category) {
        filters.category = category;
      }

      // Apply sorting based on type
      switch (type) {
        case "bestsellers":
          filters.sortBy = "sold";
          filters.order = "desc";
          break;
        case "new":
          filters.sortBy = "createdAt";
          filters.order = "desc";
          break;
        case "trending":
          filters.sortBy = "sold";
          filters.order = "desc";
          break;
        case "featured":
          filters.isFeatured = true;
          filters.sortBy = "createdAt";
          filters.order = "desc";
          break;
      }

      const response = await productApi.getProducts(filters);
      console.log(response.products);
      setProducts(response.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [type, category, limit]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && products.length > 0) {
      // Small delay to ensure DOM is rendered
      setTimeout(checkScrollPosition, 100);
      container.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of card (256px) + gap (24px)
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.images[0]?.url,
      slug: product.slug,
    };
    addItem(cartItem);
    setAddedToCart((prev) => new Set(prev).add(product._id));
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => {
      setAddedToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }, 2000);
  };

  const handleWishlistToggle = (product: Product) => {
    const wishlistItem = {
      id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url,
    };
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(wishlistItem);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "bestsellers":
        return <Flame className="h-6 w-6 text-orange-500" />;
      case "new":
        return <Sparkles className="h-6 w-6 text-green-500" />;
      case "trending":
        return <TrendingUp className="h-6 w-6 text-blue-500" />;
      default:
        return null;
    }
  };

  const getDescription = () => {
    switch (type) {
      case "bestsellers":
        return "Our most popular products loved by customers";
      case "new":
        return "Fresh arrivals just for you";
      case "trending":
        return "Hot items everyone is talking about";
      case "featured":
        return "Curated selection of premium products";
      default:
        return "Don't miss out on these amazing deals";
    }
  };

  const getDiscountPercentage = (product: Product): number | null => {
    if (product.discountPrice && product.price) {
      return Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      );
    }
    return product.discountPercentage || null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.id === productId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div>
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-hidden">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="flex-none w-64">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  if (products.length === 0) {
    return null;
  }
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {getTypeIcon()}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 mt-2"
              >
                {getDescription()}
              </motion.p>
            </div>
          </div>
          {products.length > limit && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full transition-all ${
                  canScrollLeft
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white hover:scale-105"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`p-2 rounded-full transition-all ${
                  canScrollRight
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white hover:scale-105"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {/* Products Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => {
            const discount = getDiscountPercentage(product);
            const displayPrice = product.discountPrice || product.price;
            const originalPrice = product.discountPrice
              ? product.price
              : undefined;
            const isLowStock = product.stock <= 5 && product.stock > 0;
            const isOutOfStock = product.stock === 0;
            const inCart = isInCart(product._id);
            const isAddedToCart = addedToCart.has(product._id);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredProduct(product._id)}
                onHoverEnd={() => setHoveredProduct(null)}
                className="flex-none w-64 snap-start"
              >
                <div className="group relative bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {discount && discount > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        -{discount}%
                      </div>
                    )}
                    {product.isFeatured && !discount && (
                      <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        Featured
                      </div>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isInWishlist(product._id)
                          ? "fill-red-500 text-red-500"
                          : "hover:text-red-500"
                      }`}
                    />
                  </button>
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer">
                      {product.images[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className={`object-cover transition-transform duration-500 ${
                            hoveredProduct === product._id
                              ? "scale-110"
                              : "scale-100"
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 256px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold px-3 py-1.5 bg-black/80 rounded-full text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    {product.category && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {product.category.name}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                          {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.numReviews || 0})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(displayPrice)}
                      </span>
                      {originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isOutOfStock
                          ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                          : inCart
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {isAddedToCart ? (
                        <>
                          <Check className="h-4 w-4 animate-in zoom-in" />
                          Added!
                        </>
                      ) : inCart ? (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {showViewAll && products.length >= limit && (
          <div className="text-center mt-10">
            <Link
              href={`/products${category ? `?category=${category}` : ""}`}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all hover:gap-3"
            >
              View All {title}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
