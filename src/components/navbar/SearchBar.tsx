"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockProducts = [
  { id: "1", name: "Wireless Headphones", category: "Electronics" },
  { id: "2", name: "Smart Watch", category: "Electronics" },
  { id: "3", name: "Cotton T-Shirt", category: "Clothing" },
  { id: "4", name: "Running Shoes", category: "Footwear" },
  { id: "5", name: "Coffee Maker", category: "Home & Kitchen" },
];

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof mockProducts>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          aria-label="Search products"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
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
            ) : suggestions.length > 0 ? (
              // Results UI
              suggestions.map((product) => (
                <button
                  key={product.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    setQuery(product.name);
                    setIsOpen(false);
                    onClose?.();
                  }}
                >
                  <p className="text-sm font-medium dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {product.category}
                  </p>
                </button>
              ))
            ) : query.length > 0 ? (
              // No Results UI
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No products found
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
