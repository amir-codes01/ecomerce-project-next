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
    return response.data.data;
  },

  // Create new category with image
  createCategory: async (data: CreateCategoryDto): Promise<Category> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.parent) formData.append("parent", data.parent);
    if (data.image) formData.append("image", data.image);

    const response = await api.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Update category with optional image
  updateCategory: async (
    slug: string,
    data: UpdateCategoryDto,
  ): Promise<Category> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.parent !== undefined) formData.append("parent", data.parent || "");
    if (data.image) formData.append("image", data.image);
    if (data.isActive !== undefined)
      formData.append("isActive", String(data.isActive));

    const response = await api.put(`/category/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Delete category (soft delete)
  deleteCategory: async (slug: string): Promise<void> => {
    await api.delete(`/category/${slug}`);
  },
};
