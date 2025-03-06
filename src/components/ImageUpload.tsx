import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Trash } from "lucide-react";

interface ImageUploadProps {
  onUpload: (files: (File | string)[]) => void;
  onRemove: (index: number) => void; // Nova prop para notificar a remoção de imagens
  initialImages?: (File | string)[];
}

export function ImageUpload({
  onUpload,
  onRemove,
  initialImages = [],
}: ImageUploadProps) {
  const [images, setImages] = useState<(File | string)[]>(initialImages);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = [...images, ...acceptedFiles].slice(0, 4); // Limita a 4 imagens
      setImages(newImages);
      onUpload(newImages); // Notifica o componente pai sobre o upload
    },
    [images, onUpload],
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages); // Notifica o componente pai sobre a remoção
    onRemove(index); // Notifica o componente pai sobre o índice removido
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-gray-500"
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-8 w-8 text-gray-500" />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-indigo-600">Click to upload</span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
      </div>

      {/* Prévia das imagens */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative h-20 w-20">
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
