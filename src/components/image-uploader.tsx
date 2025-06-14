import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
    onChange: (files: File[], previewUrls: string[]) => void;
    maxFiles?: number;
  }
  
  export function ImageUploader({ onChange, maxFiles = 10 }: ImageUploaderProps) {
    const [previews, setPreviews] = useState<string[]>([]);
  
    const onDrop = useCallback((acceptedFiles: File[]) => {
      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...urls]);
      onChange(acceptedFiles, [...previews, ...urls]);
    }, [onChange, previews]);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  
    return (
      <div>
        <div
          {...getRootProps()}
          className={`p-6 border rounded-md ${isDragActive ? "bg-blue-100" : "bg-gray-50"}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>Suelta tus imágenes aquí</p> : <p>Arrastrá o hacé clic para subir imágenes</p>}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {previews.map((src, i) => (
            <img key={i} src={src} alt={`img-${i}`} className="w-full h-24 object-cover rounded" />
          ))}
        </div>
      </div>
    );
  }
