import { nanoid } from "nanoid"
import { generateResponse } from "@/lib/local-chat"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages, userId } = await req.json()

    console.log("Chat API called with messages count:", messages.length)

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
    const userContent = lastUserMessage?.content || ""

    // Generate a session ID
    const sessionId = nanoid()

    // Try to use the AI SDK if available
    let responseContent = ""
    let isUsingFallback = false

    try {
      // Import dynamically to avoid issues if the module is not available
      const { generateAIResponse } = await import("@/lib/ai-sdk-service")

      // Check if XAI_API_KEY is available
      if (!process.env.XAI_API_KEY) {
        throw new Error("XAI_API_KEY not available")
      }

      // Generate response using AI SDK
      responseContent = await generateAIResponse(messages)
    } catch (aiError) {
      console.error("AI SDK error:", aiError)

      // Fall back to local generation
      responseContent = generateResponse(userContent)
      isUsingFallback = true
    }

    // Return the response as JSON
    return Response.json({
      content: responseContent,
      sessionId,
      isUsingFallback,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Return a proper error response
    return Response.json(
      {
        error: "Chat processing error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        fallbackContent: generateResponse("Hello"),
      },
      { status: 500 },
    )
  }
}
