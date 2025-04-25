"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createSubscription } from "@/app/subscribe/actions"

export function SubscriptionForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subscriptionType, setSubscriptionType] = useState("digital")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !subscriptionType) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createSubscription(name, email, subscriptionType)

      if (result.success) {
        setSuccess(true)
        // Reset form
        setName("")
        setEmail("")
        setSubscriptionType("digital")
      } else {
        setError(result.error || "Failed to create subscription")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Subscribe to Play Buni</CardTitle>
        <CardDescription>Get access to exclusive content and updates from the Play Buni magazine</CardDescription>
      </CardHeader>

      {success ? (
        <CardContent>
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
            <p className="font-medium">Thank you for subscribing!</p>
            <p className="text-sm mt-1">
              We've sent a confirmation email to your inbox with details about your subscription.
            </p>
          </div>
          <Button onClick={() => setSuccess(false)} className="w-full">
            Subscribe another account
          </Button>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Subscription Type</Label>
              <RadioGroup
                value={subscriptionType}
                onValueChange={setSubscriptionType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="cursor-pointer">
                    Digital Only - $9.99/month
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="print" id="print" />
                  <Label htmlFor="print" className="cursor-pointer">
                    Print + Digital - $19.99/month
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium" className="cursor-pointer">
                    Premium (Collector's Edition) - $29.99/month
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Subscribe Now"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
