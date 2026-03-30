// app/dashboard/audit-logs/components/TopActionsChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopActionsChartProps {
  data: Array<{ _id: string; count: number }>;
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export function TopActionsChart({ data }: TopActionsChartProps) {
  const chartData = data.slice(0, 10).map((item) => ({
    name: item._id.split(".").pop()?.toUpperCase() || item._id,
    count: item.count,
    fullName: item._id,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Actions
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={90} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
            labelFormatter={(label) => `Action: ${label}`}
          />
          <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
