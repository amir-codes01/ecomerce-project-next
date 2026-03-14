"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

interface Props {
  openSidebar: () => void;
}

export default function Navbar({ openSidebar }: Props) {
  const { logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button */}
        <button onClick={openSidebar} className="lg:hidden">
          <Menu size={24} />
        </button>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-2 border rounded-lg"
        />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="text-xl">🔔</button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
