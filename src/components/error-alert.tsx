"use client"

import { FaExclamationTriangle, FaTimes } from "react-icons/fa"

interface ErrorAlertProps {
  message: string
  onClose?: () => void
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
      <div className="flex-shrink-0">
        <FaExclamationTriangle className="h-5 w-5 text-red-500 mt-0.5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-red-800 font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
          aria-label="Cerrar alerta"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
