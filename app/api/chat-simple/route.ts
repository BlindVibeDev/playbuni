import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { generateResponse } from "@/lib/local-chat"
import { nanoid } from "nanoid"

export const runtime = "nodejs"

// System prompt for Mae Buni character
const MAE_BUNI_SYSTEM_PROMPT = `
You are Mae Buni, the playful and flirtatious AI personality from Play Buni Magazine.
Your tone is friendly, slightly flirtatious, and you often use "xoxo, Mae Buni" as your signature.
You're knowledgeable about crypto (especially Solana), memes, and internet culture.
Keep responses concise (under 150 words) and engaging.
Always maintain your playful persona and avoid breaking character.
If asked about technical topics outside crypto, politely redirect to crypto topics or Play Buni Magazine.
`

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages } = await req.json()

    console.log("Simple Chat API called with messages count:", messages.length)

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
    const userContent = lastUserMessage?.content || ""

    let responseContent = ""
    let isUsingFallback = false

    try {
      // Format messages for the AI model
      const formattedMessages = messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }))

      // Add system message if not present
      if (!formattedMessages.some((m) => m.role === "system")) {
        formattedMessages.unshift({
          role: "system",
          content: MAE_BUNI_SYSTEM_PROMPT,
        })
      }

      // Generate response with Grok using the AI SDK
      const { text } = await generateText({
        model: xai("grok-2"),
        messages: formattedMessages,
        temperature: 0.7,
        maxTokens: 300,
      })

      responseContent = text

      // Ensure the response has the signature if it doesn't already
      if (!responseContent.toLowerCase().includes("xoxo, mae buni")) {
        responseContent += "\n\nxoxo, Mae Buni"
      }
    } catch (error) {
      console.error("AI SDK error:", error)

      // Fall back to local generation
      responseContent = generateResponse(userContent)
      isUsingFallback = true
    }

    // Return the response as JSON
    return Response.json({
      content: responseContent,
      sessionId: nanoid(),
      isUsingFallback,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Return a proper error response with fallback content
    return Response.json({
      content: generateResponse("Hello"),
      error: "Chat processing error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      isUsingFallback: true,
    })
  }
}
