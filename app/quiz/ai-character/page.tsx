"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { generateAgentImage } from "../actions/generate-image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Download, Share2, RefreshCw, User, Brain, Sparkles, Zap, Loader2, Eye } from "lucide-react"
import { generatePersona } from "../actions/generate-persona"
import { AgentImageDisplay } from "@/components/agent-image-display"
import { storePersona } from "../actions/persona-actions"

type Question = {
  id: number
  text: string
  options: {
    id: string
    text: string
    score: {
      analytical: number
      creative: number
      social: number
      practical: number
    }
  }[]
}

type Result = {
  type: string
  description: string
  character: string
  icon: React.ReactNode
  color: string
}

type PersonalInfo = {
  name: string
  interests: string[]
  communication: string
  strengths: string[]
}

type AIPersona = {
  agentName: string
  tagline: string
  personalityTraits: string[]
  specialization: string
  communicationStyle: string
  appearance: string
  backstory: string
  specialAbilities: string[]
  id?: string
  imageUrl?: string
}

// Enhanced questions for a more comprehensive assessment
const questions: Question[] = [
  {
    id: 1,
    text: "When faced with a complex problem, you prefer to:",
    options: [
      {
        id: "1a",
        text: "Break it down into logical components and analyze each part",
        score: { analytical: 3, creative: 0, social: 0, practical: 1 },
      },
      {
        id: "1b",
        text: "Brainstorm creative and unconventional solutions",
        score: { analytical: 0, creative: 3, social: 0, practical: 0 },
      },
      {
        id: "1c",
        text: "Discuss it with others to get different perspectives",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "1d",
        text: "Focus on practical, proven approaches that have worked before",
        score: { analytical: 1, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 2,
    text: "In a conversation, you're most interested in discussing:",
    options: [
      {
        id: "2a",
        text: "Abstract concepts and theoretical ideas",
        score: { analytical: 3, creative: 1, social: 0, practical: 0 },
      },
      {
        id: "2b",
        text: "Art, stories, and creative expressions",
        score: { analytical: 0, creative: 3, social: 1, practical: 0 },
      },
      {
        id: "2c",
        text: "People, relationships, and social dynamics",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "2d",
        text: "Practical matters and real-world applications",
        score: { analytical: 0, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "When making decisions, you typically:",
    options: [
      {
        id: "3a",
        text: "Weigh all evidence and analyze potential outcomes",
        score: { analytical: 3, creative: 0, social: 0, practical: 1 },
      },
      {
        id: "3b",
        text: "Follow your intuition and consider unique possibilities",
        score: { analytical: 0, creative: 3, social: 0, practical: 0 },
      },
      {
        id: "3c",
        text: "Consider how your choices will affect others",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "3d",
        text: "Focus on what's realistic and achievable",
        score: { analytical: 0, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 4,
    text: "Your ideal work environment is:",
    options: [
      {
        id: "4a",
        text: "Structured and focused on complex problem-solving",
        score: { analytical: 3, creative: 0, social: 0, practical: 1 },
      },
      {
        id: "4b",
        text: "Flexible and encouraging of innovation and new ideas",
        score: { analytical: 0, creative: 3, social: 0, practical: 0 },
      },
      {
        id: "4c",
        text: "Collaborative with plenty of team interaction",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "4d",
        text: "Efficient and focused on tangible results",
        score: { analytical: 1, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 5,
    text: "When learning something new, you prefer to:",
    options: [
      {
        id: "5a",
        text: "Understand the underlying principles and theories",
        score: { analytical: 3, creative: 0, social: 0, practical: 0 },
      },
      {
        id: "5b",
        text: "Explore it in your own unique way",
        score: { analytical: 0, creative: 3, social: 0, practical: 0 },
      },
      {
        id: "5c",
        text: "Learn alongside others in a group setting",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "5d",
        text: "Focus on practical applications and hands-on experience",
        score: { analytical: 0, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 6,
    text: "When communicating information, you tend to:",
    options: [
      {
        id: "6a",
        text: "Present detailed analysis with supporting evidence",
        score: { analytical: 3, creative: 0, social: 0, practical: 1 },
      },
      {
        id: "6b",
        text: "Use metaphors, stories, and visual elements",
        score: { analytical: 0, creative: 3, social: 1, practical: 0 },
      },
      {
        id: "6c",
        text: "Focus on how the information affects people",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "6d",
        text: "Get straight to the point with actionable takeaways",
        score: { analytical: 1, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 7,
    text: "You're most energized when:",
    options: [
      {
        id: "7a",
        text: "Solving complex puzzles or intellectual challenges",
        score: { analytical: 3, creative: 1, social: 0, practical: 0 },
      },
      {
        id: "7b",
        text: "Expressing yourself through creative endeavors",
        score: { analytical: 0, creative: 3, social: 0, practical: 0 },
      },
      {
        id: "7c",
        text: "Connecting with others and building relationships",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "7d",
        text: "Completing tasks and seeing tangible progress",
        score: { analytical: 0, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
  {
    id: 8,
    text: "When faced with a conflict, you typically:",
    options: [
      {
        id: "8a",
        text: "Analyze the situation objectively to find the logical solution",
        score: { analytical: 3, creative: 0, social: 0, practical: 0 },
      },
      {
        id: "8b",
        text: "Look for innovative compromises that satisfy all parties",
        score: { analytical: 0, creative: 3, social: 1, practical: 0 },
      },
      {
        id: "8c",
        text: "Focus on maintaining harmony and understanding emotions",
        score: { analytical: 0, creative: 0, social: 3, practical: 0 },
      },
      {
        id: "8d",
        text: "Seek the most efficient resolution to move forward",
        score: { analytical: 1, creative: 0, social: 0, practical: 3 },
      },
    ],
  },
]

// Predefined interests for users to select from
const interestOptions = [
  { id: "tech", label: "Technology" },
  { id: "art", label: "Art & Design" },
  { id: "science", label: "Science" },
  { id: "literature", label: "Literature" },
  { id: "music", label: "Music" },
  { id: "gaming", label: "Gaming" },
  { id: "sports", label: "Sports" },
  { id: "cooking", label: "Cooking" },
  { id: "travel", label: "Travel" },
  { id: "finance", label: "Finance" },
  { id: "philosophy", label: "Philosophy" },
  { id: "nature", label: "Nature" },
  { id: "history", label: "History" },
  { id: "fashion", label: "Fashion" },
  { id: "film", label: "Film & TV" },
  { id: "crypto", label: "Cryptocurrency" },
]

// Communication style options
const communicationStyles = [
  { id: "direct", label: "Direct and straightforward" },
  { id: "diplomatic", label: "Diplomatic and tactful" },
  { id: "expressive", label: "Expressive and animated" },
  { id: "analytical", label: "Analytical and detailed" },
  { id: "casual", label: "Casual and conversational" },
  { id: "formal", label: "Formal and structured" },
]

// Strength options
const strengthOptions = [
  { id: "problem-solving", label: "Problem-solving" },
  { id: "creativity", label: "Creativity" },
  { id: "empathy", label: "Empathy" },
  { id: "organization", label: "Organization" },
  { id: "leadership", label: "Leadership" },
  { id: "adaptability", label: "Adaptability" },
  { id: "technical", label: "Technical skills" },
  { id: "communication", label: "Communication" },
  { id: "strategic", label: "Strategic thinking" },
  { id: "detail", label: "Attention to detail" },
  { id: "resilience", label: "Resilience" },
  { id: "innovation", label: "Innovation" },
]

const results: Result[] = [
  {
    type: "The Analytical Mind",
    description:
      "You approach the world through logic and systematic thinking. You excel at breaking down complex problems and finding rational solutions. Your analytical nature makes you excellent at spotting patterns and inconsistencies.",
    character: "UmbrA",
    icon: <Brain className="text-blue-500" />,
    color: "blue",
  },
  {
    type: "The Creative Spirit",
    description:
      "You see the world through a lens of possibilities and imagination. You're drawn to novel ideas and creative expression. Your innovative thinking helps you find unique solutions that others might miss.",
    character: "NyX",
    icon: <Sparkles className="text-purple-500" />,
    color: "purple",
  },
  {
    type: "The Social Connector",
    description:
      "You navigate the world through relationships and emotional intelligence. You excel at understanding people and building connections. Your empathetic nature makes you a natural mediator and community builder.",
    character: "Mae Buni",
    icon: <User className="text-pink-500" />,
    color: "pink",
  },
  {
    type: "The Practical Achiever",
    description:
      "You engage with the world through action and tangible results. You excel at implementing ideas and getting things done efficiently. Your pragmatic approach helps turn concepts into reality.",
    character: "Wile E. Crypto",
    icon: <Zap className="text-green-500" />,
    color: "green",
  },
]

export default function AICharacterQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [scores, setScores] = useState({ analytical: 0, creative: 0, social: 0, practical: 0 })
  const [result, setResult] = useState<Result | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    interests: [],
    communication: "",
    strengths: [],
  })
  const [stage, setStage] = useState<"quiz" | "personalInfo" | "generating" | "result">("quiz")
  const [generatedPersona, setGeneratedPersona] = useState<AIPersona | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  // Calculate progress percentage
  useEffect(() => {
    if (stage === "quiz") {
      setProgress((Object.keys(answers).length / questions.length) * 100)
    } else if (stage === "personalInfo") {
      setProgress(100)
    }
  }, [answers, stage])

  const handleAnswer = (questionId: number, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId }
    setAnswers(newAnswers)

    // Find the selected option
    const question = questions.find((q) => q.id === questionId)
    const option = question?.options.find((o) => o.id === optionId)

    if (option) {
      // Update scores
      setScores({
        analytical: scores.analytical + option.score.analytical,
        creative: scores.creative + option.score.creative,
        social: scores.social + option.score.social,
        practical: scores.practical + option.score.practical,
      })
    }

    // Move to next question or show result
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult()
      setStage("personalInfo")
    }
  }

  const calculateResult = () => {
    // Find the highest score
    const highestScore = Math.max(scores.analytical, scores.creative, scores.social, scores.practical)

    let resultType: string

    if (highestScore === scores.analytical) {
      resultType = "The Analytical Mind"
    } else if (highestScore === scores.creative) {
      resultType = "The Creative Spirit"
    } else if (highestScore === scores.social) {
      resultType = "The Social Connector"
    } else {
      resultType = "The Practical Achiever"
    }

    const matchedResult = results.find((r) => r.type === resultType) || results[0]
    setResult(matchedResult)
  }

  const handleInterestChange = (interest: string) => {
    setPersonalInfo((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
      return { ...prev, interests: newInterests }
    })
  }

  const handleStrengthChange = (strength: string) => {
    setPersonalInfo((prev) => {
      const newStrengths = prev.strengths.includes(strength)
        ? prev.strengths.filter((s) => s !== strength)
        : [...prev.strengths, strength]
      return { ...prev, strengths: newStrengths }
    })
  }

  const handlePersonalInfoSubmit = async () => {
    if (!personalInfo.name) {
      setError("Please enter your name")
      return
    }
    if (personalInfo.interests.length === 0) {
      setError("Please select at least one interest")
      return
    }
    if (!personalInfo.communication) {
      setError("Please select your communication style")
      return
    }
    if (personalInfo.strengths.length === 0) {
      setError("Please select at least one strength")
      return
    }

    setError(null)
    setStage("generating")

    try {
      const response = await generatePersona(scores, personalInfo)

      if (response.success && response.persona) {
        setGeneratedPersona(response.persona)
        setStage("result")
        setShowResult(true)

        // Determine dominant trait
        const dominantTrait = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

        // Store the persona in Redis (don't wait for this to complete)
        storePersona(response.persona, dominantTrait).catch((err) => {
          console.error("Error storing persona:", err)
        })
      } else {
        throw new Error(response.error || "Failed to generate persona")
      }
    } catch (err) {
      console.error("Error generating persona:", err)
      setError("Failed to generate your AI persona. Please try again.")
      setStage("personalInfo")
    }
  }

  const handleGenerateImage = async () => {
    if (!generatedPersona) return

    setIsGeneratingImage(true)
    setImageError(null)

    try {
      const result = await generateAgentImage(
        {
          agentName: generatedPersona.agentName,
          appearance: generatedPersona.appearance,
          personalityTraits: generatedPersona.personalityTraits,
        },
        scores,
      )

      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl)

        // Determine dominant trait for storing
        const dominantTrait = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

        // Update the persona in Redis with the image URL (don't wait for this to complete)
        if (generatedPersona.id) {
          storePersona({ ...generatedPersona, imageUrl: result.imageUrl }, dominantTrait).catch((err) => {
            console.error("Error updating persona with image:", err)
          })
        }
      } else {
        throw new Error(result.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      setImageError("Failed to generate image. Please try again.")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setScores({ analytical: 0, creative: 0, social: 0, practical: 0 })
    setResult(null)
    setShowResult(false)
    setPersonalInfo({
      name: "",
      interests: [],
      communication: "",
      strengths: [],
    })
    setGeneratedPersona(null)
    setError(null)
    setStage("quiz")
  }

  const downloadPersona = () => {
    if (!generatedPersona) return

    const personaData = JSON.stringify(generatedPersona, null, 2)
    const blob = new Blob([personaData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${generatedPersona.agentName.replace(/\s+/g, "_")}_Persona.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sharePersona = () => {
    if (!generatedPersona) return

    // Create a shareable text
    const shareText = `I just discovered my AI agent persona: ${generatedPersona.agentName} - ${generatedPersona.tagline}! Take the quiz at Play Buni Magazine to find yours!`

    // Use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: "My AI Agent Persona",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText).then(
        () => alert("Copied to clipboard! Share with your friends."),
        () => alert("Failed to copy to clipboard"),
      )
    }
  }

  const question = questions[currentQuestion]

  // Determine the color scheme based on the result
  const getColorScheme = () => {
    if (!result) return "indigo"
    switch (result.color) {
      case "blue":
        return "blue"
      case "purple":
        return "purple"
      case "pink":
        return "pink"
      case "green":
        return "green"
      default:
        return "indigo"
    }
  }

  const colorScheme = getColorScheme()
  const gradientClasses = {
    blue: "from-blue-600 to-blue-800",
    purple: "from-purple-600 to-purple-800",
    pink: "from-pink-600 to-pink-800",
    green: "from-green-600 to-green-800",
    indigo: "from-indigo-600 to-indigo-800",
  }

  const buttonClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    pink: "bg-pink-600 hover:bg-pink-700",
    green: "bg-green-600 hover:bg-green-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  }

  const downloadImage = () => {
    if (!generatedImageUrl) return

    const link = document.createElement("a")
    link.href = generatedImageUrl
    link.download = `${generatedPersona?.agentName.replace(/\s+/g, "_") || "AI_Agent"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradientClasses[colorScheme]} py-12`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl font-black mb-2 text-white">Which AI Character Agent Are You?</h1>
              <p className="text-xl text-white/80">
                Discover your unique AI agent persona with our enhanced quiz powered by Grok3
              </p>
            </div>
            <Link href="/quiz/gallery">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Eye className="mr-2 h-4 w-4" />
                View Character Gallery
              </Button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>

          {stage === "quiz" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  Question {currentQuestion + 1} of {questions.length}
                </CardTitle>
                <CardDescription>{question.text}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={answers[question.id]} onValueChange={(value) => handleAnswer(question.id, value)}>
                  <div className="space-y-4">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={() => {
                      calculateResult()
                      setStage("personalInfo")
                    }}
                    disabled={!answers[question.id]}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={!answers[question.id]}>
                    Next
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {stage === "personalInfo" && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Personalize Your AI Agent</CardTitle>
                    <CardDescription>
                      Tell us a bit more about yourself to create a truly unique AI agent persona
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Your Interests (select at least one)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {interestOptions.map((interest) => (
                          <div key={interest.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`interest-${interest.id}`}
                              checked={personalInfo.interests.includes(interest.label)}
                              onCheckedChange={() => handleInterestChange(interest.label)}
                            />
                            <Label htmlFor={`interest-${interest.id}`} className="cursor-pointer">
                              {interest.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Your Communication Style</Label>
                      <RadioGroup
                        value={personalInfo.communication}
                        onValueChange={(value) => setPersonalInfo({ ...personalInfo, communication: value })}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {communicationStyles.map((style) => (
                            <div
                              key={style.id}
                              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                            >
                              <RadioGroupItem value={style.id} id={`comm-${style.id}`} />
                              <Label htmlFor={`comm-${style.id}`} className="flex-grow cursor-pointer">
                                {style.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Your Strengths (select at least one)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {strengthOptions.map((strength) => (
                          <div key={strength.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`strength-${strength.id}`}
                              checked={personalInfo.strengths.includes(strength.label)}
                              onCheckedChange={() => handleStrengthChange(strength.label)}
                            />
                            <Label htmlFor={`strength-${strength.id}`} className="cursor-pointer">
                              {strength.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStage("quiz")}>
                      Back to Quiz
                    </Button>
                    <Button className={buttonClasses[colorScheme]} onClick={handlePersonalInfoSubmit}>
                      Generate My AI Persona
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}

          {stage === "generating" && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-xl"
              >
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Creating Your AI Persona</h2>
                <p className="text-gray-600 text-center mb-4">
                  Grok3 is analyzing your responses and crafting a unique AI agent persona just for you...
                </p>
                <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
                  <motion.div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  ></motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {showResult && stage === "result" && result && generatedPersona && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <Card>
                  <CardHeader
                    className={`text-center bg-gradient-to-r ${gradientClasses[colorScheme]} text-white rounded-t-lg`}
                  >
                    <CardTitle className="text-2xl">Your AI Agent Persona</CardTitle>
                    <CardDescription className="text-white opacity-90">
                      Based on your unique traits and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="persona" className="w-full">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="persona">Persona</TabsTrigger>
                        <TabsTrigger value="image">Image</TabsTrigger>
                        <TabsTrigger value="traits">Your Traits</TabsTrigger>
                      </TabsList>

                      <TabsContent value="persona" className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-3xl font-bold mb-2">{generatedPersona.agentName}</h2>
                          <p className="text-lg italic text-gray-600">"{generatedPersona.tagline}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold">Personality Traits</h3>
                              <ul className="list-disc list-inside">
                                {generatedPersona.personalityTraits.map((trait, index) => (
                                  <li key={index} className="text-gray-700">
                                    {trait}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold">Specialization</h3>
                              <p className="text-gray-700">{generatedPersona.specialization}</p>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold">Communication Style</h3>
                              <p className="text-gray-700">{generatedPersona.communicationStyle}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold">Appearance</h3>
                              <p className="text-gray-700">{generatedPersona.appearance}</p>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold">Special Abilities</h3>
                              <ul className="list-disc list-inside">
                                {generatedPersona.specialAbilities.map((ability, index) => (
                                  <li key={index} className="text-gray-700">
                                    {ability}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold">Backstory</h3>
                          <p className="text-gray-700">{generatedPersona.backstory}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="image" className="space-y-6">
                        <div className="flex flex-col items-center justify-center">
                          {!generatedImageUrl && !isGeneratingImage && (
                            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <h3 className="text-lg font-medium mb-2">Generate Your AI Agent Image</h3>
                              <p className="text-gray-500 mb-4">
                                Create a visual representation of your AI agent persona using Grok2
                              </p>
                              {imageError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                  {imageError}
                                </div>
                              )}
                              <Button onClick={handleGenerateImage} className={`${buttonClasses[colorScheme]}`}>
                                Generate Image
                              </Button>
                            </div>
                          )}

                          {isGeneratingImage && (
                            <div className="text-center p-8 border-2 border-gray-200 rounded-lg mb-4">
                              <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
                              <h3 className="text-lg font-medium mb-2">Generating Your AI Agent Image</h3>
                              <p className="text-gray-500">
                                Grok2 is creating a unique visual representation of {generatedPersona?.agentName}...
                              </p>
                            </div>
                          )}

                          {generatedImageUrl && !isGeneratingImage && (
                            <AgentImageDisplay
                              imageUrl={generatedImageUrl}
                              agentName={generatedPersona?.agentName || "AI Agent"}
                              onRegenerate={handleGenerateImage}
                              onDownload={downloadImage}
                              colorScheme={colorScheme as "blue" | "purple" | "pink" | "green" | "indigo"}
                              isLoading={isGeneratingImage}
                            />
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="traits">
                        <div className="space-y-6">
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold">{result.type}</h3>
                            <p className="text-gray-600">{result.description}</p>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-bold text-lg">Your Score Breakdown:</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Analytical</span>
                                  <span>{Math.round((scores.analytical / (8 * 3)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${(scores.analytical / (8 * 3)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Creative</span>
                                  <span>{Math.round((scores.creative / (8 * 3)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-purple-600 h-2.5 rounded-full"
                                    style={{ width: `${(scores.creative / (8 * 3)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Social</span>
                                  <span>{Math.round((scores.social / (8 * 3)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-pink-500 h-2.5 rounded-full"
                                    style={{ width: `${(scores.social / (8 * 3)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Practical</span>
                                  <span>{Math.round((scores.practical / (8 * 3)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-green-500 h-2.5 rounded-full"
                                    style={{ width: `${(scores.practical / (8 * 3)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-bold text-lg">Your Personal Info:</h3>
                            <div className="bg-gray-100 p-4 rounded-lg">
                              <p>
                                <strong>Name:</strong> {personalInfo.name}
                              </p>
                              <p>
                                <strong>Interests:</strong> {personalInfo.interests.join(", ")}
                              </p>
                              <p>
                                <strong>Communication Style:</strong> {personalInfo.communication}
                              </p>
                              <p>
                                <strong>Strengths:</strong> {personalInfo.strengths.join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-center gap-3">
                    <Button onClick={resetQuiz} variant="outline" className="flex items-center gap-2">
                      <RefreshCw size={16} />
                      Take Quiz Again
                    </Button>
                    <Button onClick={downloadPersona} variant="outline" className="flex items-center gap-2">
                      <Download size={16} />
                      Download Persona
                    </Button>
                    <Button onClick={sharePersona} className={`flex items-center gap-2 ${buttonClasses[colorScheme]}`}>
                      <Share2 size={16} />
                      Share Result
                    </Button>
                    <Link href="/quiz/gallery">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Eye size={16} />
                        View Gallery
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <div className="text-center">
                  <Link href="/articles" className="text-white hover:underline font-medium">
                    ← Back to Table of Contents
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
