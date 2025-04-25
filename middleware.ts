import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only intercept POST requests to /api/chat
  if (request.method === "POST" && request.nextUrl.pathname === "/api/chat") {
    // Clone the request URL and change the pathname
    const url = new URL(request.url)
    url.pathname = "/api/chat-with-session"

    // Forward the request to our enhanced endpoint
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/chat",
}
