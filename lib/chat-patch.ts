import { generateResponse } from "@/lib/local-chat"

// Store the original fetch function
const originalFetch = typeof window !== "undefined" ? window.fetch : undefined

// Patch the fetch function to intercept chat API calls
export function patchFetch() {
  if (typeof window !== "undefined" && window.fetch === originalFetch) {
    // Only patch once
    window.fetch = async function patchedFetch(input, init) {
      // Check if this is a chat API call
      if (
        typeof input === "string" &&
        (input.includes("/api/chat") || input.includes("/api/chat-stream")) &&
        init?.method === "POST"
      ) {
        console.log("Intercepting API call to:", input)

        // Parse the request body to get the messages
        const body = init?.body ? JSON.parse(init.body as string) : {}
        const messages = body.messages || []
        const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()
        const userContent = lastUserMessage?.content || ""

        // Generate a local response
        const responseContent = generateResponse(userContent)

        // Create a mock response
        if (input.includes("/api/chat-stream")) {
          // For streaming API, return a text response
          return new Response(responseContent, {
            status: 200,
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "X-Session-Id": "local-" + Date.now(),
            },
          })
        } else {
          // For regular API, return a JSON response
          return new Response(
            JSON.stringify({
              content: responseContent,
              sessionId: "local-" + Date.now(),
              model: "local",
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
        }
      }

      // For all other requests, use the original fetch
      return originalFetch(input, init)
    }
  }
}

// Function to restore the original fetch
export function restoreFetch() {
  if (typeof window !== "undefined" && window.fetch !== originalFetch) {
    window.fetch = originalFetch
  }
}
