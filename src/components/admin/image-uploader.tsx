"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImagePlus, Trash2, UploadCloud, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface ImageUploaderProps {
  value: string[]
  onChange: (value: string[], files?: File[], deleted?: string[]) => void
  maxFiles?: number
}

function SortableImageItem({
  id,
  src,
  index,
  total,
  onRemove,
}: {
  id: string
  src: string
  index: number
  total: number
  onRemove: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="group relative aspect-square">
        <img
          src={src || "/placeholder.svg"}
          alt={`Imagen ${index + 1}`}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onRemove(index)}
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
    </Card>
  )
}

export function ImageUploader({ value = [], onChange, maxFiles = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [deleted, setDeleted] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleResetInput = () => {
    if (inputRef.current) inputRef.current.value = ""
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.warning("Límite de imágenes excedido")
        return
      }

      setIsUploading(true)

      try {
        const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
        const updatedFiles = [...files, ...acceptedFiles]
        const updatedPreviews = [...value, ...newPreviews]

        setFiles(updatedFiles)
        onChange(updatedPreviews, updatedFiles, deleted)
      } catch (error) {
        console.error("Error al subir imágenes:", error)
        toast.error("Error al subir imágenes")
      } finally {
        setIsUploading(false)
        handleResetInput()
      }
    },
    [value, files, onChange, maxFiles, deleted],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: isUploading,
  })

  const removeImage = (index: number) => {
    handleResetInput()
    const newImages = [...value]
    const removedImage = newImages.splice(index, 1)[0]

    const newFiles = [...files]
    if (index < files.length) {
      newFiles.splice(index, 1)
    }

    const updatedDeleted = [...deleted]
    if (removedImage && !removedImage.startsWith("blob:")) {
      updatedDeleted.push(removedImage)
    }

    setFiles(newFiles)
    setDeleted(updatedDeleted)
    onChange(newImages, newFiles, updatedDeleted)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((_, idx) => `image-${idx}` === active.id)
      const newIndex = value.findIndex((_, idx) => `image-${idx}` === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove([...value], oldIndex, newIndex)
        const newFiles = arrayMove([...files], oldIndex, newIndex)
        setFiles(newFiles)
        onChange(newImages, newFiles, deleted)
      }
    }
  }

  const removeAllImages = () => {
    handleResetInput()
    const deletedExisting = value.filter((img) => !img.startsWith("blob:"))
    const updatedDeleted = [...deleted, ...deletedExisting]
    setFiles([])
    setDeleted(updatedDeleted)
    onChange([], [], updatedDeleted)
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
            {/* <Button type="button" variant="outline" size="sm" onClick={removeAllImages} disabled={isUploading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar todas
            </Button> */}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <SortableContext items={value.map((_, idx) => `image-${idx}`)} strategy={verticalListSortingStrategy}>
                {value.map((src, index) => (
                  <SortableImageItem
                    key={`image-${index}`}
                    id={`image-${index}`}
                    src={src}
                    index={index}
                    total={value.length}
                    onRemove={removeImage}
                  />
                ))}
              </SortableContext>
              {value.length < maxFiles && (
                <div
                  {...getRootProps()}
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <input {...getInputProps()} />
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="mt-2 text-xs text-muted-foreground">Añadir más</span>
                </div>
              )}
            </div>
          </DndContext>
        </div>
      )}
    </div>
  )
}
