// app/dashboard/audit-logs/components/RecentActivity.tsx
"use client";

import { motion } from "framer-motion";
import { Clock, User, Globe, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  activities: Array<{
    action: string;
    createdAt: string;
    ipAddress: string;
    userDetails: {
      name: string;
      email: string;
      profileImage?: string;
    };
  }>;
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    if (action.includes("create")) return "🟢";
    if (action.includes("update")) return "🔵";
    if (action.includes("delete")) return "🔴";
    if (action.includes("login")) return "🟣";
    return "⚪";
  };

  const formatAction = (action: string) => {
    return action
      .split(".")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" - ");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="text-xl">{getActionIcon(activity.action)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.userDetails.name}
                </p>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={10} />
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatAction(activity.action)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Globe size={10} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-mono">
                  {activity.ipAddress}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
