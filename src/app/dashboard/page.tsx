"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { motion } from "framer-motion";
import { Calendar, Download } from "lucide-react";

const statsData = [
  {
    title: "Total Users",
    value: "1,245",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Total Orders",
    value: "532",
    trend: { value: 8, isPositive: true },
  },
  { title: "Products", value: "89", trend: { value: 3, isPositive: false } },
  { title: "Revenue", value: "$48.5K", trend: { value: 23, isPositive: true } },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Calendar size={16} />
            <span>Last 30 days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Rest of your dashboard content... */}
    </div>
  );
}
