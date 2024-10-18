'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import IngredientForm from './components/IngredientForm'
import MenuList from './components/MenuList'
import SplashScreen from './components/SplashScreen'

interface Menu {
  title: string
  ingredients: string[]
  instructions: string[]
}

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [ingredients, setIngredients] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCeliac, setIsCeliac] = useState(false)
  const [isDiabetic, setIsDiabetic] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false)
  }, [])

  const handleGenerateMenu = async (newIngredients?: string[], restrictToIngredients: boolean = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const ingredientsToUse = newIngredients || ingredients
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredientsToUse,
          restrictToIngredients,
          isCeliac,
          isDiabetic
        }),
      })
      const result = await response.json()
      if (result.success && Array.isArray(result.menus)) {
        setMenus(result.menus)
        if (newIngredients) {
          setIngredients(newIngredients)
        }
      } else {
        setError(result.error || 'Error desconocido al generar el menú')
        setMenus([])
      }
    } catch (error) {
      console.error('Error generating menu:', error)
      setError('Ocurrió un error inesperado al generar el menú')
      setMenus([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <motion.main
        className="container mx-auto p-4 max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          <span className="text-yellow-500">I</span>
          <span className="text-green-500">EAT</span>
          <span className="text-blue-600"> - Creador de Menú</span>
        </h1>
        <div className="space-y-8">
          <IngredientForm onSubmit={handleGenerateMenu} ingredients={ingredients} />
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handleGenerateMenu(undefined, false)}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
              disabled={isLoading || ingredients.length === 0}
            >
              Generar Nuevos Menús
            </button>
            <button
              onClick={() => handleGenerateMenu(undefined, true)}
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              disabled={isLoading || ingredients.length === 0}
            >
              Utilizar solo los ingredientes ingresados
            </button>
          </div>
          <div className="flex justify-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isCeliac}
                onChange={(e) => setIsCeliac(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>Menú Celíaco</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isDiabetic}
                onChange={(e) => setIsDiabetic(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>Menú Diabético</span>
            </label>
          </div>
          {isLoading ? (
            <div className="text-center text-xl font-semibold text-gray-600">
              Generando menús...
              <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <MenuList menus={menus} ingredients={ingredients} />
          )}
        </div>
      </motion.main>
    </>
  )
}