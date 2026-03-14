"use client";

import { Menu, Bell, Search, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

interface Props {
  openSidebar: () => void;
}

export default function Navbar({ openSidebar }: Props) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={openSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Page Title or Breadcrumb */}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:block">
            Dashboard
          </h2>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block relative max-w-md w-full mx-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200
              ${
                searchFocused
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-gray-200 dark:border-gray-700"
              }
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
            `}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
