import redis from "./redis"
import { nanoid } from "nanoid"

export type AIPersona = {
  id?: string
  agentName: string
  tagline: string
  personalityTraits: string[]
  specialization: string
  communicationStyle: string
  appearance: string
  backstory: string
  specialAbilities: string[]
  imageUrl?: string
  dominantTrait: string
  createdAt?: number
}

export type PersonaStats = {
  analytical: number
  creative: number
  social: number
  practical: number
}

const PERSONAS_KEY = "play-buni:personas"
const STATS_KEY = "play-buni:persona-stats"
const RECENT_PERSONAS_KEY = "play-buni:recent-personas"
const MAX_RECENT_PERSONAS = 20

// Save a generated persona to Redis
export async function savePersona(persona: AIPersona, dominantTrait: string): Promise<string> {
  const id = nanoid(10)
  const timestamp = Date.now()

  const personaToSave = {
    ...persona,
    id,
    dominantTrait,
    createdAt: timestamp,
  }

  // Store the persona in Redis
  await redis.hset(PERSONAS_KEY, id, JSON.stringify(personaToSave))

  // Update the stats counter
  await redis.hincrby(STATS_KEY, dominantTrait, 1)

  // Add to recent personas list (using a sorted set with timestamp as score)
  await redis.zadd(RECENT_PERSONAS_KEY, { score: timestamp, member: id })

  // Trim the recent personas list if it gets too long
  const count = await redis.zcard(RECENT_PERSONAS_KEY)
  if (count > MAX_RECENT_PERSONAS) {
    await redis.zremrangebyrank(RECENT_PERSONAS_KEY, 0, count - MAX_RECENT_PERSONAS - 1)
  }

  return id
}

// Get a persona by ID
export async function getPersonaById(id: string): Promise<AIPersona | null> {
  const personaJson = await redis.hget<string>(PERSONAS_KEY, id)
  if (!personaJson) return null

  return JSON.parse(personaJson) as AIPersona
}

// Get recent personas
export async function getRecentPersonas(limit = 10): Promise<AIPersona[]> {
  // Get the most recent persona IDs
  const recentIds = await redis.zrange<string[]>(RECENT_PERSONAS_KEY, -limit, -1, { rev: true })

  if (!recentIds || recentIds.length === 0) return []

  // Get the personas by their IDs
  const personas: AIPersona[] = []

  for (const id of recentIds) {
    const persona = await getPersonaById(id)
    if (persona) personas.push(persona)
  }

  return personas
}

// Get persona type statistics
export async function getPersonaStats(): Promise<PersonaStats> {
  const stats = await redis.hgetall<Record<string, string>>(STATS_KEY)

  return {
    analytical: Number.parseInt(stats?.analytical || "0"),
    creative: Number.parseInt(stats?.creative || "0"),
    social: Number.parseInt(stats?.social || "0"),
    practical: Number.parseInt(stats?.practical || "0"),
  }
}
