// components/modals/ProductModal.tsx
"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition, Listbox, Switch } from "@headlessui/react";
import {
  X,
  Package,
  ChevronsUpDown,
  Check,
  Upload,
  Trash2,
  XCircle,
  Tag,
  DollarSign,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductImage,
} from "@/types/product";
import { productApi } from "@/api/product";
import { categoryApi } from "@/api/category";
import { Category } from "@/types/category";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  product?: Product;
}

// Define a proper interface for form data
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  discountPrice: number;
  isFeatured: boolean;
  images: File[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  product,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    brand: "",
    discountPrice: 0,
    isFeatured: false,
    images: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category?._id || "",
        brand: product.brand || "",
        discountPrice: product.discountPrice || 0,
        isFeatured: product.isFeatured || false,
        images: [],
      });
      setExistingImages(product.images || []);
      setPreviewUrls(product.images?.map((img) => img.url) || []);
      setImagesToRemove([]);
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        brand: "",
        discountPrice: 0,
        isFeatured: false,
        images: [],
      });
      setExistingImages([]);
      setPreviewUrls([]);
      setImagesToRemove([]);
    }
    setErrors({});
  }, [mode, product, isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length > 120) {
      newErrors.name = "Product name cannot exceed 120 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock must be 0 or greater";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.discountPrice && formData.discountPrice >= formData.price) {
      newErrors.discountPrice =
        "Discount price must be less than regular price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFormData({ ...formData, images: [...formData.images, ...validFiles] });

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });

    // Calculate the actual preview URL index (considering existing images)
    const newImageIndex = index;
    setPreviewUrls((prev) =>
      prev.filter((_, i) => {
        // Keep existing images, remove the new one at the calculated index
        if (i < existingImages.length) return true;
        const newImageIdx = i - existingImages.length;
        return newImageIdx !== newImageIndex;
      }),
    );
  };

  const handleRemoveExistingImage = (publicId: string) => {
    setImagesToRemove((prev) => [...prev, publicId]);
    const imageToRemove = existingImages.find(
      (img) => img.public_id === publicId,
    );
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== publicId),
    );
    if (imageToRemove) {
      setPreviewUrls((prev) => prev.filter((url) => url !== imageToRemove.url));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        brand: formData.brand,
        discountPrice: formData.discountPrice,
        isFeatured: formData.isFeatured,
        images: formData.images,
        removeImages: imagesToRemove,
      };

      if (mode === "create") {
        await productApi.createProduct(submitData as CreateProductDto);
        toast.success("Product created successfully");
      } else if (product) {
        await productApi.updateProduct(
          product.slug,
          submitData as UpdateProductDto,
        );
        toast.success("Product updated successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-y-auto transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-all">
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 z-10">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package size={24} />
                    {mode === "create" ? "Create Product" : "Edit Product"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                          ${errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Enter brand name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <Listbox
                        value={formData.category}
                        onChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button
                            className={`relative w-full cursor-default rounded-lg bg-gray-50 dark:bg-gray-800 border py-2 pl-3 pr-10 text-left
                            ${errors.category ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
                          >
                            <span className="block truncate">
                              {formData.category
                                ? categories.find(
                                    (c) => c._id === formData.category,
                                  )?.name || "Select category"
                                : "Select a category"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronsUpDown
                                size={18}
                                className="text-gray-400"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 shadow-lg">
                              {categories.map((cat) => (
                                <Listbox.Option
                                  key={cat._id}
                                  value={cat._id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {cat.name}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                          <Check size={16} />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      {errors.category && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock *
                      </label>
                      <div className="relative">
                        <Archive
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stock: parseInt(e.target.value) || 0,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            ${errors.stock ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      {errors.stock && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.stock}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Regular Price *
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            ${errors.price ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Price
                      </label>
                      <div className="relative">
                        <Tag
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          value={formData.discountPrice || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            ${errors.discountPrice ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {errors.discountPrice && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.discountPrice}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={5}
                        className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                          ${errors.description ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        placeholder="Enter product description"
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Featured Product Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Featured Product
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Show this product on the featured section
                      </p>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onChange={(checked) =>
                        setFormData({ ...formData, isFeatured: checked })
                      }
                      className={`${
                        formData.isFeatured
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          formData.isFeatured
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Images
                    </label>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {existingImages.map((img) => (
                          <div key={img.public_id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <Image
                                src={img.url}
                                alt="Product"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveExistingImage(img.public_id)
                              }
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Images Preview */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {formData.images.map((file, index) => {
                          // Find the preview URL for this file
                          const previewIndex = existingImages.length + index;
                          const previewUrl = previewUrls[previewIndex];
                          if (!previewUrl) return null;

                          return (
                            <div
                              key={`new-${index}`}
                              className="relative group"
                            >
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <Image
                                  src={previewUrl}
                                  alt={`Preview ${index + 1}`}
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveNewImage(index)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Upload Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Upload size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Upload Images (Max 10, 5MB each)
                      </span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Recommended: Square images, max 5MB each (JPG, PNG, WebP)
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Saving..."
                        : mode === "create"
                          ? "Create Product"
                          : "Update Product"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
