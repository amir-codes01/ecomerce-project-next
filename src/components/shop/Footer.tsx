// components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  Apple,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Gift,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

interface FooterProps {
  companyName?: string;
  companyLogo?: string;
  darkMode?: boolean;
}

export default function Footer({
  companyName = "ShopHub",
  companyLogo,
  darkMode = false,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Successfully subscribed to newsletter!");
    setEmail("");
    setIsSubscribing(false);
  };

  // Quick links
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Blog", href: "/blog" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
  ];

  // Shop by category
  const shopLinks = [
    { name: "Women's Fashion", href: "/category/womens-fashion" },
    { name: "Men's Clothing", href: "/category/mens-fashion" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Home & Living", href: "/category/home-living" },
    { name: "Sports & Outdoors", href: "/category/sports" },
    { name: "Beauty & Care", href: "/category/beauty" },
    { name: "New Arrivals", href: "/products?sort=new" },
    { name: "Best Sellers", href: "/products?sort=bestsellers" },
  ];

  // Customer service
  const customerServiceLinks = [
    { name: "Track Order", href: "/track-order" },
    { name: "My Account", href: "/account" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Cart", href: "/cart" },
    { name: "Help Center", href: "/help" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Payment Methods", href: "/payment-methods" },
    { name: "Gift Cards", href: "/gift-cards" },
  ];

  // Social media links
  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "Linkedin",
      icon: Linkedin,
      href: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
    {
      name: "Youtube",
      icon: Youtube,
      href: "https://youtube.com",
      color: "hover:text-red-600",
    },
  ];

  // Payment methods
  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "💰" },
    { name: "Apple Pay", icon: "📱" },
    { name: "Google Pay", icon: "📱" },
    { name: "American Express", icon: "💳" },
  ];

  // Features
  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over $100" },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <div className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Logo */}
              <Link href="/" className="inline-block">
                {companyLogo ? (
                  <div className="relative h-12 w-32">
                    <Image
                      src={companyLogo}
                      alt={companyName}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {companyName}
                  </h2>
                )}
              </Link>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your one-stop destination for quality products at competitive
                prices. We're committed to providing the best shopping
                experience with exceptional customer service.
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm">
                    123 Commerce Street, New York, NY 10001
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm">support@shophub.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      <span className="text-sm group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Shop
              </h3>
              <ul className="space-y-2">
                {shopLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      <span className="text-sm group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2">
                {customerServiceLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      <span className="text-sm group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Subscribe to get special offers, free giveaways, and exclusive
                deals.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="absolute right-1 top-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {isSubscribing ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </form>

              {/* App Download */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Download App
                </p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    <Apple className="h-5 w-5 text-white" />
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Download on</p>
                      <p className="text-xs text-white font-semibold">
                        App Store
                      </p>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    <Smartphone className="h-5 w-5 text-white" />
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Get it on</p>
                      <p className="text-xs text-white font-semibold">
                        Google Play
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Payment Methods:
              </span>
              <div className="flex gap-2">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400"
                  >
                    {method.icon} {method.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>SSL Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {companyName}. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link
                href="/cookies"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cookie Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link
                href="/sitemap"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 animate-pulse" />{" "}
              by {companyName}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowRight className="h-5 w-5 -rotate-90" />
      </motion.button>
    </footer>
  );
}
