"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (files: (File | string)[]) => void;
  onRemove: (index: number) => void;
  initialImages?: (File | string)[];
  disabled?: boolean;
}

// Hook personalizado para prevenir navegação durante o drag
const usePreventNavigation = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      document.body.classList.add("react-dropzone-active");
      return () => document.body.classList.remove("react-dropzone-active");
    }
  }, [isActive]);
};

export function ImageUpload({
  onUpload,
  onRemove,
  initialImages = [],
  disabled = false,
}: ImageUploadProps) {
  const [files, setFiles] = useState<(File | string)[]>(initialImages);
  const [previews, setPreviews] = useState<string[]>([]);

  // Configuração do dropzone com prevenção de eventos
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (disabled) return;
        setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 4));
      },
      [disabled]
    ),
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"] },
    multiple: true,
    disabled,
    noDragEventsBubbling: true,
    preventDropOnDocument: true,
    onDragEnter: (e) => e.preventDefault(),
    onDragOver: (e) => e.preventDefault(),
    onDragLeave: (e) => e.preventDefault(),
  });

  // Aplica a prevenção de navegação
  usePreventNavigation(isDragActive);

  // Geração de URLs de pré-visualização
  useEffect(() => {
    const newPreviews = files.map((file) =>
      typeof file === "string" ? file : URL.createObjectURL(file)
    );
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [files]);

  // Sincronização com imagens iniciais
  useEffect(() => {
    setFiles(initialImages || []);
  }, [initialImages]);

  // Handler de remoção
  const removeFile = (index: number) => {
    if (disabled) return;
    setFiles((prev) => prev.filter((_, i) => i !== index));
    onRemove(index);
  };

  // Notificar mudanças
  useEffect(() => {
    onUpload(files);
  }, [files, onUpload]);

  // Classes dinâmicas para a área de drop
  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-6 transition-colors 
    ${
      disabled
        ? "bg-gray-100 border-gray-300 cursor-not-allowed"
        : isDragActive
        ? "border-blue-500 bg-blue-50 shadow-lg"
        : "border-gray-400 hover:border-blue-500 bg-white cursor-pointer"
    }
  `;

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={dropzoneClasses}>
        <input {...getInputProps()} data-testid="file-input" />
        <div className="flex flex-col items-center gap-2">
          {isDragActive ? (
            <>
              <UploadCloud className="h-10 w-10 animate-pulse text-blue-500" />
              <p className="font-medium text-blue-600">Solte as imagens aqui</p>
            </>
          ) : (
            <>
              <UploadCloud
                className={`h-10 w-10 ${
                  disabled ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <p
                className={`text-center ${
                  disabled ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Arraste imagens ou clique para selecionar
              </p>
            </>
          )}
          <p className="text-sm text-gray-400">
            Formatos suportados: JPEG, PNG, GIF, SVG
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="group relative">
            <Image
              src={preview}
              alt={`Pré-visualização ${index + 1}`}
              className="h-32 w-full rounded-lg border object-cover"
            />

            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash className="h-6 w-6" />
                </button>
              </div>
            )}

            <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-60 text-xs text-white">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
