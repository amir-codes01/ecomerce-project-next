"use client";

import { useAuth } from "@/auth/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow">
      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-2 rounded-lg border"
      />

      <div className="flex items-center gap-4">
        <button className="relative">🔔</button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
