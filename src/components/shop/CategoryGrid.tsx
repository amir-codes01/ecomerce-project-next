// components/CategoryGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryApi } from "@/api/category";
import { Category } from "@/types/category";

// Predefined gradient colors for categories
const categoryColors = [
  "from-pink-500 to-rose-500 opacity-20",
  "from-blue-500 to-cyan-500 opacity-20",
  "from-purple-500 to-indigo-500 opacity-20",
  "from-amber-500 to-orange-500 opacity-20",
  "from-green-500 to-emerald-500 opacity-20",
  "from-red-500 to-pink-500 opacity-20",
  "from-indigo-500 to-purple-500 opacity-20",
  "from-teal-500 to-green-500 opacity-20",
  "from-orange-500 to-red-500 opacity-20",
  "from-cyan-500 to-blue-500 opacity-20",
];

// Extended category type with additional fields
interface ExtendedCategory extends Category {
  color?: string;
  productCount?: number;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAllCategories();
      console.log("Categories from API:", response);

      // Filter only active categories
      const activeCategories = response.filter((cat) => cat.isActive !== false);

      // Map and add color and product count
      const mappedCategories: ExtendedCategory[] = activeCategories.map(
        (category, index) => ({
          ...category,
          // Assign color based on index (will be consistent per category)
          color: categoryColors[index % categoryColors.length],
          // TODO: Replace with actual product count from your backend
          // You might need to make an additional API call or have backend include this
          productCount:
            category.subCategories?.length ||
            Math.floor(Math.random() * 500) + 50,
        }),
      );

      console.log(mappedCategories);
      setCategories(mappedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Display only first 6 categories if not showing all
  const displayedCategories = showAll ? categories : categories.slice(0, 6);
  const hasMoreCategories = categories.length > 6;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our wide range of products across different categories
          </motion.p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg"
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="relative h-80 w-full">
                  {/* Category Image */}
                  {category.image?.url ? (
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                  )}

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t ${category.color || "from-gray-700 to-gray-900"} opacity-80`}
                  />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-3">
                      {category.productCount || 0} Products
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {hasMoreCategories && !showAll && (
          <div className="text-center mt-12">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Categories ({categories.length})
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && (
          <div className="text-center mt-12">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setShowAll(false)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Show Less
              <ArrowRight className="h-4 w-4 rotate-90" />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
