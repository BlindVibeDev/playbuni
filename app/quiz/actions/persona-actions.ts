"use server"

import { savePersona, getRecentPersonas, getPersonaStats, type AIPersona } from "@/lib/persona-service"
import {
  savePersonaToDb,
  updatePersonaImage,
  getRecentPersonasFromDb,
  getPersonaStatsFromDb,
  ensureTablesExist,
} from "@/lib/db-persona-service"

// Ensure tables exist when the module is loaded
ensureTablesExist().catch((err) => {
  console.error("Failed to ensure tables exist:", err)
})

export async function storePersona(persona: AIPersona, dominantTrait: string) {
  try {
    // Store in Redis for caching and real-time access
    let id
    try {
      id = await savePersona(persona, dominantTrait)
    } catch (redisError) {
      console.error("Redis error, using generated ID:", redisError)
      // Generate a fallback ID if Redis fails
      id = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }

    // Also store in PostgreSQL for persistence
    try {
      await savePersonaToDb({ ...persona, id }, dominantTrait)
    } catch (dbError) {
      console.error("Database error when storing persona:", dbError)
      // If database fails but Redis succeeded, we can still return success
      if (id) {
        return { success: true, id, warning: "Stored in cache only" }
      }
      throw dbError
    }

    return { success: true, id }
  } catch (error) {
    console.error("Error storing persona:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updatePersonaImageUrl(externalId: string, imageUrl: string) {
  try {
    // Update in PostgreSQL
    await updatePersonaImage(externalId, imageUrl)

    return { success: true }
  } catch (error) {
    console.error("Error updating persona image:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function fetchRecentPersonas(limit = 10) {
  try {
    // Ensure tables exist first
    await ensureTablesExist()

    // First try to get from Redis for speed
    let redisPersonas = []
    try {
      redisPersonas = await getRecentPersonas(limit)
    } catch (redisError) {
      console.error("Redis error, falling back to database:", redisError)
    }

    if (redisPersonas.length > 0) {
      return { success: true, personas: redisPersonas }
    }

    // Fall back to database if Redis is empty or has an error
    try {
      const dbPersonas = await getRecentPersonasFromDb(limit)

      // Map database personas to the expected format
      const personas = dbPersonas.map((dbPersona) => ({
        id: dbPersona.external_id,
        agentName: dbPersona.agent_name,
        tagline: dbPersona.tagline,
        personalityTraits: dbPersona.personality_traits,
        specialization: dbPersona.specialization,
        communicationStyle: dbPersona.communication_style,
        appearance: dbPersona.appearance,
        backstory: dbPersona.backstory,
        specialAbilities: dbPersona.special_abilities,
        imageUrl: dbPersona.image_url || undefined,
        dominantTrait: dbPersona.dominant_trait,
        createdAt: dbPersona.created_at.getTime(),
      }))

      return { success: true, personas }
    } catch (dbError) {
      console.error("Database error when fetching personas:", dbError)
      // If both Redis and database fail, return an empty array
      return { success: true, personas: [], warning: "Could not fetch personas from database" }
    }
  } catch (error) {
    console.error("Error fetching recent personas:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function fetchPersonaStats() {
  try {
    // Ensure tables exist first
    await ensureTablesExist()

    // First try to get from Redis for speed
    let redisStats = { analytical: 0, creative: 0, social: 0, practical: 0 }
    try {
      redisStats = await getPersonaStats()
    } catch (redisError) {
      console.error("Redis error, falling back to database:", redisError)
    }

    // If Redis has data, use it
    if (Object.values(redisStats).some((val) => val > 0)) {
      return { success: true, stats: redisStats }
    }

    // Fall back to database if Redis is empty or has an error
    try {
      const dbStats = await getPersonaStatsFromDb()
      return { success: true, stats: dbStats }
    } catch (dbError) {
      console.error("Database error when fetching stats:", dbError)
      // If both Redis and database fail, return default stats
      return {
        success: true,
        stats: { analytical: 0, creative: 0, social: 0, practical: 0 },
        warning: "Could not fetch stats from database",
      }
    }
  } catch (error) {
    console.error("Error fetching persona stats:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
