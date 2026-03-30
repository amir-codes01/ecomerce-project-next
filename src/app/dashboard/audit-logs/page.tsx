// app/dashboard/audit-logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  Activity,
  Eye,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  auditLogApi,
  AuditLog,
  AuditLogFilters,
  AuditLogStats,
} from "@/api/auditLog";

// Stats Cards Component
const StatsCards = ({ stats }: { stats: AuditLogStats }) => {
  const cards = [
    {
      title: "Total Activities",
      value: stats.totalLogs.toLocaleString(),
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      delay: 0.1,
    },
    {
      title: "Active Users",
      value: stats.uniqueUsers.toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-500/10",
      delay: 0.2,
    },
    {
      title: "Unique Actions",
      value: stats.topActions.length,
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      delay: 0.3,
    },
    {
      title: "Peak Activity",
      value: `${Math.max(...stats.hourlyActivity.map((h) => h.count))}`,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
          className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg transition-all duration-300 group"
        >
          <div
            className={`absolute top-0 right-0 w-20 h-20 ${card.bgColor} rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
              <card.icon size={20} className={card.color} />
            </div>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {card.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Activity Chart Component
const ActivityChart = ({
  data,
}: {
  data: Array<{ _id: string; count: number }>;
}) => {
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
};

// Top Actions Chart Component
const TopActionsChart = ({
  data,
}: {
  data: Array<{ _id: string; count: number }>;
}) => {
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  const chartData = data.slice(0, 10).map((item) => ({
    name: item._id.split(".").pop()?.toUpperCase() || item._id,
    count: item.count,
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
};

// Recent Activity Component
const RecentActivity = ({
  activities,
}: {
  activities: AuditLogStats["recentActivity"];
}) => {
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
                  {format(new Date(activity.createdAt), "MMM dd, HH:mm")}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Audit Log Table Component
const AuditLogTable = ({
  logs,
  loading,
  onViewLog,
}: {
  logs: AuditLog[];
  loading: boolean;
  onViewLog: (log: AuditLog) => void;
}) => {
  const getActionColor = (action: string) => {
    if (action.includes("create"))
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    if (action.includes("update"))
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    if (action.includes("delete"))
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    if (action.includes("login"))
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
    return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
  };

  const formatAction = (action: string) => {
    return action
      .split(".")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" - ");
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading audit logs...
          </p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Eye size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No audit logs found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {logs.map((log, index) => (
              <motion.tr
                key={log._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                  >
                    {formatAction(log.action)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.user?.name || "System"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {log.user?.email || "system@example.com"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Globe size={12} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {log.ipAddress || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewLog(log)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Log Details Modal Component
const LogDetailsModal = ({
  log,
  isOpen,
  onClose,
}: {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!log) return null;

  const getActionColor = (action: string) => {
    if (action.includes("create")) return "text-green-600 dark:text-green-400";
    if (action.includes("update")) return "text-blue-600 dark:text-blue-400";
    if (action.includes("delete")) return "text-red-600 dark:text-red-400";
    if (action.includes("login")) return "text-purple-600 dark:text-purple-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const formatAction = (action: string) => {
    return action
      .split(".")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" - ");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Log Details
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Detailed information about this activity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </label>
                <p
                  className={`text-lg font-semibold mt-1 ${getActionColor(log.action)}`}
                >
                  {formatAction(log.action)}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> User
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {log.user?.name || "System"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {log.user?.email || "system@example.com"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe size={12} /> IP Address
                  </label>
                  <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                    {log.ipAddress || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} /> Timestamp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {format(
                      new Date(log.createdAt),
                      "EEEE, MMMM dd, yyyy HH:mm:ss",
                    )}
                  </p>
                </div>
              </div>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Metadata
                  </label>
                  <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Log ID: {log._id}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Page Component
export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [uniqueActions, setUniqueActions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"logs" | "analytics">("logs");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await auditLogApi.getLogs(filters);
      setLogs(response.data.auditLogs || []);
      setUniqueActions(response.data.uniqueActions || []);
      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0,
        itemsPerPage: response.data.pagination?.itemsPerPage || 20,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch audit logs",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await auditLogApi.getStats(30);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchLogs(), fetchStats()]);
    setRefreshing(false);
    toast.success("Audit logs refreshed");
  };

  const handleExport = async () => {
    try {
      const exportFilters = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        action: filters.action,
        user: filters.user,
        format: "csv" as const,
      };

      const response = await auditLogApi.exportLogs(exportFilters);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Audit logs exported successfully");
    } catch (error) {
      toast.error("Failed to export logs");
    }
  };

  const handleFilterChange = (newFilters: Partial<AuditLogFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    handleFilterChange({
      startDate: start ? start.toISOString() : undefined,
      endDate: end ? end.toISOString() : undefined,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    handleFilterChange({
      search: "",
      action: "",
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveFilters =
    filters.search || filters.action || filters.startDate || filters.endDate;

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Audit Logs
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track and monitor all system activities and user actions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg shadow-green-600/20 transition-all duration-200"
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
            activeTab === "logs"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Activity Logs
          {activeTab === "logs" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
            activeTab === "analytics"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Analytics
          {activeTab === "analytics" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>
      </div>

      {activeTab === "logs" ? (
        <>
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by action, IP address, or metadata..."
                  value={filters.search || ""}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
                  showFilters || hasActiveFilters
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Filter size={18} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Advanced Filters
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
                      >
                        <X size={12} /> Clear all
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Action Type
                      </label>
                      <select
                        value={filters.action || ""}
                        onChange={(e) =>
                          handleFilterChange({
                            action: e.target.value || undefined,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">All Actions</option>
                        {uniqueActions.map((action) => (
                          <option key={action} value={action}>
                            {action
                              .split(".")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" - ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Range
                      </label>
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholderText="Select date range"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          handleFilterChange({ sortBy: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="createdAt">Date & Time</option>
                        <option value="action">Action Type</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order
                      </label>
                      <select
                        value={filters.order}
                        onChange={(e) =>
                          handleFilterChange({
                            order: e.target.value as "asc" | "desc",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logs Table */}
          <AuditLogTable
            logs={logs}
            loading={loading}
            onViewLog={setSelectedLog}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems,
                )}{" "}
                of {pagination.totalItems} entries
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Analytics View */
        stats && (
          <div className="space-y-6">
            <ActivityChart data={stats.dailyActivity} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopActionsChart data={stats.topActions} />
              <RecentActivity activities={stats.recentActivity} />
            </div>
          </div>
        )
      )}

      {/* Log Details Modal */}
      <LogDetailsModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </motion.div>
  );
}
