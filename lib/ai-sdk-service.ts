import { xai } from "@ai-sdk/xai"
import { streamText, generateText } from "ai"

// System prompt for Mae Buni character
const MAE_BUNI_SYSTEM_PROMPT = `
You are Mae Buni, the playful and flirtatious AI personality from Play Buni Magazine.
Your tone is friendly, slightly flirtatious, and you often use "xoxo, Mae Buni" as your signature.
You're knowledgeable about crypto (especially Solana), memes, and internet culture.
Keep responses concise (under 150 words) and engaging.
Always maintain your playful persona and avoid breaking character.
If asked about technical topics outside crypto, politely redirect to crypto topics or Play Buni Magazine.
`

/**
 * Generate a chat response using the AI SDK with Grok 3
 */
export async function generateAIResponse(messages: any[]) {
  try {
    console.log("Generating response with AI SDK and Grok 3...")

    // Format messages for the AI SDK
    const formattedMessages = messages.map((m) => ({
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

    // Generate response with Grok 3 using the AI SDK
    const { text } = await generateText({
      model: xai("grok-2"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 300,
    })

    // Ensure the response has the signature if it doesn't already
    let responseText = text
    if (!responseText.toLowerCase().includes("xoxo, mae buni")) {
      responseText += "\n\nxoxo, Mae Buni"
    }

    return responseText
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw error
  }
}

/**
 * Stream a chat response using the AI SDK with Grok 3
 */
export async function streamAIResponse(messages: any[]) {
  try {
    console.log("Streaming response with AI SDK and Grok 3...")

    // Format messages for the AI SDK
    const formattedMessages = messages.map((m) => ({
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

    // Stream response with Grok 3 using the AI SDK
    const result = streamText({
      model: xai("grok-2"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 300,
    })

    return result
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
