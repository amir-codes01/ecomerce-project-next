"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="/Golden hour at the boutique.png" // replace with your image
        alt="Hero Banner"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-xl text-white">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1 text-sm bg-white/20 backdrop-blur-md rounded-full"
          >
            🔥 Big Sale is Live
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Upgrade Your Style <br />
            <span className="text-yellow-400">Up to 50% Off</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-4 text-lg text-gray-200"
          >
            Discover the latest trends in fashion, electronics, and more. Shop
            now and enjoy exclusive deals.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Shop Now
            </Link>

            <Link
              href="/products?sort=new"
              className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"
            >
              New Arrivals
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
