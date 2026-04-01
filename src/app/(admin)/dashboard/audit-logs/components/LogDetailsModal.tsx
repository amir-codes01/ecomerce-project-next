// app/dashboard/audit-logs/components/LogDetailsModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe, Clock, Calendar, Info, Shield } from "lucide-react";
import { AuditLog } from "@/api/auditLog";
import { format } from "date-fns";

interface LogDetailsModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDetailsModal({
  log,
  isOpen,
  onClose,
}: LogDetailsModalProps) {
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
            {/* Header */}
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Action */}
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

              {/* User Info */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} />
                  User
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {log.user?.name || "System"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {log.user?.email || "system@example.com"}
                  </p>
                  {log.user?.role && (
                    <p className="text-xs text-gray-400 mt-1">
                      Role: {log.user.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe size={12} />
                    IP Address
                  </label>
                  <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                    {log.ipAddress || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} />
                    Timestamp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {format(
                      new Date(log.createdAt),
                      "EEEE, MMMM dd, yyyy HH:mm:ss",
                    )}
                  </p>
                </div>
              </div>

              {/* User Agent */}
              {log.userAgent && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User Agent
                  </label>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 break-all font-mono">
                    {log.userAgent}
                  </p>
                </div>
              )}

              {/* Metadata */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Info size={12} />
                    Additional Metadata
                  </label>
                  <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
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
}
