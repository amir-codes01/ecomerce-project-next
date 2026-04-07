"use client";

import { categoryApi } from "@/api/category";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Category } from "@/types/category";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CategoriesMegaMenu() {
  const [categories, setCategories] = useState<Record<string, any[]>>({});
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  useClickOutside(menuRef, () => setIsOpen(false));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getAllCategories();
        console.log("Categories from API:", response);

        const mockCategories = response.filter((cat) => cat.isActive !== false);

        const grouped: Record<string, any[]> = {};

        const parents = mockCategories.filter((cat) => cat.parent === null);
        parents.forEach((parent) => {
          grouped[parent.name] = mockCategories
            .filter((cat) => {
              const id = cat.parent as Category | null;
              return id?._id === parent._id;
            })
            .map((sub) => ({
              ...sub,
              parentSlug: parent.slug,
            }));
        });
        console.log(grouped);

        setCategories(grouped);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        aria-label="Categories"
        aria-expanded={isOpen}
      >
        Categories
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute -left-50 mt-2 w-150 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="grid grid-cols-4 gap-6 p-6">
              {Object.entries(categories).map(([category, subcategories]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {subcategories.slice(0, 10).map((sub) => (
                      <li key={sub._id}>
                        <Link
                          href={`/category/${sub.parentSlug}/${sub.slug}`}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                    {subcategories.length > 10 && (
                      <Link
                        href={`/category/${category.toLowerCase().replace("", "-")}`}
                        className="block text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                        onClick={() => setIsOpen(false)}
                      >
                        View all ({subcategories.length})...
                      </Link>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
