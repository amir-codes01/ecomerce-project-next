"use client";

import api from "@/api/axios";
import DataTable from "@/components/tables/DataTable";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, RefreshCw, Shield, Mail, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import UserModal from "@/components/modals/UserModal";
import { useAuth } from "@/auth/AuthContext";

export interface User {
  _id?: string;
  username: string;
  email: string;
  role?: string;
  status?: string;
  createdAt?: string;
  avatar?: string;
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useAuth();

  const columns = [
    {
      header: "User",
      accessor: "username",
      sortable: true,
      cell: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      cell: (value: string) => {
        const roleColors = {
          admin:
            "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
          user: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
          superadmin:
            "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400",
          moderator:
            "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400",
        };

        const color =
          roleColors[value?.toLowerCase() as keyof typeof roleColors] ||
          "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      cell: (value: string = "Active") => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
          ${value === "Active" ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400" : ""}
          ${value === "Inactive" ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" : ""}
          ${value === "Pending" ? "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" : ""}
        `}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full
            ${value === "Active" ? "bg-green-500" : ""}
            ${value === "Inactive" ? "bg-gray-500" : ""}
            ${value === "Pending" ? "bg-yellow-500" : ""}
          `}
          />
          {value}
        </span>
      ),
    },
    {
      header: "Joined",
      accessor: "createdAt",
      sortable: true,
      cell: (value: string) => {
        if (!value) return "N/A";
        const date = new Date(value);
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={14} />
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
  ];

  async function getUsers() {
    try {
      setLoading(true);
      const res = await api.get("/users/");
      // Add mock status and createdAt if not present in your data
      const enhancedData = res.data.data.map((user: User) => ({
        ...user,
      }));
      setData(enhancedData);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await getUsers();
    setRefreshing(false);
    toast.success("Users list refreshed");
  }

  function handleAddUser() {
    setSelectedUser(null); // reset
    setOpen(true);
  }

  function handleEditUser(row: User) {
    setSelectedUser(row);
    setOpen(true);
  }

  async function handleDeleteUser(row: User) {
    if (confirm(`Are you sure you want to delete ${row.username}?`)) {
      try {
        // await api.delete(`/users/${row._id || row.id}`);
        toast.success(`User ${row.username} deleted successfully`);
        // Refresh the list
        getUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, []); // Added empty dependency array to prevent infinite loop

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <UserModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedUser(null);
        }}
        currentUser={user}
        onSuccess={getUsers}
        mode={selectedUser ? "edit" : "create"}
        user={selectedUser || undefined}
      />
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your users, roles, and permissions
          </p>
        </div>

        {/* Action Buttons */}
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
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Users
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {data.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Users
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {data.filter((u) => u.status === "active").length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {data.filter((u) => u.role?.toLowerCase() === "admin").length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            New This Month
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            12
          </p>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        title="All Users"
        onEdit={handleEditUser}
        onDelete={user?.role === "superadmin" ? handleDeleteUser : undefined}
        actions={true}
        showSearch={true}
        showFilters={true}
        showExport={true}
        itemsPerPage={10}
      />

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading users...
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
