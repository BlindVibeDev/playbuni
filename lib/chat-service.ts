import { generateResponse } from "@/lib/local-chat"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

/**
 * Send a chat message to the API and get a response, falling back to local generation if needed.
 */
export async function sendChatMessage(messages: Message[]): Promise<{ content: string; isLocal: boolean }> {
  try {
    // Call the enhanced API
    const response = await fetch("/api/chat-ai-sdk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return { content: data.content, isLocal: false }
  } catch (error) {
    console.error("Error getting chat response from API:", error)

    // Get the last user message for fallback generation
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    const userContent = lastUserMessage?.content || ""

    // Use local fallback
    const fallbackContent = generateResponse(userContent)
    return { content: fallbackContent, isLocal: true }
  }
}

/**
 * Get a chat response using local generation (fallback).
 */
export async function getChatResponse(messages: Message[]): Promise<{ content: string }> {
  // Get the last user message for fallback generation
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
  const userContent = lastUserMessage?.content || ""

  // Use local fallback
  const fallbackContent = generateResponse(userContent)
  return { content: fallbackContent }
}
