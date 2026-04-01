// app/dashboard/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { productApi } from "@/api/product";
import { categoryApi } from "@/api/category";
import { Product, ProductFilters } from "@/types/product";
import { Category } from "@/types/category";
import ProductModal from "@/components/modals/ProductModal";
import { ProductCard } from "./components/ProductCard";
import { ProductStats } from "./components/ProductStats";
import { ProductFilters as FiltersComponent } from "./components/ProductFilters";
import { ProductPagination } from "./components/ProductPagination";
import { EmptyState } from "./components/EmptyState";

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

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

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
      <ProductStats
        totalProducts={pagination.totalProducts}
        products={products}
      />

      {/* Search and Filters */}
      <FiltersComponent
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

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
        <EmptyState
          onCreateProduct={handleCreateProduct}
          hasFilters={!!(filters.keyword || filters.category)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                index={index}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <ProductPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalProducts={pagination.totalProducts}
              itemsPerPage={filters.limit || 10}
              onPageChange={(page) => handleFilterChange({ page })}
            />
          )}
        </>
      )}
    </motion.div>
  );
}
