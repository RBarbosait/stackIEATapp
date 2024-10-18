import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = 'AIzaSyA53MNCCag3gLPJtInDcX4ptBQn9hDX6gI'

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


async function callGeminiAPI(ingredients: string[], restrictToIngredients: boolean, isCeliac: boolean, isDiabetic: boolean): Promise<Menu[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const restrictionText = restrictToIngredients 
    ? "Utiliza SOLO los ingredientes proporcionados." 
    : "Puedes utilizar ingredientes adicionales si es necesario."

  const dietaryRestrictions = []
  if (isCeliac) dietaryRestrictions.push("apto para celíacos (sin gluten)")
  if (isDiabetic) dietaryRestrictions.push("apto para diabéticos (bajo índice glucémico)")

  const dietaryText = dietaryRestrictions.length > 0
    ? `Asegúrate de que todas las recetas sean ${dietaryRestrictions.join(" y ")}.`
    : ""

  const prompt = `Crea 3 recetas de menú utilizando estos ingredientes: ${ingredients.join(', ')}. 