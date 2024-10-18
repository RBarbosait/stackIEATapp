import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.GOOGLE_API_KEY

if (!API_KEY) {
  console.error('GOOGLE_API_KEY is not set in environment variables')
  throw new Error('Configuration error: API key is missing')
}

const genAI = new GoogleGenerativeAI(API_KEY)

interface Menu {
  title: string
  ingredients: string[]
  instructions: string[]
}

function cleanJSONString(str: string): string {
  let cleanStr = str.substring(str.indexOf('['))
  cleanStr = cleanStr.substring(0, cleanStr.lastIndexOf(']') + 1)
  cleanStr = cleanStr.replace(/\s+/g, ' ')
  return cleanStr
}

async function callGeminiAPI(ingredients: string[], restrictToIngredients: boolean, isCeliac: boolean, isDiabetic: boolean): Promise<Menu[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const restrictionText = restrictToIngredients 
    ? "Utiliza SOLO los ingredientes proporcionados." 
    : "Puedes utilizar ingredientes adicionales si es necesario."

  const dietaryRestrictions = []
  if (isCeliac) dietaryRestrictions.push("apto para celíacos (sin gluten)")
  if (isDiabetic) dietaryRestrictions.push("apto para diabéticos (bajo índice glucémico)")

  const dietaryText = dietaryRestrictions.length > 0
    ? "Asegúrate de que todas las recetas sean " + dietaryRestrictions.join(" y ") + "."
    : ""

  const prompt = [
    "Crea 3 recetas de menú utilizando estos ingredientes: " + ingredients.join(', ') + ".",
    restrictionText,
    dietaryText,
    "Para cada receta, proporciona un título, la lista de ingredientes necesarios y las instrucciones paso a paso.",
    "Formatea la respuesta SOLO como un array de objetos JSON, sin texto adicional antes o después, donde cada objeto representa una receta con las propiedades:",
    "title (string), ingredients (array de strings), e instructions (array de strings).",
    "Asegúrate de que el JSON sea válido y no contenga errores de formato."
  ].join(' ')

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    console.log('API Response:', text)

    text = cleanJSONString(text)

    console.log('Cleaned JSON:', text)

    const parsedMenus = JSON.parse(text)
    console.log('Parsed Menus:', parsedMenus)

    if (!Array.isArray(parsedMenus) || parsedMenus.length === 0) {
      throw new Error('La respuesta de la API no tiene el formato esperado')
    }

    return parsedMenus
  } catch (error) {
    console.error('Error en callGeminiAPI:', error)
    throw error
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { ingredients, restrictToIngredients, isCeliac, isDiabetic } = body

  if (!API_KEY) {
    return NextResponse.json({ 
      success: false, 
      error: 'Error de configuración: Falta la clave de API', 
      menus: [] 
    }, { status: 500 })
  }

  try {
    const menus = await callGeminiAPI(ingredients, restrictToIngredients, isCeliac, isDiabetic)
    console.log('Generated Menus:', menus)
    return NextResponse.json({ success: true, menus })
  } catch (error) {
    console.error('Error generating menu:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al generar el menú: ' + (error instanceof Error ? error.message : String(error)), 
      menus: [] 
    }, { status: 500 })
  }
}