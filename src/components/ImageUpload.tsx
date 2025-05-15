import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Trash } from "lucide-react";

export type ImageItem = {
  id?: string;
  file?: File;
  original: string;
  optimized: string;
  thumbnail: string;
};

interface ImageUploadProps {
  initialImages?: Array<{
    original: string;
    optimized: string;
    thumbnail: string;
  }>;
  onImagesChange: (newImages: Array<ImageItem>) => void;
  onFilesChange?: (files: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  initialImages = [],
  onImagesChange,
  onFilesChange,
  maxImages = 4,
  disabled = false,
}: ImageUploadProps) {
  const [items, setItems] = useState<ImageItem[]>(
    initialImages.map((img) => ({ ...img, file: undefined })),
  );

  // Sincroniza previews iniciais
  useEffect(() => {
    setItems(initialImages.map((img) => ({ ...img, file: undefined })));
  }, [initialImages]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;

      // Gera preview
      const newItems = acceptedFiles.map((file) => ({
        file,

        original: URL.createObjectURL(file),
        optimized: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
      }));

      const updated = [...items, ...newItems].slice(0, maxImages);

      setItems(updated);
      onImagesChange(updated);
      onFilesChange?.(updated.map((i) => i.file!).filter(Boolean));
    },
    [disabled, items, maxImages, onImagesChange, onFilesChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled,
  });

  const handleRemove = useCallback(
    (index: number) => {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      onImagesChange(updated);
      onFilesChange?.(updated.map((i) => i.file!).filter(Boolean) as File[]);
    },
    [items, onImagesChange, onFilesChange],
  );

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="cursor-pointer rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="h-10 w-10 text-gray-600" />
          <p className="text-center text-gray-600">
            Arraste imagens ou clique para selecionar
          </p>
          <p className="text-sm text-gray-400">JPEG, PNG, GIF, SVG</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="group relative">
            <img
              src={item.thumbnail}
              alt={`Preview ${idx + 1}`}
              className="h-32 w-full rounded-lg border object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
