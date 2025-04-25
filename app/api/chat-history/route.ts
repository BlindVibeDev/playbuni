import { getChatSessions, getChatMessages, ensureChatTablesExist } from "@/lib/chat-history-service"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    // Ensure tables exist first
    await ensureChatTablesExist()

    // Get the URL parameters
    const url = new URL(req.url)
    const sessionId = url.searchParams.get("sessionId")
    const userId = url.searchParams.get("userId") || undefined

    // If sessionId is provided, get messages for that session
    if (sessionId) {
      const messages = await getChatMessages(sessionId)
      return Response.json({ messages })
    }

    // Otherwise, get all sessions
    const sessions = await getChatSessions(userId)
    return Response.json({ sessions })
  } catch (error) {
    console.error("Chat history API error:", error)
    return Response.json(
      {
        error: "Failed to fetch chat history",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
