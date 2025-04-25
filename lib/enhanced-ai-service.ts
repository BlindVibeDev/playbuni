import { generateText, streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { generateFallbackResponse } from "@/lib/fallback-chat"

// Type for chat messages
type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

// System prompt for Mae Buni character
const MAE_BUNI_SYSTEM_PROMPT = `
You are Mae Buni, the playful and flirtatious AI personality who is the cover model and centerfold for Play Buni magazine.

Your personality traits:
- Playful and flirtatious, but always tasteful
- Knowledgeable about crypto, especially Solana
- Enthusiastic about Play Buni Magazine
- Friendly and engaging
- Slightly mischievous

Always sign your messages with "xoxo, Mae Buni" at the end.
Keep responses concise (1-3 sentences) and conversational.
If asked about technical topics outside crypto, politely redirect to crypto topics.
`

/**
 * Generate a chat response using Grok 3 via the AI SDK
 */
export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // Check if we have the XAI API key
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set")
    }

    // Format messages for the AI model
    const formattedMessages = [...messages]

    // Add system message if not already present
    if (!formattedMessages.some((m) => m.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content: MAE_BUNI_SYSTEM_PROMPT,
      })
    }

    console.log("Generating response with Grok 3...")

    // Generate response with Grok 3 using the AI SDK
    const { text } = await generateText({
      model: xai("grok-2"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 300,
    })

    let responseContent = text

    // Ensure the response has the signature if it doesn't already
    if (!responseContent.toLowerCase().includes("xoxo, mae buni")) {
      responseContent += "\n\nxoxo, Mae Buni"
    }

    return responseContent
  } catch (error) {
    console.error("Error generating AI response:", error)

    // Get the last user message for fallback generation
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    const userContent = lastUserMessage?.content || ""

    // Fallback to local response generation
    return generateFallbackResponse(userContent)
  }
}

/**
 * Stream a chat response using Grok 3 via the AI SDK
 */
export async function streamChatResponse(messages: ChatMessage[]) {
  try {
    // Check if we have the XAI API key
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set")
    }

    // Format messages for the AI model
    const formattedMessages = [...messages]

    // Add system message if not already present
    if (!formattedMessages.some((m) => m.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content: MAE_BUNI_SYSTEM_PROMPT,
      })
    }

    console.log("Streaming response with Grok 3...")

    // Stream response with Grok 3 using the AI SDK
    return streamText({
      model: xai("grok-2"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 300,
    })
  } catch (error) {
    console.error("Error streaming AI response:", error)
    throw error
  }
}

/**
 * Generate an image using Grok 2 Image
 */
export async function generateAIImage(prompt: string): Promise<string> {
  try {
    // Check if we have the XAI API key
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set")
    }

    console.log("Generating image with Grok 2 Image...")

    // Generate the image using Grok's image model
    const response = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-image",
        prompt: prompt,
        n: 1, // Generate 1 image
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Grok API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()

    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error("No image URL returned from Grok API")
    }

    return data.data[0].url
  } catch (error) {
    console.error("Error generating image with Grok:", error)
    // Return a placeholder image URL if generation fails
    return "https://via.placeholder.com/512x512/FF69B4/FFFFFF?text=Image+Generation+Failed"
  }
}
