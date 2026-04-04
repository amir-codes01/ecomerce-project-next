"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const categories = {
  Electronics: [
    "Smartphones",
    "Laptops",
    "Headphones",
    "Cameras",
    "Accessories",
  ],
  Clothing: ["Men's", "Women's", "Kids'", "Shoes", "Accessories"],
  "Home & Kitchen": ["Furniture", "Cookware", "Decor", "Appliances", "Bedding"],
  Sports: ["Fitness", "Outdoor", "Team Sports", "Swimming", "Yoga"],
};

export default function CategoriesMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
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
            className="absolute left-0 mt-2 w-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="grid grid-cols-4 gap-6 p-6">
              {Object.entries(categories).map(([category, subcategories]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`/category/${category.toLowerCase()}/${sub.toLowerCase()}`}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
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
