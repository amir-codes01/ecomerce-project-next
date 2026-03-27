// api/product.ts
import api from "./axios";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  ProductsResponse,
} from "@/types/product";

export const productApi = {
  // Get all products with filters
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/products?${params.toString()}`);
    return response.data.data;
  },

  // Get single product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/${slug}`);
    return response.data.data;
  },

  // Create product with images
  createProduct: async (data: CreateProductDto): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    if (data.brand) formData.append("brand", data.brand);
    if (data.discountPrice)
      formData.append("discountPrice", data.discountPrice.toString());
    if (data.isFeatured)
      formData.append("isFeatured", data.isFeatured.toString());
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Update product
  updateProduct: async (
    slug: string,
    data: UpdateProductDto,
  ): Promise<Product> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price) formData.append("price", data.price.toString());
    if (data.stock) formData.append("stock", data.stock.toString());
    if (data.category) formData.append("category", data.category);
    if (data.brand) formData.append("brand", data.brand);
    if (data.discountPrice !== undefined)
      formData.append("discountPrice", data.discountPrice.toString());
    if (data.isFeatured !== undefined)
      formData.append("isFeatured", data.isFeatured.toString());
    if (data.isActive !== undefined)
      formData.append("isActive", data.isActive.toString());
    if (data.removeImages && data.removeImages.length > 0) {
      formData.append("removeImages", JSON.stringify(data.removeImages));
    }
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await api.put(`/products/${slug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Soft delete product
  deleteProduct: async (slug: string): Promise<void> => {
    await api.delete(`/products/${slug}`);
  },

  // Hard delete product
  hardDeleteProduct: async (slug: string): Promise<void> => {
    await api.delete(`/products/${slug}/hard-delete`);
  },

  // Add images to product
  addProductImages: async (slug: string, images: File[]): Promise<Product> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post(`/products/${slug}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  // Remove images from product
  removeProductImages: async (
    slug: string,
    imagePublicIds: string[],
  ): Promise<Product> => {
    const response = await api.delete(`/products/${slug}/images`, {
      data: { imagePublicIds },
    });
    return response.data.data;
  },

  // Reorder product images
  reorderProductImages: async (
    slug: string,
    imageOrder: string[],
  ): Promise<Product> => {
    const response = await api.put(`/products/${slug}/images/reorder`, {
      imageOrder,
    });
    return response.data.data;
  },

  // Set primary image
  setPrimaryImage: async (slug: string, publicId: string): Promise<Product> => {
    const response = await api.put(`/products/${slug}/images/primary`, {
      publicId,
    });
    return response.data.data;
  },
};
