"use server"

import { generateAICharacterPersona } from "@/lib/ai-sdk"

export async function generatePersona(
  traits: {
    analytical: number
    creative: number
    social: number
    practical: number
  },
  additionalInfo: {
    name: string
    interests: string[]
    communication: string
    strengths: string[]
  },
) {
  try {
    const persona = await generateAICharacterPersona(traits, additionalInfo)
    return { success: true, persona }
  } catch (error) {
    console.error("Error in generatePersona action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate persona",
    }
  }
}
