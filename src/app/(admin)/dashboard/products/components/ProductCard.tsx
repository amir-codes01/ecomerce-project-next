// app/dashboard/products/components/ProductCard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Star,
  Archive,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView?: (product: Product) => void;
  index: number;
  variant?: "default" | "compact" | "featured";
  showActions?: boolean;
  showQuickView?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onView,
  index,
  variant = "default",
  showActions = true,
  showQuickView = true,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        label: "Out of Stock",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        icon: AlertTriangle,
      };
    }
    if (product.stock < 10) {
      return {
        label: `Only ${product.stock} left`,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        icon: AlertTriangle,
      };
    }
    if (product.stock < 50) {
      return {
        label: `${product.stock} in stock`,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        icon: Archive,
      };
    }
    return {
      label: "In Stock",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      icon: Archive,
    };
  };

  const stockStatus = getStockStatus();
  const isNewProduct =
    Date.now() - new Date(product.createdAt).getTime() <
    7 * 24 * 60 * 60 * 1000;
  const isBestSeller = product.sold > 100;

  const getRatingStars = () => {
    const fullStars = Math.floor(product.averageRating);
    const hasHalfStar = product.averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={14}
            className="text-yellow-400 fill-current"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={14} className="text-gray-300 dark:text-gray-600" />
            <Star
              size={14}
              className="absolute top-0 left-0 text-yellow-400 fill-current overflow-hidden"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={14}
            className="text-gray-300 dark:text-gray-600"
          />
        ))}
      </div>
    );
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return {
          container: "flex gap-3 p-3",
          image: "w-20 h-20 rounded-lg",
          content: "flex-1",
        };
      case "featured":
        return {
          container: "col-span-full lg:col-span-2",
          image: "aspect-[16/9]",
          content: "p-6",
        };
      default:
        return {
          container: "flex flex-col",
          image: "aspect-square",
          content: "p-4",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300 ${variantStyles.container}`}
      >
        {/* Product Image Section */}
        <div
          className={`relative ${variantStyles.image} overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}
        >
          {images.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[currentImageIndex].url}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className={`object-cover transition-all duration-500 ${
                      isHovered ? "scale-110" : "scale-100"
                    } ${isImageLoading ? "blur-sm" : "blur-0"}`}
                    onLoad={() => setIsImageLoading(false)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 4}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Image Navigation Dots */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`transition-all duration-200 rounded-full ${
                        currentImageIndex === idx
                          ? "w-4 h-1.5 bg-white shadow-lg"
                          : "w-1.5 h-1.5 bg-white/60 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Navigation Arrows */}
              {hasMultipleImages && isHovered && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discountPrice && product.discountPrice > 0 && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg"
              >
                -{discountPercentage}% OFF
              </motion.div>
            )}
            {isNewProduct && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1"
              >
                <Clock size={10} />
                New
              </motion.div>
            )}
            {isBestSeller && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1"
              >
                <TrendingUp size={10} />
                Bestseller
              </motion.div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            {showQuickView && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowQuickViewModal(true)}
                className="w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all"
              >
                <Eye size={14} className="text-gray-700 dark:text-gray-300" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all"
            >
              <Heart size={14} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all"
            >
              <Share2 size={14} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Product Info */}
        <div className={variantStyles.content}>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {getRatingStars()}
              <span className="text-xs text-gray-500 ml-1">
                ({product.numReviews} reviews)
              </span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}
            >
              {stockStatus.label}
            </span>
          </div>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="block group/title"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {product.category.name}
            </p>
          )}

          {/* Description Preview */}
          {variant === "featured" && product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price Section */}
          <div className="flex items-center flex-wrap justify-between mb-3">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(product.discountPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Archive size={14} className={stockStatus.color} />
              <span className={stockStatus.color}>
                {product.stock > 0 ? `${product.stock} left` : "Sold Out"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Edit size={14} />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDelete(product)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
              >
                <Trash2 size={14} />
                Delete
              </motion.button>
            </div>
          )}
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickViewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQuickViewModal(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={images[0]?.url || "/placeholder-image.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {product.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      {getRatingStars()}
                      <span className="text-sm text-gray-500">
                        ({product.numReviews} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Category: {product.category?.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Stock: {product.stock} units
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    {product.discountPrice ? (
                      <>
                        <span className="text-3xl font-bold text-green-600">
                          {formatPrice(product.discountPrice)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        onEdit(product);
                        setShowQuickViewModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={() => {
                        onView?.(product);
                        setShowQuickViewModal(false);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
