"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { History, Clock, MessageSquare, Plus, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ChatSession } from "@/lib/chat-history-service"

interface ChatHistoryDrawerProps {
  onSelectSession: (sessionId: string, messages: any[]) => void
  onNewChat: () => void
  currentSessionId?: string
}

export function ChatHistoryDrawer({ onSelectSession, onNewChat, currentSessionId }: ChatHistoryDrawerProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch chat sessions when the drawer is opened
  const fetchSessions = async () => {
    if (!isOpen) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/chat-history")
      if (!response.ok) throw new Error("Failed to fetch chat history")

      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error("Error fetching chat sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load sessions when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchSessions()
    }
  }, [isOpen])

  // Handle session selection
  const handleSelectSession = async (sessionId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/chat-history?sessionId=${sessionId}`)
      if (!response.ok) throw new Error("Failed to fetch chat messages")

      const data = await response.json()
      const formattedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
      }))

      onSelectSession(sessionId, formattedMessages)
      setIsOpen(false)
    } catch (error) {
      console.error("Error fetching chat messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle new chat
  const handleNewChat = () => {
    onNewChat()
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white border-pink-200 hover:bg-pink-50 hover:text-pink-600"
          onClick={() => setIsOpen(true)}
        >
          <History className="h-5 w-5 text-pink-500" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-center text-pink-600 font-display text-xl">Chat History</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-2 border-pink-200 hover:bg-pink-50 hover:text-pink-600"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No chat history found</p>
              <p className="text-sm mt-1">Start a new conversation with Mae Buni!</p>
            </div>
          ) : (
            <ScrollArea className="h-[50vh]">
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      session.id === currentSessionId ? "bg-pink-100 hover:bg-pink-200" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="truncate flex-1">
                        <p className="font-medium truncate">{session.preview}</p>
                        <p className="text-xs text-gray-500 mt-1">{session.messageCount} messages</p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 whitespace-nowrap ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
