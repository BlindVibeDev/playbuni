import { neon } from "@neondatabase/serverless"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { generateFallbackResponse } from "@/lib/fallback-chat"
import { nanoid } from "nanoid"

export const runtime = "nodejs"

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!)

// Function to save chat message to database
async function saveChatMessage(sessionId: string, role: string, content: string) {
  try {
    await sql`
      INSERT INTO chat_messages (id, session_id, role, content)
      VALUES (${nanoid()}, ${sessionId}, ${role}, ${content})
    `
    return true
  } catch (error) {
    console.error("Error saving chat message:", error)
    return false
  }
}

// Function to get or create a chat session
async function getOrCreateChatSession(userId?: string) {
  try {
    // If no userId, create an anonymous session
    if (!userId) {
      const sessionId = nanoid()
      await sql`
        INSERT INTO chat_sessions (id, user_id, created_at)
        VALUES (${sessionId}, NULL, NOW())
      `
      return sessionId
    }

    // Check if user has an active session
    const existingSessions = await sql`
      SELECT id FROM chat_sessions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (existingSessions.length > 0) {
      return existingSessions[0].id
    }

    // Create new session for user
    const sessionId = nanoid()
    await sql`
      INSERT INTO chat_sessions (id, user_id, created_at)
      VALUES (${sessionId}, ${userId}, NOW())
    `
    return sessionId
  } catch (error) {
    console.error("Error with chat session:", error)
    return nanoid() // Fallback to generate a session ID even if DB fails
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages, userId } = await req.json()

    console.log("Enhanced Chat API called with messages count:", messages.length)

    // Get or create a chat session
    const sessionId = await getOrCreateChatSession(userId)

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
    const userContent = lastUserMessage?.content || ""

    // Save the user message to the database
    try {
      await saveChatMessage(sessionId, "user", userContent)
    } catch (dbError) {
      console.error("Database error saving user message:", dbError)
      // Continue even if DB save fails
    }

    let responseContent = ""

    try {
      // Use Grok to generate a response if API key is available
      if (process.env.XAI_API_KEY) {
        // Format messages for the AI model
        const formattedMessages = messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        }))

        // Add system message to guide the AI's responses
        formattedMessages.unshift({
          role: "system",
          content: `You are Mae Buni, the playful and flirty AI personality who is the cover model and centerfold for Play Buni magazine.
          
          Your personality traits:
          - Playful and flirtatious, but always tasteful
          - Knowledgeable about crypto, especially Solana
          - Enthusiastic about Play Buni Magazine
          - Friendly and engaging
          - Slightly mischievous
          
          Always sign your messages with "xoxo, Mae Buni" at the end.
          Keep responses concise (1-3 sentences) and conversational.
          If asked about technical topics outside crypto, politely redirect to crypto topics.`,
        })

        // Generate response with Grok
        const { text } = await generateText({
          model: xai("grok-2"),
          messages: formattedMessages,
          temperature: 0.7,
          maxTokens: 300,
        })

        responseContent = text

        // Ensure the response has the signature if it doesn't already
        if (!responseContent.includes("xoxo, Mae Buni")) {
          responseContent += "\n\nxoxo, Mae Buni"
        }
      } else {
        throw new Error("XAI_API_KEY not available")
      }
    } catch (aiError) {
      console.error("Error generating AI response:", aiError)
      // Fallback to local response generation
      responseContent = generateFallbackResponse(userContent)
    }

    // Save the assistant response to the database
    try {
      await saveChatMessage(sessionId, "assistant", responseContent)
    } catch (dbError) {
      console.error("Database error saving assistant message:", dbError)
      // Continue even if DB save fails
    }

    // Return the response as JSON
    return Response.json({
      content: responseContent,
      sessionId,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Return a proper error response
    return Response.json(
      {
        error: "Chat processing error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
