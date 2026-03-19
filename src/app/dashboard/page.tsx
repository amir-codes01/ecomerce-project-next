"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, Download } from "lucide-react";
import api from "@/api/axios";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");

        const data = res.data.data;

        if (!data) {
          console.error("Dashboard data missing", res.data);
          return;
        }

        const formatted = [
          {
            title: "Total Users",
            value: data.totals.users.toLocaleString(),
            trend: {
              value: Math.abs(data.trends.users).toFixed(1),
              isPositive: data.trends.users >= 0,
            },
          },
          {
            title: "Total Orders",
            value: data.totals.orders.toLocaleString(),
            trend: {
              value: Math.abs(data.trends.orders).toFixed(1),
              isPositive: data.trends.orders >= 0,
            },
          },
          {
            title: "Products",
            value: data.totals.products.toLocaleString(),
            trend: {
              value: Math.abs(data.trends.products).toFixed(1),
              isPositive: data.trends.products >= 0,
            },
          },
          {
            title: "Revenue",
            value: `$${data.totals.revenue.toLocaleString()}`,
            trend: {
              value: Math.abs(data.trends.revenue).toFixed(1),
              isPositive: data.trends.revenue >= 0,
            },
          },
        ];

        setStatsData(formatted);
      } catch (error: any) {
        console.error("Dashboard error:", error);

        // optional toast or UI error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))
          : statsData.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
              />
            ))}
      </div>
    </div>
  );
}
