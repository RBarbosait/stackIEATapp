'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Menu {
  title: string
  ingredients: string[]
  instructions: string[]
}

interface MenuListProps {
  menus: Menu[]
  ingredients: string[]
}

export default function MenuList({ menus, ingredients }: MenuListProps) {
  const [openMenus, setOpenMenus] = useState<number[]>([])

  const toggleMenu = (index: number) => {
    setOpenMenus(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  if (!menus || menus.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Menús Sugeridos</h2>
        <p className="text-gray-500">No hay menús disponibles. Por favor, genera algunos menús.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Menús Sugeridos</h2>
      <ul className="space-y-4">
        {menus.map((menu, index) => (
          <li key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleMenu(index)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold">{menu.title}</span>
              {openMenus.includes(index) ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openMenus.includes(index) && (
              <div className="p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">Ingredientes:</h3>
                <ul className="list-disc list-inside mb-4">
                  {menu.ingredients && menu.ingredients.map((ingredient, i) => (
                    <li key={i} className={ingredients.includes(ingredient) ? "text-green-600" : ""}>{ingredient}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">Instrucciones:</h3>
                <ol className="list-decimal list-inside">
                  {menu.instructions && menu.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}