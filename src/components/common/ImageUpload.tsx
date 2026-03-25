"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import Image from "next/image";

interface Props {
  image?: File | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  existingImageUrl?: string;
}

export default function ImageUpload({
  image,
  onImageSelect,
  onImageRemove,
  existingImageUrl,
}: Props) {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageRemove();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={preview}
                alt="Preview"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-blue-500 transition-colors"
          >
            <Upload size={20} className="text-gray-400" />
            <span className="text-xs text-gray-500">Upload</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Recommended: Square image, max 2MB
      </p>
    </div>
  );
}
