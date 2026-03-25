// api/category.ts
import api from "./axios";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category";

export const categoryApi = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get("/category");
    return response.data.data;
  },

  // Get single category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/category/${slug}`);
    return response.data.data[0];
  },

  // Create new category
  createCategory: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post("/category", data);
    return response.data.data;
  },

  // Update category
  updateCategory: async (
    slug: string,
    data: UpdateCategoryDto,
  ): Promise<Category> => {
    const response = await api.put(`/category/${slug}`, data);
    return response.data.data;
  },

  // Delete category (soft delete)
  deleteCategory: async (slug: string): Promise<void> => {
    await api.delete(`/category/${slug}`);
  },
};
