import { neon } from "@neondatabase/serverless"
import { nanoid } from "nanoid"
import { generateResponse } from "@/lib/local-chat"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages } = await req.json()

    // Log diagnostic information
    console.log("Chat Diagnostic API called with messages count:", messages.length)
    console.log("Environment variables check:", {
      hasXaiKey: !!process.env.XAI_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    })

    // Test database connection
    let dbConnectionStatus = "Not tested"
    try {
      if (process.env.DATABASE_URL) {
        const sql = neon(process.env.DATABASE_URL)
        const result = await sql`SELECT 1 as test`
        dbConnectionStatus = result?.[0]?.test === 1 ? "Success" : "Failed"
      } else {
        dbConnectionStatus = "No DATABASE_URL provided"
      }
    } catch (dbError) {
      console.error("Database connection test error:", dbError)
      dbConnectionStatus = `Error: ${dbError instanceof Error ? dbError.message : "Unknown error"}`
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
    const userContent = lastUserMessage?.content || ""

    // Generate a fallback response
    const fallbackContent = generateResponse(userContent)

    // Return diagnostic information
    return Response.json({
      diagnostics: {
        timestamp: new Date().toISOString(),
        environment: {
          hasXaiKey: !!process.env.XAI_API_KEY,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          nodeEnv: process.env.NODE_ENV,
        },
        database: {
          connectionStatus: dbConnectionStatus,
        },
        request: {
          messageCount: messages.length,
          lastUserMessage: userContent.substring(0, 50) + (userContent.length > 50 ? "..." : ""),
        },
      },
      content: fallbackContent,
      sessionId: nanoid(),
    })
  } catch (error) {
    console.error("Chat Diagnostic API error:", error)

    // Return a proper error response with diagnostic information
    return Response.json(
      {
        error: "Chat diagnostic error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
