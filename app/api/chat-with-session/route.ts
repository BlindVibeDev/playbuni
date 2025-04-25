import { neon } from "@neondatabase/serverless"
import { generateAIResponse } from "@/lib/ai-sdk-service"
import { nanoid } from "nanoid"
import { generateResponse } from "@/lib/local-chat"

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

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages, sessionId } = await req.json()

    if (!sessionId) {
      return Response.json({ error: "Session ID is required" }, { status: 400 })
    }

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
      // Generate response using Grok 3 via AI SDK
      responseContent = await generateAIResponse(messages)
    } catch (aiError) {
      console.error("AI SDK error:", aiError)
      // Fall back to local generation
      responseContent = generateResponse(userContent)
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
      model: "grok-3",
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
