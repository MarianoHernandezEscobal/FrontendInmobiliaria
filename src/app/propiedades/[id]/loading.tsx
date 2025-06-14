'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
<div className="min-h-screen container nav_padding mx-auto px-4 py-8">
{/* Navegación */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Título y ubicación */}
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="mt-2 h-5 w-1/2" />
      </div>

      {/* Galería de imágenes */}
      <div className="mb-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
