"use client";

import { useState, useRef } from "react";
import { User, LogOut, Settings, ShoppingBag, UserCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuth } from "@/auth/AuthContext"; // Adjust import path as needed

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, loading } = useAuth();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // User is logged in
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium dark:text-white">
                {user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>

            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
