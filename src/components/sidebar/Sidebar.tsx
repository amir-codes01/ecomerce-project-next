"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Users", href: "/dashboard/users" },
  { name: "Products", href: "/dashboard/products" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Categories", href: "/dashboard/categories" },
  { name: "Analytics", href: "/dashboard/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6 font-bold text-xl">Admin</div>

      <nav className="space-y-2 px-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === item.href
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
