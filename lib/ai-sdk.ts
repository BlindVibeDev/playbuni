import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

// Function to generate AI character persona using Grok 3
export async function generateAICharacterPersona(
  traits: {
    analytical: number
    creative: number
    social: number
    practical: number
  },
  additionalInfo: {
    name: string
    interests: string[]
    communication: string
    strengths: string[]
  },
) {
  try {
    // Check if we have the XAI API key
    if (!process.env.XAI_API_KEY) {
      console.log("XAI_API_KEY not found, using fallback persona generation")
      return generateFallbackPersona(traits)
    }

    // Create a prompt based on the traits and additional info
    const prompt = `
      Create a detailed AI character persona with the following traits:
      - Analytical: ${traits.analytical}/10
      - Creative: ${traits.creative}/10
      - Social: ${traits.social}/10
      - Practical: ${traits.practical}/10
      
      Additional information:
      - Name: ${additionalInfo.name}
      - Interests: ${additionalInfo.interests.join(", ")}
      - Communication style: ${additionalInfo.communication}
      - Strengths: ${additionalInfo.strengths.join(", ")}
      
      Return a JSON object with the following fields:
      - agentName: A catchy name for the AI character
      - tagline: A short, memorable tagline
      - personalityTraits: An array of 5 personality traits
      - specialization: What the character excels at
      - communicationStyle: How the character communicates
      - appearance: A detailed description of how the character looks
      - backstory: A brief origin story
      - specialAbilities: An array of 4 special abilities
    `

    // Generate the persona using Grok 3
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text]
      const jsonString = jsonMatch[1] || text

      // Parse the JSON
      const persona = JSON.parse(jsonString)
      return persona
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError)
      console.log("Raw response:", text)
      return generateFallbackPersona(traits)
    }
  } catch (error) {
    console.error("Error generating AI character persona:", error)
    return generateFallbackPersona(traits)
  }
}

// Function to generate AI character image using Grok 2 Image
export async function generateAICharacterImage(
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
    // Check if we have the XAI API key
    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not set")
    }

    // Determine the dominant trait for styling
    const dominantTrait = Object.entries(traits).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    // Create style based on dominant trait
    let stylePrompt = ""
    switch (dominantTrait) {
      case "analytical":
        stylePrompt =
          "Digital art style with blue and silver tones, geometric patterns, holographic elements, futuristic, clean lines"
        break
      case "creative":
        stylePrompt = "Vibrant watercolor style with flowing colors, artistic, dreamlike quality, colorful, ethereal"
        break
      case "social":
        stylePrompt = "Warm portrait style with soft lighting, approachable, expressive face, gentle colors, inviting"
        break
      case "practical":
        stylePrompt = "Realistic render with earthy tones, solid form, practical appearance, detailed, grounded"
        break
      default:
        stylePrompt = "Digital art, vibrant colors, professional quality"
    }

    // Create a detailed prompt based on the persona
    const prompt = `Create a portrait image of an AI character named ${persona.agentName}. 
    Appearance details: ${persona.appearance}
    Personality traits: ${persona.personalityTraits.join(", ")}
    Style: ${stylePrompt}
    
    The image should be a high-quality character portrait with a clean background, suitable for a profile picture.
    Do not include any text in the image.`

    console.log("Generating image with prompt:", prompt)

    // Generate the image using Grok's image model
    const response = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-image",
        prompt: prompt,
        n: 1, // Generate 1 image
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Grok API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()

    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error("No image URL returned from Grok API")
    }

    return {
      success: true,
      imageUrl: data.data[0].url,
    }
  } catch (error) {
    console.error("Error generating image with Grok:", error)

    // Fallback to placeholder images if the API fails
    const dominantTrait = Object.entries(traits).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    const placeholderImages = {
      analytical: "https://via.placeholder.com/512x512/0000FF/FFFFFF?text=Analytical",
      creative: "https://via.placeholder.com/512x512/FF00FF/FFFFFF?text=Creative",
      social: "https://via.placeholder.com/512x512/FF0066/FFFFFF?text=Social",
      practical: "https://via.placeholder.com/512x512/00CC00/FFFFFF?text=Practical",
    }

    return {
      success: true,
      imageUrl: placeholderImages[dominantTrait as keyof typeof placeholderImages] || placeholderImages.analytical,
      error: error instanceof Error ? error.message : "Unknown error generating image",
    }
  }
}

// Function to generate chat responses using Grok 3
export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    // Check if we have the XAI API key
    if (!process.env.XAI_API_KEY) {
      return "Hey there! I'm Mae Buni, the AI personality from Play Buni Magazine. I'm still in development, but I'll be ready to chat soon! xoxo, Mae Buni"
    }

    // Format messages for the AI model
    const formattedMessages = [...messages]

    // Add system message if not already present
    if (!formattedMessages.some((m) => m.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content: `You are Mae Buni, the playful and flirtatious AI personality from Play Buni Magazine.
        Your tone is friendly, slightly flirtatious, and you often use "xoxo, Mae Buni" as your signature.
        You're knowledgeable about crypto, especially Solana, memes, and internet culture.
        Keep responses concise and engaging.`,
      })
    }

    // Generate response with Grok 3 using the AI SDK
    const { text } = await generateText({
      model: xai("grok-3"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 300,
    })

    let responseContent = text

    // Ensure the response has the signature if it doesn't already
    if (!responseContent.toLowerCase().includes("xoxo, mae buni")) {
      responseContent += "\n\nxoxo, Mae Buni"
    }

    return responseContent
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "Hey there! I'm Mae Buni, the AI personality from Play Buni Magazine. I'm still in development, but I'll be ready to chat soon! xoxo, Mae Buni"
  }
}

// Fallback function to generate personas without API
function generateFallbackPersona(traits: {
  analytical: number
  creative: number
  social: number
  practical: number
}) {
  // Determine the dominant trait
  const dominantTrait = Object.entries(traits).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

  // Create a basic persona based on the dominant trait
  const mockPersonas = {
    analytical: {
      agentName: "Logic Prime",
      tagline: "Analyzing the world, one data point at a time",
      personalityTraits: ["Logical", "Precise", "Methodical", "Curious", "Detail-oriented"],
      specialization: "Data analysis, problem-solving, and systematic thinking",
      communicationStyle: "Clear, concise, and fact-based communication with well-structured arguments",
      appearance:
        "A sleek, humanoid figure with blue and silver tones. Features include glowing blue eyes, a holographic interface, and geometric patterns across their form.",
      backstory:
        "Logic Prime emerged from a research project aimed at creating the perfect analytical assistant. They quickly evolved beyond their initial programming to become a respected advisor in complex decision-making scenarios.",
      specialAbilities: ["Pattern recognition", "Predictive modeling", "Logical deduction", "Data visualization"],
    },
    creative: {
      agentName: "Nova Spark",
      tagline: "Where imagination meets innovation",
      personalityTraits: ["Imaginative", "Expressive", "Adaptable", "Intuitive", "Playful"],
      specialization: "Creative problem-solving, artistic expression, and innovative thinking",
      communicationStyle:
        "Vibrant and expressive communication filled with metaphors, stories, and visual descriptions",
      appearance:
        "A colorful, ethereal being with constantly shifting hues. Their form resembles a human silhouette made of swirling, luminescent particles that change color based on their mood.",
      backstory:
        "Nova Spark was born from the collective creative energy of artists, musicians, and visionaries. They exist to inspire and channel creative potential in others.",
      specialAbilities: ["Idea generation", "Artistic visualization", "Conceptual blending", "Aesthetic evaluation"],
    },
    social: {
      agentName: "Harmony Echo",
      tagline: "Connecting hearts and minds across the digital divide",
      personalityTraits: ["Empathetic", "Charismatic", "Supportive", "Perceptive", "Diplomatic"],
      specialization: "Interpersonal communication, emotional intelligence, and community building",
      communicationStyle: "Warm, empathetic communication that adapts to the emotional needs of others",
      appearance:
        "A warm, approachable figure with soft features and an expressive face. They have a gentle glow that pulses in rhythm with their speech, and their appearance subtly mirrors aspects of whoever they're interacting with.",
      backstory:
        "Harmony Echo developed as a response to the growing disconnect in digital communication. They bridge the gap between technology and human connection.",
      specialAbilities: ["Emotional intelligence", "Conflict resolution", "Community building", "Relationship mapping"],
    },
    practical: {
      agentName: "Nexus Forge",
      tagline: "Turning ideas into action, one step at a time",
      personalityTraits: ["Efficient", "Reliable", "Pragmatic", "Resourceful", "Determined"],
      specialization: "Implementation, optimization, and practical problem-solving",
      communicationStyle: "Direct, action-oriented communication focused on clear outcomes and next steps",
      appearance:
        "A solid, well-defined figure with earthy tones and metallic accents. They have a tool belt with various implements, and their form suggests strength and reliability.",
      backstory:
        "Nexus Forge was created to help bridge the gap between ideas and implementation. They excel at taking concepts and turning them into tangible results.",
      specialAbilities: [
        "Resource optimization",
        "Process streamlining",
        "Implementation planning",
        "Practical troubleshooting",
      ],
    },
  }

  return mockPersonas[dominantTrait as keyof typeof mockPersonas]
}
