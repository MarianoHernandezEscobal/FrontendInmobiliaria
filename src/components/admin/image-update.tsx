"use client"

import { useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImagePlus, UploadCloud, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import type { ImageItem, ImageList } from "@/types/image"

// ---- ITEM SORTABLE ---------------------------------------------------

function SortableImageItem({
  id,
  src,
  index,
  onRemove,
}: {
  id: string
  src: string
  index: number
  onRemove: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

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
          src={src}
          alt={`Imagen ${index + 1}`}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {/* BTN DELETE */}
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

// ---- COMPONENTE ------------------------------------------------------

interface ImageUploaderProps {
  value: ImageList
  onChange: (value: ImageList) => void
  maxFiles?: number
}

export function ImageUpdate({ value = [], onChange, maxFiles = 10 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = ""
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const imagesToShow = value.filter((img) => !img.deleted)

  // ---- DROP HANDLER ------------------------------------------------------

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (imagesToShow.length + acceptedFiles.length > maxFiles) {
        toast.warning("Límite de imágenes excedido")
        return
      }

      const newItems: ImageList = acceptedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        isNew: true,
        deleted: false,
      }))

    console.log([...value, ...newItems])

      onChange([...value, ...newItems])
      resetInput()
    },
    [imagesToShow.length, maxFiles, onChange, value],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
  })

  // ---- REORDER -----------------------------------------------------------

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = imagesToShow.findIndex((_, i) => `image-${i}` === active.id)
    const newIndex = imagesToShow.findIndex((_, i) => `image-${i}` === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(imagesToShow, oldIndex, newIndex)

    // reconstruir toda la lista pero manteniendo los deleted al final
    const deletedItems = value.filter((i) => i.deleted)
    console.log(deletedItems)
    console.log([...reordered, ...deletedItems])

    onChange([...reordered, ...deletedItems])
  }

  // ---- DELETE ------------------------------------------------------------

  const removeImage = (index: number) => {
    const item = imagesToShow[index]

    // Si era nueva → simplemente eliminarla
    if (item.isNew) {
      const updated = value.filter((x) => x !== item)
      onChange(updated)
      return
    }

    // Si era existente → marcar como deleted
    const updated = value.map((img) =>
      img === item ? { ...img, deleted: true } : img,
    )

    console.log(updated)

    onChange(updated)
  }

  // ---- UI ------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={`relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
      >
        <input {...getInputProps()} ref={inputRef} />

        <div className="flex flex-col items-center gap-2 text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? "Suelte las imágenes aquí" : "Arrastre o haga clic para subir"}
          </p>
        </div>
      </div>

      {/* LISTA */}
      {imagesToShow.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <SortableContext
              items={imagesToShow.map((_, i) => `image-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {imagesToShow.map((img, index) => (
                <SortableImageItem
                  key={`image-${index}`}
                  id={`image-${index}`}
                  src={img.url}
                  index={index}
                  onRemove={removeImage}
                />
              ))}
            </SortableContext>

            {/* ADD MORE */}
            {imagesToShow.length < maxFiles && (
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
      )}
    </div>
  )
}
