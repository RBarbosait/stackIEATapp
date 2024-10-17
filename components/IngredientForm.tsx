'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function IngredientForm({ onSubmit, ingredients: initialIngredients }: { onSubmit: (ingredients: string[], restrictToIngredients: boolean) => void, ingredients: string[] }) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients)
  const [newIngredient, setNewIngredient] = useState('')

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()])
      setNewIngredient('')
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ingredients.length > 0) {
      onSubmit(ingredients, false)
    } else {
      alert('Por favor, añade al menos un ingrediente.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Ingrese un ingrediente"
          className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddIngredient}
          className="p-3 text-white bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-full">
            <span>{ingredient}</span>
            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={20} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="submit"
        className="w-full p-3 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-md"
      >
        Generar Menú
      </button>
    </form>
  )
}