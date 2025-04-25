"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ChatRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/chat-enhanced")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "600ms" }} />
        </div>
        <p className="mt-4 text-pink-600">Redirecting to enhanced chat...</p>
      </div>
    </div>
  )
}
