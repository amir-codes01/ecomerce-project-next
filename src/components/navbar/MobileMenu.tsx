"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";

interface MobileMenuProps {
  cartCount: number;
  wishlistCount: number;
}

export default function MobileMenu({
  cartCount,
  wishlistCount,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/deals", label: "Deals" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 shadow-xl lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <SearchBar onClose={() => setIsOpen(false)} />

                <nav className="mt-6 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    href="/wishlist"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
