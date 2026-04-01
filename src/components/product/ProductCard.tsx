"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

// ✅ Match backend schema
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: { url: string }[];
  averageRating: number;
  numReviews: number;
  isFeatured?: boolean;
}

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const displayPrice = hasDiscount
    ? (product.discountPrice ?? product.price)
    : product.price;

  const imageUrl = product.images?.[0]?.url || "/placeholder.jpg";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
    >
      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}

        {/* Featured Badge */}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}

        {/* Out of Stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm md:text-base font-semibold line-clamp-2 hover:text-yellow-500 transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{product.averageRating.toFixed(1)}</span>
          <span>({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            Rs {displayPrice.toLocaleString()}
          </span>

          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              Rs {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          disabled={product.stock === 0}
          onClick={() => onAddToCart?.(product)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
