"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { resetPassword } from "@/service/user"
import { toast } from "sonner"
import { useUser } from "@/context/user-context"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { handleUserData } = useUser();
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error("Token de restablecimiento no válido")
      router.push("/login")
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!password || !confirmPassword) {
      setError("Todos los campos son obligatorios.")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (!token) {
      setError("Token de restablecimiento no válido.")
      return
    }

    setLoading(true)
    try {
      const response = await resetPassword(token, password)
      toast.success("Contraseña restablecida con éxito")
      await handleUserData(response.user, response.token);
      router.push("/login")
    } catch (err) {
      console.error(err)
      setError("No se pudo restablecer la contraseña. El token puede haber expirado.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Token Inválido</h1>
            <p className="text-gray-600 mb-4">El enlace de restablecimiento no es válido o ha expirado.</p>
            <button
              onClick={() => router.push("/forgot-password")}
              className="w-full px-4 py-2 text-white bg-nav rounded-md hover:bg-accent focus:outline-none focus:ring focus:ring-blue-300"
            >
              Solicitar Nuevo Enlace
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Restablecer Contraseña</h1>
        <p className="text-center text-gray-600 mb-6">Ingresa tu nueva contraseña para continuar</p>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaKey className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Ingresa tu nueva contraseña"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-8 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <FaKey className="h-5 w-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Confirma tu nueva contraseña"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-8 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-nav rounded-md hover:bg-accent focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Actualizando...
              </div>
            ) : (
              "Restablecer Contraseña"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿Recordaste tu contraseña?{" "}
          <button onClick={() => router.push("/login")} className="text-blue-500 hover:underline">
            Iniciar Sesión
          </button>
        </p>
      </div>
    </div>
  )
}
