"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function ChatButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/chat")
  }

  return (
    <Button
      onClick={handleClick}
      className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2 flex items-center gap-2"
    >
      <MessageCircle size={18} />
      <span>Chat with Mae Buni</span>
      <span className="text-xs bg-white text-pink-600 px-2 py-0.5 rounded-full font-bold">SOON</span>
    </Button>
  )
}
