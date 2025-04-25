import { nanoid } from "nanoid"
import { generateResponse } from "@/lib/local-chat"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

/**
 * Stream a chat response from the API
 */
export async function streamChatResponse(
  messages: Message[],
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void,
  abortSignal?: AbortSignal,
): Promise<{ sessionId?: string; isUsingFallback?: boolean }> {
  try {
    // Format messages for the API
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    console.log("Calling chat API with", formattedMessages.length, "messages")

    // Call the regular chat API instead of streaming
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: formattedMessages }),
      signal: abortSignal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`API error: ${response.status}`, errorText)
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Send the entire response as one chunk
    onChunk(data.content)

    return {
      sessionId: data.sessionId,
      isUsingFallback: data.isUsingFallback,
    }
  } catch (error) {
    console.error("Error getting chat response:", error)

    // Get the last user message for fallback generation
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    const userContent = lastUserMessage?.content || ""

    // Generate a fallback response locally
    const fallbackContent = generateResponse(userContent)

    // Send the fallback response as a single chunk
    onChunk(fallbackContent)

    // Also report the error
    onError(error instanceof Error ? error : new Error("Unknown error"))

    return { isUsingFallback: true }
  }
}

/**
 * Create a new message object
 */
export function createMessage(role: "user" | "assistant", content: string): Message {
  return {
    id: nanoid(),
    role,
    content,
    timestamp: new Date(),
  }
}
