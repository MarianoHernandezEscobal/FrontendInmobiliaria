// app/not-found.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen p-4">
      <Image
        src="/logoColor.png" // Asegurate de colocar esta imagen en /public/images
        alt="Página no encontrada"
        width={400}
        height={300}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">¡Ups! Página no encontrada</h1>
      <p className="text-muted-foreground mb-6">
        Parece que esta página no existe o fue movida.
      </p>
      <Link href="/">
        <span className="text-green-600 hover:underline">Volver al inicio</span>
      </Link>
    </div>
  )
}
