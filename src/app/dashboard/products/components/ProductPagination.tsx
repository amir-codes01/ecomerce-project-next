// app/dashboard/products/components/ProductPagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  onPageChange,
}: ProductPaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalProducts}</span> products
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === pageNum
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
