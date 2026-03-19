"use client";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: Props) {
  // If all revenue is 0, show a friendly message
  if (!data || data.every((d) => d.revenue === 0)) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-6">
        No revenue data to display for the last 6 months.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Revenue Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            strokeWidth={3}
            stroke="#3B82F6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
