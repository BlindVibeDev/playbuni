"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function ChatTestPage() {
  const [input, setInput] = useState("Hello, Mae Buni!")
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      // Call the diagnostic API
      const result = await fetch("/api/chat-diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      })

      const data = await result.json()
      setResponse(data)
    } catch (err) {
      console.error("Error testing chat API:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Chat API Diagnostic</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to test..."
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Chat API"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8 border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-red-50 p-4 rounded overflow-auto text-red-800">{error}</pre>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Diagnostics</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(response.diagnostics, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-bold mb-2">Response Content</h3>
                <div className="bg-pink-50 p-4 rounded border border-pink-200">{response.content}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">Session ID: {response.sessionId}</CardFooter>
        </Card>
      )}
    </div>
  )
}
