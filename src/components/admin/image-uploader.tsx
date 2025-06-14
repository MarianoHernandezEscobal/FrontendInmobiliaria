"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImagePlus, Trash2, UploadCloud, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface ImageUploaderProps {
  value: string[]
  onChange: (value: string[], files?: File[], deleted?: string[]) => void
  maxFiles?: number
}

export function ImageUploader({ value = [], onChange, maxFiles = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [deleted, setDeleted] = useState<string[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.warning("Límite de imágenes excedido")
        return
      }
  
      setIsUploading(true)
  
      try {
        
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))  // 🔥 crear URLS locales
        const updatedFiles = [...files, ...acceptedFiles]
        const updatedPreviews = [...value, ...newPreviews]
  
        setFiles(updatedFiles)
        onChange(updatedPreviews, updatedFiles)   // 🔥 pasás previews + archivos
      } catch (error) {
        console.error("Error al subir imágenes:", error)
        toast.error("Error al subir imágenes")
      } finally {
        setIsUploading(false)
      }
    },
    [value, files, onChange, maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: isUploading,
  })

  const removeImage = (index: number) => {
    const newImages = [...value];
    const removedImage = newImages.splice(index, 1)[0];
  
    const newFiles = [...files];
    if (index < files.length) {
      newFiles.splice(index, 1);
    }
  
    if (removedImage && !removedImage.startsWith("blob:")) {
      setDeleted(prev => [...prev, removedImage]);
    }
  
    setFiles(newFiles);
    onChange(newImages, newFiles, deleted.concat(removedImage.startsWith("blob:") ? [] : [removedImage]));
  }
  
  

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...value]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)

    const newFiles = [...files]
    const [movedFile] = newFiles.splice(fromIndex, 1)
    newFiles.splice(toIndex, 0, movedFile)

    setFiles(newFiles)
    onChange(newImages, newFiles)
  }

  const removeAllImages = () => {
    const deletedExisting = value.filter(img => !img.startsWith("blob:"));
    
    setFiles([]);
    setDeleted(prev => [...prev, ...deletedExisting]);
    
    onChange([], [], deleted.concat(deletedExisting));
  }
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${isUploading ? "opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? "Suelte las imágenes aquí" : "Arrastre y suelte imágenes aquí"}
            </p>
            <p className="text-xs text-muted-foreground">
              O haga clic para seleccionar archivos (máximo {maxFiles} imágenes)
            </p>
          </div>
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm font-medium">Subiendo imágenes...</p>
            </div>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Imágenes subidas ({value.length}/{maxFiles})
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={removeAllImages} disabled={isUploading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar todas
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {value.map((src, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="group relative aspect-square">
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`Imagen ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      Principal
                    </div>
                  )}
                </div>
                <div className="flex justify-between p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => index > 0 && reorderImages(index, index - 1)}
                    disabled={index === 0 || isUploading}
                    className="h-8 w-8"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => index < value.length - 1 && reorderImages(index, index + 1)}
                    disabled={index === value.length - 1 || isUploading}
                    className="h-8 w-8"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))}
            {value.length < maxFiles && (
              <div {...getRootProps()} className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary hover:bg-primary/5">
                <input {...getInputProps()} />
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-xs text-muted-foreground">Añadir más</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
