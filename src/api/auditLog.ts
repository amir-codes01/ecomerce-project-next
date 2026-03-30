// frontend/api/auditLog.ts
import api from "./axios";

export interface AuditLog {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  action: string;
  ipAddress: string;
  userAgent: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  user?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface AuditLogStats {
  totalLogs: number;
  uniqueUsers: number;
  topActions: Array<{ _id: string; count: number }>;
  recentActivity: Array<{
    action: string;
    createdAt: string;
    ipAddress: string;
    userDetails: { name: string; email: string; profileImage?: string };
  }>;
  dailyActivity: Array<{ _id: string; count: number }>;
  hourlyActivity: Array<{ _id: number; count: number }>;
  weeklyActivity: Array<{ _id: number; count: number }>;
  actionBreakdown: Array<{ _id: string; count: number }>;
  topUsers: Array<{
    count: number;
    userDetails: { name: string; email: string; role: string };
  }>;
  period: number;
}

export interface AuditLogFiltersData {
  actions: string[];
  actionCategories: Record<string, string[]>;
  users: Array<{ _id: string; name: string; email: string; role: string }>;
}

export const auditLogApi = {
  getLogs: (filters: AuditLogFilters) =>
    api.get<{
      success: boolean;
      auditLogs: AuditLog[];
      uniqueActions: string[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    }>("/audit-logs", { params: filters }),

  getStats: (days?: number) =>
    api.get<{ success: boolean; stats: AuditLogStats }>("/audit-logs/stats", {
      params: { days },
    }),

  getLogById: (id: string) =>
    api.get<{ success: boolean; auditLog: AuditLog }>(`/audit-logs/${id}`),

  getUserActivity: (
    userId: string,
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
  ) =>
    api.get(`/audit-logs/users/${userId}`, {
      params: { page, limit, startDate, endDate },
    }),

  exportLogs: (filters: {
    startDate?: string;
    endDate?: string;
    format?: "json" | "csv";
    action?: string;
    user?: string;
  }) =>
    api.get("/audit-logs/export", {
      params: filters,
      responseType: "blob",
    }),

  getFilters: () =>
    api.get<{ success: boolean; filters: AuditLogFiltersData }>(
      "/audit-logs/filters",
    ),

  getAnalytics: (period?: "week" | "month" | "quarter" | "year") =>
    api.get("/audit-logs/analytics", { params: { period } }),
};
