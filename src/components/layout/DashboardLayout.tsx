"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed z-50 inset-y-0 left-0 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar openSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
