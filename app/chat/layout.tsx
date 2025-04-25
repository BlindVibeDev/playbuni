import type React from "react"
import { ChatEnhancer } from "@/components/chat-enhancer"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ChatEnhancer />
      {children}
    </>
  )
}
