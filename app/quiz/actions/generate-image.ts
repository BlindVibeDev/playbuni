"use server"

import { generateAICharacterImage } from "@/lib/ai-sdk"
import { uploadImage } from "@/lib/blob-service"

export async function generateAgentImage(
  persona: {
    agentName: string
    appearance: string
    personalityTraits: string[]
  },
  traits: {
    analytical: number
    creative: number
    social: number
    practical: number
  },
) {
  try {
    // Generate the image using our custom function
    const result = await generateAICharacterImage(persona, traits)

    if (!result.success || !result.imageUrl) {
      throw new Error(result.error || "Failed to generate image")
    }

    // For placeholder images, we'll just return the URL directly
    if (result.imageUrl.includes("placeholder.com")) {
      console.log("Using placeholder image:", result.imageUrl)
      return { success: true, imageUrl: result.imageUrl }
    }

    console.log("Generated image URL from Grok:", result.imageUrl)

    // For real images from Grok, fetch and upload to Vercel Blob
    try {
      const imageResponse = await fetch(result.imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch generated image: ${imageResponse.status} ${imageResponse.statusText}`)
      }

      // Get the image as a blob
      const imageBlob = await imageResponse.blob()

      // Create a unique filename
      const filename = `${persona.agentName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`

      // Upload to Vercel Blob
      const blobUrl = await uploadImage(imageBlob, filename, "ai-personas")
      console.log("Uploaded to Vercel Blob:", blobUrl)

      return { success: true, imageUrl: blobUrl }
    } catch (fetchError) {
      console.error("Error fetching or uploading image:", fetchError)
      // If we can't fetch or upload, return the original URL as fallback
      return { success: true, imageUrl: result.imageUrl }
    }
  } catch (error) {
    console.error("Error in generateAgentImage action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
    }
  }
}
