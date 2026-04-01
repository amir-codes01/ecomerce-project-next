"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // 👉 Replace with real cart state
  const cartItemsCount = 3;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Shop<span className="text-yellow-500">Hub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="hover:text-yellow-500">
              Products
            </Link>
            <Link href="/categories" className="hover:text-yellow-500">
              Categories
            </Link>
            <Link href="/deals" className="hover:text-yellow-500">
              Deals
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link href="/login">
              <User className="w-6 h-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Links */}
          <nav className="flex flex-col gap-3">
            <Link href="/products" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/categories" onClick={() => setIsOpen(false)}>
              Categories
            </Link>
            <Link href="/deals" onClick={() => setIsOpen(false)}>
              Deals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
