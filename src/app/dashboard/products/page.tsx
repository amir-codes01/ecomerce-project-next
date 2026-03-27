// app/dashboard/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  RefreshCw,
  Package,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  DollarSign,
  Archive,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "@/api/product";
import { categoryApi } from "@/api/category";
import { Product, ProductFilters } from "@/types/product";
import { Category } from "@/types/category";
import ProductModal from "@/components/modals/ProductModal";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    keyword: "",
    category: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts(filters);
      setProducts(data.products);
      setPagination({
        totalProducts: data.totalProducts,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    toast.success("Products refreshed");
  };

  const handleCreateProduct = () => {
    setSelectedProduct(undefined);
    setModalMode("create");
    setOpenModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setOpenModal(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productApi.deleteProduct(product.slug);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete product",
        );
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 1 });
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({ ...filters, category, page: 1 });
  };

  const handleSort = (sortBy: string) => {
    setFilters({ ...filters, sortBy, page: 1 });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters.page, filters.keyword, filters.category, filters.sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ProductModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchProducts}
        mode={modalMode}
        product={selectedProduct}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your products, inventory, and pricing
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
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            <Plus size={16} />
            <span>Add Product</span>
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </p>
            <Package size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {pagination.totalProducts}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Low Stock
            </p>
            <Archive size={20} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {products.filter((p) => p.stock < 10).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">On Sale</p>
            <Tag size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {
              products.filter((p) => p.discountPrice && p.discountPrice > 0)
                .length
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Avg Rating
            </p>
            <Star size={20} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {(
              products.reduce((acc, p) => acc + p.averageRating, 0) /
                products.length || 0
            ).toFixed(1)}
          </p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products by name, brand, or description..."
            value={filters.keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="createdAt">Date Created</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="averageRating">Rating</option>
                <option value="sold">Most Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order
              </label>
              <select
                value={filters.order}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    order: e.target.value as "asc" | "desc",
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Package size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No products found</p>
          <button
            onClick={handleCreateProduct}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </div>
                )}

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.numReviews})
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {product.category?.name}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    {product.discountPrice ? (
                      <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(product.discountPrice)}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Archive size={14} />
                    <span>{product.stock} left</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.currentPage - 1) * filters.limit! + 1} to{" "}
            {Math.min(
              pagination.currentPage * filters.limit!,
              pagination.totalProducts,
            )}{" "}
            of {pagination.totalProducts} products
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                pagination.currentPage === 1
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    pagination.currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`p-2 rounded-lg transition-colors ${
                pagination.currentPage === pagination.totalPages
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
