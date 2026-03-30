// app/dashboard/products/components/ProductStats.tsx
"use client";

import { motion } from "framer-motion";
import { Package, Archive, Tag, Star } from "lucide-react";
import { Product } from "@/types/product";

interface ProductStatsProps {
  totalProducts: number;
  products: Product[];
}

export function ProductStats({ totalProducts, products }: ProductStatsProps) {
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      delay: 0.1,
    },
    {
      title: "Low Stock",
      value: products.filter((p) => p.stock < 10 && p.stock > 0).length,
      icon: Archive,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-500/10",
      delay: 0.2,
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
      icon: Tag,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-500/10",
      delay: 0.3,
    },
    {
      title: "Avg Rating",
      value: (
        products.reduce((acc, p) => acc + p.averageRating, 0) /
          products.length || 0
      ).toFixed(1),
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg transition-all duration-300 group"
        >
          <div
            className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
