"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { FaEye, FaEyeSlash, FaEnvelope, FaUser, FaPhone } from "react-icons/fa"
import ErrorAlert from "@/components/error-alert"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { registerUser } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone) {
      setError("Todos los campos son obligatorios.")
      setLoading(false)
      return
    }

    const phoneRegex = /^(?:\+598\s?(?:9\d{7}|[24]\d{7})|0?9\d{7}|[24]\d{7})$/
    if(!phoneRegex.test(formData.phone)){
      setError("Por favor ingresa un telefono válido.")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido.")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      setLoading(false)
      return
    }

    try {
      await registerUser(formData)
      router.push("/")
    } catch (err) {
      setError("Error al crear la cuenta. Verifica que el correo no esté en uso e inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Crear Cuenta</h1>
        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">
              Nombre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaUser className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ingresa tu nombre"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-700">
              Apellido
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaUser className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ingresa tu apellido"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaEnvelope className="h-5 w-5" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ingresa tu correo"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaPhone className="h-5 w-5" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ingresa tu teléfono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {!showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  )
}
