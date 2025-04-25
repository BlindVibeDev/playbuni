import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ChatBubbleProps {
  content: ReactNode
  isUser?: boolean
  className?: string
}

export function ChatBubble({ content, isUser = false, className }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-2 max-w-[80%] shadow-sm",
        isUser ? "bg-pink-500 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none",
        className,
      )}
    >
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  )
}
