"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { X, Folder, Image, ChevronsUpDown, Check } from "lucide-react";
import toast from "react-hot-toast";
import { Category, CategoryFormData } from "@/types/category";
import { categoryApi } from "@/api/category";
import ImageUpload from "@/components/common/ImageUpload";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  category?: Category;
  categories?: Category[];
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  category,
  categories = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: null,
    parent: "",
  });

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        image: null,
        parent:
          typeof category.parent === "object"
            ? category.parent?._id
            : category.parent || "",
      });
    } else {
      setFormData({
        name: "",
        image: null,
        parent: "",
      });
    }
    setErrors({});
  }, [mode, category, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length > 80) {
      newErrors.name = "Category name cannot exceed 80 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        parent: formData.parent || null,
      };

      if (mode === "create") {
        await categoryApi.createCategory(submitData);
        toast.success("Category created successfully");
      } else if (category) {
        await categoryApi.updateCategory(category.slug, submitData);
        toast.success("Category updated successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  // Filter out current category from parent options (to prevent self-parenting)
  const parentOptions = categories.filter(
    (c) => mode === "create" || c._id !== category?._id,
  );

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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-all">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                    {mode === "create" ? "Create Category" : "Edit Category"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Name *
                    </label>
                    <div className="relative">
                      <Folder
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                          ${errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                        placeholder="Enter category name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Parent Category (Optional) */}
                  {categories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parent Category (Optional)
                      </label>
                      <Listbox
                        value={formData.parent}
                        onChange={(value) =>
                          setFormData({ ...formData, parent: value })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 pl-3 pr-10 text-left">
                            <span className="block truncate">
                              {formData.parent
                                ? parentOptions.find(
                                    (c) => c._id === formData.parent,
                                  )?.name || "Select parent"
                                : "No Parent (Top Level)"}
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
                              <Listbox.Option
                                value=""
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
                                      className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                                    >
                                      No Parent (Top Level)
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Check size={16} />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                              {parentOptions.map((cat) => (
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
                                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
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
                    </div>
                  )}

                  {/* Image Upload (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Image (Optional)
                    </label>
                    <ImageUpload
                      image={formData.image}
                      onImageSelect={(file) =>
                        setFormData({ ...formData, image: file })
                      }
                      onImageRemove={() =>
                        setFormData({ ...formData, image: null })
                      }
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
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
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading
                        ? "Saving..."
                        : mode === "create"
                          ? "Create Category"
                          : "Update Category"}
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
