// app/products/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronUp,
  Filter,
  Grid3x3,
  List,
  Check,
  ArrowUpDown,
  TrendingUp,
  Clock,
  DollarSign,
  Flame,
  Eye,
  Truck,
  Shield,
} from "lucide-react";
import { productApi } from "@/api/product";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import {
  addProductToCart,
  toggleProductInWishlist,
} from "@/utils/productConverter";
import toast from "react-hot-toast";

// Types
interface Filters {
  keyword: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
  sortBy: string;
  order: "asc" | "desc";
  inStock: boolean;
  onSale: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

// Categories (you can fetch these from API)
const categories = [
  { id: "", name: "All Categories" },
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home", name: "Home & Living" },
  { id: "beauty", name: "Beauty & Care" },
  { id: "sports", name: "Sports & Outdoors" },
];

const sortOptions = [
  { value: "createdAt", label: "Newest First", icon: Clock },
  {
    value: "price",
    label: "Price: Low to High",
    icon: DollarSign,
    order: "asc",
  },
  {
    value: "price",
    label: "Price: High to Low",
    icon: DollarSign,
    order: "desc",
  },
  { value: "averageRating", label: "Top Rated", icon: Star, order: "desc" },
  { value: "sold", label: "Best Selling", icon: Flame, order: "desc" },
];

const ratings = [
  { value: 4, label: "4 Stars & Up" },
  { value: 3, label: "3 Stars & Up" },
  { value: 2, label: "2 Stars & Up" },
  { value: 1, label: "1 Star & Up" },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    keyword: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : null,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : null,
    rating: searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : null,
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000,
  });

  // Store hooks
  const { addItem: addToCart, isInCart } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryFilters: any = {
        page: pagination.currentPage,
        limit: 12,
        sortBy: filters.sortBy,
        order: filters.order,
      };

      if (filters.keyword) queryFilters.keyword = filters.keyword;
      if (filters.category) queryFilters.category = filters.category;
      if (filters.minPrice) queryFilters.minPrice = filters.minPrice;
      if (filters.maxPrice) queryFilters.maxPrice = filters.maxPrice;
      if (filters.rating) queryFilters.rating = filters.rating;

      const response = await productApi.getProducts(queryFilters);

      let filteredProducts = response.products;

      // Client-side filters for advanced options
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter((p) => p.stock > 0);
      }

      if (filters.onSale) {
        filteredProducts = filteredProducts.filter(
          (p) => p.discountPrice && p.discountPrice > 0,
        );
      }

      setProducts(filteredProducts);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalProducts: response.totalProducts,
      });
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update URL with filters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set("search", filters.keyword);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.rating) params.set("rating", filters.rating.toString());
    if (filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
    if (filters.order !== "desc") params.set("order", filters.order);
    if (filters.inStock) params.set("inStock", "true");
    if (filters.onSale) params.set("onSale", "true");

    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    const success = addProductToCart(product, 1);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(`Cannot add ${product.name} to cart`);
    }
  };

  const handleToggleWishlist = (product: Product) => {
    const isAdded = toggleProductInWishlist(product);
    toast.success(isAdded ? `Added to wishlist` : `Removed from wishlist`);
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      minPrice: null,
      maxPrice: null,
      rating: null,
      sortBy: "createdAt",
      order: "desc",
      inStock: false,
      onSale: false,
    });
    setPriceRange({ min: 0, max: 1000 });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {pagination.totalProducts} products found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) =>
                      handleFilterChange("keyword", e.target.value)
                    }
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label
                      key={rating.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating.value}
                        onChange={() =>
                          handleFilterChange("rating", rating.value)
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.value
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          & Up
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange("inStock", e.target.checked)
                    }
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    In Stock Only
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) =>
                      handleFilterChange("onSale", e.target.checked)
                    }
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    On Sale
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Sort By */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <select
                    value={`${filters.sortBy}-${filters.order}`}
                    onChange={(e) => {
                      const [sortBy, order] = e.target.value.split("-");
                      handleFilterChange("sortBy", sortBy);
                      handleFilterChange("order", order as "asc" | "desc");
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option
                        key={`${option.value}-${option.order || "desc"}`}
                        value={`${option.value}-${option.order || "desc"}`}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.rating ||
              filters.inStock ||
              filters.onSale ||
              filters.keyword) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.keyword && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Search: {filters.keyword}
                    <button onClick={() => handleFilterChange("keyword", "")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Category:{" "}
                    {categories.find((c) => c.id === filters.category)?.name}
                    <button onClick={() => handleFilterChange("category", "")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Price: ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                    <button
                      onClick={() => {
                        handleFilterChange("minPrice", null);
                        handleFilterChange("maxPrice", null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.rating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {filters.rating}+ Stars
                    <button onClick={() => handleFilterChange("rating", null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    In Stock
                    <button
                      onClick={() => handleFilterChange("inStock", false)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
                    On Sale
                    <button onClick={() => handleFilterChange("onSale", false)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid/List */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {products.map((product, index) => {
                    const discount = product.discountPercentage;
                    const finalPrice = product.discountPrice || product.price;
                    const isProductInCart = isInCart(product._id);
                    const isAdding = addingToCart.has(product._id);
                    const isWishlisted = isInWishlist(product._id);

                    if (viewMode === "grid") {
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          onHoverStart={() => setHoveredProduct(product._id)}
                          onHoverEnd={() => setHoveredProduct(null)}
                          className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                          {/* Image Container */}
                          <Link href={`/product/${product.slug}`}>
                            <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}

                              {/* Badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {discount && discount > 0 && (
                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -{discount}%
                                  </span>
                                )}
                                {product.isFeatured && (
                                  <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    Featured
                                  </span>
                                )}
                              </div>

                              {/* Wishlist Button */}
                              <button
                                onClick={() => handleToggleWishlist(product)}
                                className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                              >
                                <Heart
                                  className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </button>

                              {/* Out of Stock Overlay */}
                              {product.stock === 0 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white font-bold px-3 py-1.5 bg-black/80 rounded-full text-sm">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Product Info */}
                          <div className="p-4">
                            <Link href={`/product/${product.slug}`}>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                  {formatPrice(finalPrice)}
                                </span>
                                {product.discountPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </div>
                              {renderStars(product.averageRating)}
                            </div>

                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0 || isAdding}
                              className={`w-full mt-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                product.stock === 0
                                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                                  : isProductInCart
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              {isAdding ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : isProductInCart ? (
                                <>
                                  <Check className="h-4 w-4" />
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
                        </motion.div>
                      );
                    } else {
                      // List view
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 p-4">
                            <Link
                              href={`/product/${product.slug}`}
                              className="sm:w-48"
                            >
                              <div className="relative h-40 sm:h-32 overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-lg">
                                {product.images[0]?.url ? (
                                  <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    No Image
                                  </div>
                                )}
                              </div>
                            </Link>

                            <div className="flex-1">
                              <Link href={`/product/${product.slug}`}>
                                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                                  {product.name}
                                </h3>
                              </Link>

                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {product.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(finalPrice)}
                                  </span>
                                  {product.discountPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatPrice(product.price)}
                                    </span>
                                  )}
                                </div>
                                {renderStars(product.averageRating)}
                                {product.stock > 0 && product.stock <= 5 && (
                                  <span className="text-xs text-orange-600">
                                    Only {product.stock} left
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.stock === 0}
                                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                                    product.stock === 0
                                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  }`}
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => handleToggleWishlist(product)}
                                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Heart
                                    className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: page,
                          }))
                        }
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pagination.currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage + 1,
                    }))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Same filter content as desktop sidebar */}
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={filters.keyword}
                        onChange={(e) =>
                          handleFilterChange("keyword", e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            "minPrice",
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            "maxPrice",
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="space-y-2">
                      {ratings.map((rating) => (
                        <label
                          key={rating.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="rating-mobile"
                            checked={filters.rating === rating.value}
                            onChange={() =>
                              handleFilterChange("rating", rating.value)
                            }
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating.value
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                            <span className="text-sm">& Up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) =>
                          handleFilterChange("inStock", e.target.checked)
                        }
                      />
                      <span>In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.onSale}
                        onChange={(e) =>
                          handleFilterChange("onSale", e.target.checked)
                        }
                      />
                      <span>On Sale</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
