'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">Propiedad no encontrada</h1>
      <p className="mt-4 text-muted-foreground">
        Lo sentimos, la propiedad que estás buscando no existe o ha sido eliminada.
      </p>
      <Button asChild className="mt-8">
        <Link href="/ventas">Ver todas las propiedades</Link>
      </Button>
    </div>
  )
}
