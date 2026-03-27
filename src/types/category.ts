// types/category.ts
export interface CategoryImage {
  url: string;
  public_id: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: CategoryImage;
  parent?: string | Category | null;
  isActive: boolean;
  subCategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  parent?: string | null;
  image?: File | null; // For form submission
}

export interface UpdateCategoryDto {
  name?: string;
  parent?: string | null;
  image?: File | null;
  isActive?: boolean;
}

export interface CategoryFormData {
  name: string;
  image?: File | null;
  parent?: string;
  existingImage?: CategoryImage;
}
