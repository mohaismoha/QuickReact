"use client"

import { useEffect } from "react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: "bg-electric-green text-deep-black",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  }[type]

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${bgColor} px-6 py-4 rounded-lg shadow-lg max-w-md flex items-center gap-3`}>
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="text-xl font-bold hover:opacity-70 transition-opacity">
          ×
        </button>
      </div>
    </div>
  )
}
