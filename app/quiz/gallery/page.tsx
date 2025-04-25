"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Brain, Sparkles, User, Zap, ArrowLeft, Eye } from "lucide-react"
import { fetchRecentPersonas, fetchPersonaStats } from "../actions/persona-actions"
import type { AIPersona } from "@/lib/persona-service"

export default function GalleryPage() {
  const [personas, setPersonas] = useState<AIPersona[]>([])
  const [stats, setStats] = useState({ analytical: 0, creative: 0, social: 0, practical: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<AIPersona | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Fetch recent personas
        const personasResult = await fetchRecentPersonas(20)
        if (personasResult.success) {
          setPersonas(personasResult.personas)
        } else {
          console.warn("Could not fetch personas:", personasResult.error)
          // Don't throw an error here, just set empty personas
          setPersonas([])
        }

        // Fetch stats
        const statsResult = await fetchPersonaStats()
        if (statsResult.success) {
          setStats(statsResult.stats)
        } else {
          console.warn("Could not fetch stats:", statsResult.error)
          // Don't throw an error here, just use default stats
        }
      } catch (err) {
        console.error("Error loading gallery data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Prepare data for pie chart
  const chartData = [
    { name: "Analytical", value: stats.analytical, color: "#3b82f6" },
    { name: "Creative", value: stats.creative, color: "#8b5cf6" },
    { name: "Social", value: stats.social, color: "#ec4899" },
    { name: "Practical", value: stats.practical, color: "#10b981" },
  ]

  const getTraitIcon = (trait: string) => {
    switch (trait) {
      case "analytical":
        return <Brain className="text-blue-500" />
      case "creative":
        return <Sparkles className="text-purple-500" />
      case "social":
        return <User className="text-pink-500" />
      case "practical":
        return <Zap className="text-green-500" />
      default:
        return <Sparkles className="text-gray-500" />
    }
  }

  const getTraitColor = (trait: string) => {
    switch (trait) {
      case "analytical":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "creative":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "social":
        return "bg-pink-100 text-pink-800 border-pink-300"
      case "practical":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">AI Character Gallery</h1>
              <p className="text-indigo-200">Discover the unique AI personas created by the Play Buni community</p>
            </div>
            <Link href="/quiz/ai-character">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Take the Quiz
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-white/10">
              <TabsTrigger
                value="gallery"
                className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Character Gallery
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Community Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
              ) : personas.length === 0 ? (
                <div className="text-center py-12 bg-white/10 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-2">No personas yet</h3>
                  <p className="text-indigo-200 mb-4">Be the first to create an AI character!</p>
                  <Link href="/quiz/ai-character">
                    <Button>Take the Quiz</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personas.map((persona) => (
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{persona.agentName}</CardTitle>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getTraitColor(persona.dominantTrait)}`}
                            >
                              <div className="flex items-center">
                                {getTraitIcon(persona.dominantTrait)}
                                <span className="ml-1 capitalize">{persona.dominantTrait}</span>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="italic">"{persona.tagline}"</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow pb-2">
                          {persona.imageUrl ? (
                            <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                              <img
                                src={persona.imageUrl || "/placeholder.svg"}
                                alt={persona.agentName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-48 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md flex items-center justify-center">
                              <p className="text-gray-400">No image available</p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-sm font-semibold">Personality</h4>
                              <p className="text-sm text-gray-500">{persona.personalityTraits.join(", ")}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Specialization</h4>
                              <p className="text-sm text-gray-500 line-clamp-2">{persona.specialization}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" onClick={() => setSelectedPersona(persona)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">AI Character Type Distribution</CardTitle>
                  <CardDescription className="text-indigo-200">
                    See which AI character types are most common in the Play Buni community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} personas`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {chartData.map((type) => (
                      <div key={type.name} className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          {type.name === "Analytical" && <Brain size={24} className="text-blue-500" />}
                          {type.name === "Creative" && <Sparkles size={24} className="text-purple-500" />}
                          {type.name === "Social" && <User size={24} className="text-pink-500" />}
                          {type.name === "Practical" && <Zap size={24} className="text-green-500" />}
                        </div>
                        <h3 className="font-bold text-white">{type.name}</h3>
                        <p className="text-2xl font-bold" style={{ color: type.color }}>
                          {type.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Persona Detail Modal */}
          {selectedPersona && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPersona.agentName}</h2>
                      <p className="text-gray-600 italic">"{selectedPersona.tagline}"</p>
                    </div>
                    <Button variant="ghost" onClick={() => setSelectedPersona(null)}>
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {selectedPersona.imageUrl ? (
                        <div className="rounded-lg overflow-hidden mb-4">
                          <img
                            src={selectedPersona.imageUrl || "/placeholder.svg"}
                            alt={selectedPersona.agentName}
                            className="w-full h-auto"
                          />
                        </div>
                      ) : (
                        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                          <p className="text-gray-500">No image available</p>
                        </div>
                      )}

                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getTraitColor(selectedPersona.dominantTrait)}`}
                      >
                        {getTraitIcon(selectedPersona.dominantTrait)}
                        <span className="ml-1 capitalize">{selectedPersona.dominantTrait} Type</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold">Personality Traits</h3>
                        <ul className="list-disc list-inside">
                          {selectedPersona.personalityTraits.map((trait, i) => (
                            <li key={i}>{trait}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold">Specialization</h3>
                        <p>{selectedPersona.specialization}</p>
                      </div>

                      <div>
                        <h3 className="font-bold">Communication Style</h3>
                        <p>{selectedPersona.communicationStyle}</p>
                      </div>

                      <div>
                        <h3 className="font-bold">Special Abilities</h3>
                        <ul className="list-disc list-inside">
                          {selectedPersona.specialAbilities.map((ability, i) => (
                            <li key={i}>{ability}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold">Appearance</h3>
                    <p>{selectedPersona.appearance}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold">Backstory</h3>
                    <p>{selectedPersona.backstory}</p>
                  </div>

                  <div className="mt-6 text-right">
                    <Button variant="outline" onClick={() => setSelectedPersona(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
