// app/dashboard/products/components/ProductFilters.tsx
"use client";

import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { ProductFilters as ProductFiltersType } from "@/types/product";
import { Category } from "@/types/category";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  categories: Category[];
  onFilterChange: (filters: Partial<ProductFiltersType>) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function ProductFilters({
  filters,
  categories,
  onFilterChange,
  showFilters,
  onToggleFilters,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products by name, brand, or description..."
            value={filters.keyword}
            onChange={(e) =>
              onFilterChange({ keyword: e.target.value, page: 1 })
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
            showFilters
              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {showFilters && <X size={14} className="ml-1" />}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  onFilterChange({ category: e.target.value, page: 1 })
                }
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value, page: 1 })
                }
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="createdAt">Date Created</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="averageRating">Rating</option>
                <option value="sold">Most Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order
              </label>
              <select
                value={filters.order}
                onChange={(e) =>
                  onFilterChange({
                    order: e.target.value as "asc" | "desc",
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
