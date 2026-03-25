// types/category.ts
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
    public_id: string;
  };
  parent?: string | Category | null;
  isActive: boolean;
  subCategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  image?: {
    url: string;
    public_id: string;
  };
  parent?: string | null;
}

export interface UpdateCategoryDto {
  name?: string;
  image?: {
    url: string;
    public_id: string;
  };
  parent?: string | null;
  isActive?: boolean;
}

export interface CategoryFormData {
  name: string;
  image?: File | null;
  parent?: string;
}
