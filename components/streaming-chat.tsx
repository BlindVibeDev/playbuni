"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, RefreshCw, Volume2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { nanoid } from "nanoid"
import { ChatBubble } from "@/components/chat-bubble"
import { ChatAvatar } from "@/components/chat-avatar"
import { ChatHistoryDrawer } from "@/components/chat-history-drawer"
import { createMessage } from "@/lib/streaming-chat-service"
import { generateResponse } from "@/lib/local-chat"

// Define message type
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: "assistant",
      content:
        "Hey there! I'm Mae Buni, your digital companion from Play Buni Magazine. What can I help you with today? xoxo, Mae Buni",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [streamingMessage, setStreamingMessage] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Scroll to bottom when messages change or streaming message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingMessage])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isStreaming) return

    // Reset error state
    setApiError(null)
    setIsUsingFallback(false)

    // Add user message
    const userMessage = createMessage("user", input)
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      // Use local generation directly to avoid API issues
      const localResponse = generateResponse(userMessage.content)

      // Add a slight delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add the response message
      const assistantMessage = createMessage("assistant", localResponse)
      setMessages((prev) => [...prev, assistantMessage])

      // Set the session ID
      setCurrentSessionId(`local-${Date.now()}`)
    } catch (error) {
      console.error("Error in chat submission:", error)

      // Generate locally as last resort
      const localContent = generateResponse(userMessage.content)
      const localMessage = createMessage("assistant", localContent)
      setMessages((prev) => [...prev, localMessage])

      setApiError("An error occurred. Using local mode.")
      setIsUsingFallback(true)
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingMessage("")
      abortControllerRef.current = null
    }
  }

  // Handle retry with online API
  const handleRetry = () => {
    setApiError(null)
    setIsUsingFallback(false)
    // Remove the last assistant message if it was a fallback
    if (messages.length >= 2 && messages[messages.length - 1].role === "assistant") {
      setMessages(messages.slice(0, -1))
    }
    // Trigger the submit with the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMessage) {
      setInput(lastUserMessage.content)
      setTimeout(() => {
        handleSubmit(new Event("submit") as unknown as React.FormEvent)
      }, 100)
    }
  }

  // Handle canceling the current stream
  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
    setIsLoading(false)

    // If we have a partial streaming message, add it
    if (streamingMessage) {
      const assistantMessage = createMessage(
        "assistant",
        streamingMessage + "\n\n(Message was interrupted) xoxo, Mae Buni",
      )
      setMessages((prev) => [...prev, assistantMessage])
      setStreamingMessage("")
    }
  }

  // Handle textarea height adjustment
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  // Handle selecting a session from history
  const handleSelectSession = (sessionId: string, sessionMessages: Message[]) => {
    setCurrentSessionId(sessionId)
    setMessages(sessionMessages)
  }

  // Handle starting a new chat
  const handleNewChat = () => {
    setCurrentSessionId(null)
    setMessages([
      {
        id: nanoid(),
        role: "assistant",
        content:
          "Hey there! I'm Mae Buni, your digital companion from Play Buni Magazine. What can I help you with today? xoxo, Mae Buni",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-4 border-b border-pink-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-black text-pink-600 ml-4 font-display">Chat with Mae Buni</h1>
          </div>
          <div className="flex items-center gap-2">
            {isUsingFallback && (
              <div className="flex items-center">
                <span className="text-amber-600 text-sm mr-2">Using local mode</span>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center text-pink-600 border-pink-200 hover:bg-pink-50"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Try online
                </Button>
              </div>
            )}
            <ChatHistoryDrawer
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              currentSessionId={currentSessionId || undefined}
            />
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* API Error notification */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-800">
            <p className="font-medium">Connection issue</p>
            <p className="mt-1">Using local chat mode. Your messages won't be saved to your account.</p>
            {apiError !== "Connection issue" && <p className="mt-1 text-xs opacity-75">Error details: {apiError}</p>}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3"
              >
                {message.role === "assistant" && <ChatAvatar src="/images/buni-chat-avatar.png" alt="Mae Buni" />}
                <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                  <ChatBubble content={message.content} isUser={message.role === "user"} />
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 text-sm">You</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming message */}
          {isStreaming && streamingMessage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
              <ChatAvatar src="/images/buni-chat-avatar.png" alt="Mae Buni" />
              <div className="flex-1">
                <ChatBubble content={streamingMessage} isUser={false} />
              </div>
            </motion.div>
          )}

          {/* Loading indicator */}
          {isLoading && !isStreaming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
              <ChatAvatar src="/images/buni-chat-avatar.png" alt="Mae Buni" />
              <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-pink-100 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div
                    className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full rounded-full pl-6 pr-14 py-4 border border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50 resize-none overflow-hidden bg-white"
              style={{ minHeight: "60px", maxHeight: "120px" }}
              disabled={isLoading || isStreaming}
            />
            {isStreaming ? (
              <Button
                type="button"
                onClick={handleCancelStream}
                className="absolute right-2 bottom-2 rounded-full w-10 h-10 p-0 bg-red-500 hover:bg-red-600 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                </svg>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !input.trim() || isStreaming}
                className="absolute right-2 bottom-2 rounded-full w-10 h-10 p-0 bg-pink-600 hover:bg-pink-700 flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {isUsingFallback
                ? "Using local mode - responses are generated on your device"
                : "Chat with Mae Buni, the AI personality from Play Buni Magazine"}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-pink-600"
              title="Read aloud (coming soon)"
              disabled
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
