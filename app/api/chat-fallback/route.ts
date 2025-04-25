import { nanoid } from "nanoid"
import { generateResponse } from "@/lib/local-chat"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { message } = await req.json()

    // Generate a response using the local fallback
    const content = generateResponse(message)

    // Return the response as JSON
    return Response.json({
      content,
      id: nanoid(),
      model: "local-fallback",
    })
  } catch (error) {
    console.error("Fallback API error:", error)

    // Return a proper error response
    return Response.json(
      {
        error: "Fallback processing error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
