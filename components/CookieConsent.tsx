'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <p>
          Este sitio utiliza cookies para mejorar su experiencia. Al continuar navegando, acepta nuestro uso de cookies.
        </p>
        <button
          onClick={handleAccept}
          className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}