// app/dashboard/audit-logs/components/ActivityChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";

interface ActivityChartProps {
  data: Array<{ _id: string; count: number }>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data.map((item) => ({
    date: format(new Date(item._id), "MMM dd"),
    activities: item.count,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Activity Timeline (Last 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
          />
          <Area
            type="monotone"
            dataKey="activities"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#colorActivities)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
