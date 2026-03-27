// types/product.ts
export interface ProductImage {
  url: string;
  public_id: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  stock: number;
  description: string;
  price: number;
  discountPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: string;
  sold: number;
  images: ProductImage[];
  averageRating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  discountPrice?: number;
  isFeatured?: boolean;
  images?: File[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  brand?: string;
  discountPrice?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: File[];
  removeImages?: string[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ProductsResponse {
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  products: Product[];
}
