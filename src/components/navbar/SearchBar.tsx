"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { productApi } from "@/api/product";
import { Product } from "@/types/product";
import Router from "next/router";
import Link from "next/link";

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsloading(true);
    setError(null);

    try {
      const response = await productApi.getProducts({
        keyword: searchQuery,
        limit: 10, // Limit suggestions to 10 products
      });

      setSuggestions(response.products || []);
      setIsOpen(true);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search products");
      setSuggestions([]);
    } finally {
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  const handleFocus = () => {
    if (query.length > 0 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleProductSelect = (product: Product) => {
    setQuery(product.name);
    setIsOpen(false);
    onClose?.();
    // You can also navigate to the product page here
    Router.push(`/products/${product.slug}`);
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          aria-label="Search products"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {isLoading ? (
              // Loading UI
              <div className="flex items-center justify-center gap-2 p-4">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Searching...
                </p>
              </div>
            ) : error ? (
              // Error UI
              <div className="p-4 text-center">
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={() => searchProducts(query)}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                >
                  Try again
                </button>
              </div>
            ) : suggestions.length > 0 ? (
              // Results UI
              <div>
                {suggestions.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                  >
                    <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.brand}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.discountPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ${product.discountPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {product.stock > 0 ? (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 dark:text-red-400">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length > 0 ? (
              // No Results UI
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No products found for "{query}"
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try searching with different keywords
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
