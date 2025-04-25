import { nanoid } from "nanoid"
import { generateResponse } from "@/lib/local-chat"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages, userId, sessionId: existingSessionId } = await req.json()

    console.log("Stream Chat API called with messages count:", messages.length)

    // Generate a session ID if not provided
    const sessionId = existingSessionId || nanoid()

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
    const userContent = lastUserMessage?.content || ""

    // Generate a fallback response using the local generator
    const fallbackContent = generateResponse(userContent)

    // Return the fallback response as a plain text stream
    return new Response(fallbackContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
        "X-Session-Id": sessionId,
      },
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
