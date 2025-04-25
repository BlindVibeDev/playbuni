import pool from "./db"
import type { AIPersona } from "./persona-service"

export type DBPersona = {
  id: number
  external_id: string
  agent_name: string
  tagline: string
  personality_traits: string[]
  specialization: string
  communication_style: string
  appearance: string
  backstory: string
  special_abilities: string[]
  image_url: string | null
  dominant_trait: string
  user_id: number | null
  created_at: Date
}

// Check if the table exists and create it if it doesn't
export async function ensureTablesExist() {
  try {
    const client = await pool.connect()
    try {
      // Check if ai_personas table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'ai_personas'
        );
      `)

      const tableExists = tableCheck.rows[0].exists

      if (!tableExists) {
        console.log("Creating ai_personas table...")
        await client.query(`
          CREATE TABLE IF NOT EXISTS ai_personas (
            id SERIAL PRIMARY KEY,
            external_id VARCHAR(100) UNIQUE,
            agent_name VARCHAR(255) NOT NULL,
            tagline TEXT,
            personality_traits TEXT[],
            specialization TEXT,
            communication_style TEXT,
            appearance TEXT,
            backstory TEXT,
            special_abilities TEXT[],
            image_url TEXT,
            dominant_trait VARCHAR(50),
            user_id INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS quiz_results (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            analytical_score INTEGER,
            creative_score INTEGER,
            social_score INTEGER,
            practical_score INTEGER,
            persona_id INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `)
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
    throw error
  }
}

// Save a persona to the database
export async function savePersonaToDb(persona: AIPersona, dominantTrait: string, userId?: number): Promise<number> {
  // Ensure tables exist before trying to save
  await ensureTablesExist()

  const query = `
    INSERT INTO ai_personas (
      external_id, agent_name, tagline, personality_traits, specialization, 
      communication_style, appearance, backstory, special_abilities, 
      image_url, dominant_trait, user_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `

  const values = [
    persona.id,
    persona.agentName,
    persona.tagline,
    persona.personalityTraits,
    persona.specialization,
    persona.communicationStyle,
    persona.appearance,
    persona.backstory,
    persona.specialAbilities,
    persona.imageUrl || null,
    dominantTrait,
    null, // No user ID since we've removed authentication
  ]

  try {
    const result = await pool.query(query, values)
    return result.rows[0].id
  } catch (error) {
    console.error("Error saving persona to database:", error)
    throw error
  }
}

// Update a persona's image URL
export async function updatePersonaImage(externalId: string, imageUrl: string): Promise<void> {
  // Ensure tables exist before trying to update
  await ensureTablesExist()

  const query = `
    UPDATE ai_personas
    SET image_url = $1
    WHERE external_id = $2
  `

  try {
    await pool.query(query, [imageUrl, externalId])
  } catch (error) {
    console.error("Error updating persona image:", error)
    throw error
  }
}

// Get a persona by its external ID
export async function getPersonaByExternalId(externalId: string): Promise<DBPersona | null> {
  // Ensure tables exist before trying to query
  await ensureTablesExist()

  const query = `
    SELECT * FROM ai_personas
    WHERE external_id = $1
  `

  try {
    const result = await pool.query(query, [externalId])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error getting persona from database:", error)
    throw error
  }
}

// Get recent personas from the database
export async function getRecentPersonasFromDb(limit = 20): Promise<DBPersona[]> {
  // Ensure tables exist before trying to query
  await ensureTablesExist()

  const query = `
    SELECT * FROM ai_personas
    ORDER BY created_at DESC
    LIMIT $1
  `

  try {
    const result = await pool.query(query, [limit])
    return result.rows
  } catch (error) {
    console.error("Error getting recent personas from database:", error)
    throw error
  }
}

// Save quiz results
export async function saveQuizResult(
  userId: number | null,
  scores: { analytical: number; creative: number; social: number; practical: number },
  personaId: number,
): Promise<void> {
  // Ensure tables exist before trying to save
  await ensureTablesExist()

  const query = `
    INSERT INTO quiz_results (
      user_id, analytical_score, creative_score, social_score, practical_score, persona_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
  `

  const values = [null, scores.analytical, scores.creative, scores.social, scores.practical, personaId]

  try {
    await pool.query(query, values)
  } catch (error) {
    console.error("Error saving quiz result:", error)
    throw error
  }
}

// Get persona statistics from the database
export async function getPersonaStatsFromDb(): Promise<{
  analytical: number
  creative: number
  social: number
  practical: number
}> {
  // Ensure tables exist before trying to query
  await ensureTablesExist()

  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE dominant_trait = 'analytical') as analytical,
      COUNT(*) FILTER (WHERE dominant_trait = 'creative') as creative,
      COUNT(*) FILTER (WHERE dominant_trait = 'social') as social,
      COUNT(*) FILTER (WHERE dominant_trait = 'practical') as practical
    FROM ai_personas
  `

  try {
    const result = await pool.query(query)
    return result.rows[0] || { analytical: 0, creative: 0, social: 0, practical: 0 }
  } catch (error) {
    console.error("Error getting persona stats from database:", error)
    // Return default values if there's an error
    return { analytical: 0, creative: 0, social: 0, practical: 0 }
  }
}
