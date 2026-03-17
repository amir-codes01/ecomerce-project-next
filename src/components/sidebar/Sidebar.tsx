"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderTree,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

interface Props {
  closeSidebar?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export default function Sidebar({
  closeSidebar,
  isCollapsed = false,
  onToggle,
}: Props) {
  const pathname = usePathname();

  const { user } = useAuth();
  console.log(user);

  return (
    <aside className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo Area */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          {isCollapsed ? (
            <span className="text-2xl font-bold text-blue-600">A</span>
          ) : (
            <>
              <span className="text-2xl font-bold text-blue-600">Admin</span>
              <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                Hub
              </span>
            </>
          )}
        </Link>

        {/* Toggle button - only show on desktop */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isCollapsed ? "justify-center" : "gap-3"}
                    ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
