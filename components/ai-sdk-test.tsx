"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function AiSdkTest() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      })

      if (!result.ok) {
        throw new Error(`API error: ${result.status}`)
      }

      const data = await result.json()
      setResponse(data.content)
    } catch (err) {
      console.error("Error testing AI SDK:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">AI SDK Test with Grok 3</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Type a message to test the AI SDK with Grok 3..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Generating response..." : "Test AI SDK"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-md">
            <p className="font-medium mb-2">Response from Grok 3:</p>
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 justify-center">
        This component tests the AI SDK integration with Grok 3
      </CardFooter>
    </Card>
  )
}
