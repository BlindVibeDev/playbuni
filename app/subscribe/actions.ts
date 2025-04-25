"use server"

import { createSubscription as createDbSubscription } from "@/lib/subscription-service"

export async function createSubscription(name: string, email: string, subscriptionType: string) {
  try {
    await createDbSubscription(email, name, subscriptionType)
    return { success: true }
  } catch (error) {
    console.error("Error creating subscription:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create subscription",
    }
  }
}
