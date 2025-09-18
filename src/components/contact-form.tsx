"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ContactFormProps {
  propertyId: number
  propertyTitle: string
}

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío de formulario
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <h3 className="mb-2 font-semibold">¡Gracias por tu interés!</h3>
        <p className="text-sm">
          Hemos recibido tu consulta sobre esta propiedad. Un agente se pondrá en contacto contigo a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" placeholder="Tu nombre" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" type="email" placeholder="tu@email.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" placeholder="+598 99 123 456" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          placeholder="Me interesa esta propiedad y quisiera recibir más información..."
          rows={4}
          defaultValue={`Hola, me interesa la propiedad "${propertyTitle}" y quisiera recibir más información.`}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-nav" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar consulta"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Al enviar este formulario, aceptas recibir información sobre esta propiedad.
      </p>
    </form>
  )
}
