"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import { Heart, ShoppingBag, User } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import MobileMenu from "./MobileMenu";
import UserDropdown from "./UserDropdown";

const navLinks = [
  { href: "/", label: "Shop" },
  // { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals", highlight: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalCount());
  const wishlistCount = useWishlistStore((state) => state.getTotalCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (!mounted) return null;
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold  bg-blue-600  bg-clip-text text-transparent">
              ShopHub
            </span>
          </Link>
          <div className="hidden lg:flex items-center space-x-1 ml-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${isActive ? "text-blue-600 dark:text-blue-400" : "  text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="hidden lg:block">
              <CategoriesMegaMenu />
            </div>
          </div>
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2">
            <UserDropdown />
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <MobileMenu cartCount={cartCount} wishlistCount={wishlistCount} />
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
