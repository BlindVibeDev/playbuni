"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { nanoid } from "nanoid"
import { ChatBubble } from "@/components/chat-bubble"
import { ChatAvatar } from "@/components/chat-avatar"

// Define message type
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function SimpleChat() {
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
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call API to get response
      const response = await fetch("/api/chat-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsUsingFallback(data.isUsingFallback || false)
    } catch (error) {
      console.error("Error getting chat response:", error)

      // Add a fallback message if the API call fails completely
      const fallbackMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: "I'm having trouble connecting right now, but I'd love to chat more soon! xoxo, Mae Buni",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
      setIsUsingFallback(true)
    } finally {
      setIsLoading(false)
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
          {isUsingFallback && <div className="text-amber-600 text-sm">Using local mode</div>}
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
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
          {isLoading && (
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
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 rounded-full w-10 h-10 p-0 bg-pink-600 hover:bg-pink-700 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isUsingFallback
              ? "Using local mode - responses are generated on your device"
              : "Chat with Mae Buni, the AI personality from Play Buni Magazine"}
          </p>
        </form>
      </div>
    </div>
  )
}
