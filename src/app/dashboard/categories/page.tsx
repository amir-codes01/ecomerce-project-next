"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  RefreshCw,
  FolderTree,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  ChevronDown,
  Folder,
} from "lucide-react";
import toast from "react-hot-toast";
import { categoryApi } from "@/api/category";
import { Category } from "@/types/category";
import CategoryModal from "@/components/modals/CategoryModal";
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
    toast.success("Categories refreshed");
  };

  const handleCreateCategory = () => {
    setSelectedCategory(undefined);
    setModalMode("create");
    setOpenModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setOpenModal(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await categoryApi.deleteCategory(category.slug);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete category",
        );
      }
    }
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map();
    const roots: Category[] = [];

    categories.forEach((category) => {
      categoryMap.set(category._id, { ...category, subCategories: [] });
    });

    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category._id);
      if (category.parent && typeof category.parent !== "string") {
        const parent = categoryMap.get(category.parent._id);
        if (parent) {
          parent.subCategories = parent.subCategories || [];
          parent.subCategories.push(categoryWithChildren);
        }
      } else if (!category.parent) {
        roots.push(categoryWithChildren);
      }
    });

    return roots;
  };

  const categoryTree = buildCategoryTree(categories);

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <motion.div
        key={category._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${level > 0 ? "ml-8" : ""}`}
        >
          <div className="flex items-center gap-3 flex-1">
            {category.subCategories && category.subCategories.length > 0 && (
              <button
                onClick={() => toggleExpand(category._id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {expandedCategories.has(category._id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}
            {!category.subCategories?.length && <div className="w-6" />}

            {category.image?.url ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={category.image.url}
                  alt={category.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Folder size={20} className="text-white" />
              </div>
            )}

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Slug: {category.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.isActive
                  ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </span>

            <button
              onClick={() => handleEditCategory(category)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => handleDeleteCategory(category)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {expandedCategories.has(category._id) && category.subCategories && (
          <div className="ml-8">
            {renderCategoryTree(category.subCategories, level + 1)}
          </div>
        )}
      </motion.div>
    ));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <CategoryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchCategories}
        mode={modalMode}
        category={selectedCategory}
        categories={categories}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Organize your products with categories and subcategories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateCategory}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Categories
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {categories.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Categories
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {categories.filter((c) => c.isActive).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Parent Categories
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {categories.filter((c) => !c.parent).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Subcategories
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {categories.filter((c) => c.parent).length}
          </p>
        </motion.div>
      </div>

      {/* Categories Tree Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FolderTree size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Category Structure
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading categories...
              </p>
            </div>
          </div>
        ) : categoryTree.length === 0 ? (
          <div className="p-8 text-center">
            <FolderTree size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No categories found
            </p>
            <button
              onClick={handleCreateCategory}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Create your first category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {renderCategoryTree(categoryTree)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
