"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { categoryApi } from "@/api/category";

// 👉 Define type (IMPORTANT)
interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    public_id: string;
    url: string;
  };
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();

        // adjust based on your API response
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories(); // ✅ CALL FUNCTION
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Heading */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">Shop by Categories</h2>
        <Link href="/categories" className="text-yellow-500 hover:underline">
          View All
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 md:h-36 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative w-full h-32 md:h-36 rounded-xl overflow-hidden">
                  {/* Image */}
                  <img
                    src={category.image?.url}
                    alt={category.name}
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                  {/* Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm md:text-base">
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
