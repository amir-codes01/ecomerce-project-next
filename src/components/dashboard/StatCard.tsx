"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, Package, DollarSign } from "lucide-react";

interface Props {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const iconMap = {
  "Total Users": Users,
  "Total Orders": ShoppingBag,
  Products: Package,
  Revenue: DollarSign,
};

const colorMap = {
  "Total Users": "blue",
  "Total Orders": "green",
  Products: "purple",
  Revenue: "orange",
};

export default function StatCard({ title, value, trend }: Props) {
  const Icon = iconMap[title as keyof typeof iconMap] || Users;
  const color = colorMap[title as keyof typeof colorMap] || "blue";

  const colors = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-xl ${colors[color as keyof typeof colors]}`}
        >
          <Icon size={24} />
        </div>

        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}
