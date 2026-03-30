// app/dashboard/products/components/EmptyState.tsx
"use client";

import { motion } from "framer-motion";
import { Package, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateProduct: () => void;
  hasFilters?: boolean;
}

export function EmptyState({
  onCreateProduct,
  hasFilters = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        <Package size={32} className="text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {hasFilters ? "No products found" : "No products yet"}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "Get started by creating your first product. It's quick and easy!"}
      </p>

      {!hasFilters && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateProduct}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200"
        >
          <Plus size={18} />
          <span>Create Product</span>
        </motion.button>
      )}
    </motion.div>
  );
}
