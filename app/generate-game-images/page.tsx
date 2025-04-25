"use client"

import { useState, useEffect } from "react"
import { GameImageGenerator } from "@/components/game-image-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"

export default function GenerateGameImages() {
  const [images, setImages] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState("character")

  // Generate images when component mounts
  useEffect(() => {
    generateAllImages()
  }, [])

  const generateAllImages = () => {
    const imageTypes = [
      "character",
      "background",
      "platform-race",
      "meme-battle",
      "social-conquest",
      "avatar-1",
      "avatar-2",
      "avatar-3",
    ]

    imageTypes.forEach((type) => {
      if (type.startsWith("avatar")) {
        const avatarNumber = Number.parseInt(type.split("-")[1])
        generateImage("avatar", avatarNumber)
      } else {
        generateImage(type)
      }
    })
  }

  const generateImage = (
    type: "character" | "background" | "platform-race" | "meme-battle" | "social-conquest" | "avatar",
    avatarNumber = 1,
  ) => {
    const key = type === "avatar" ? `${type}-${avatarNumber}` : type

    const handleGenerated = (dataUrl: string) => {
      setImages((prev) => ({
        ...prev,
        [key]: dataUrl,
      }))
    }

    return (
      <div className="hidden">
        <GameImageGenerator
          type={type}
          avatarNumber={avatarNumber}
          width={type === "character" || type === "avatar" ? 400 : 800}
          height={type === "character" || type === "avatar" ? 400 : 500}
          onGenerated={handleGenerated}
        />
      </div>
    )
  }

  const downloadImage = (key: string) => {
    const link = document.createElement("a")
    link.href = images[key]
    link.download = `${key}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Meme Race Tournament Game Images</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="character">Character</TabsTrigger>
          <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
          <TabsTrigger value="avatars">Avatars</TabsTrigger>
        </TabsList>

        <TabsContent value="character" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pepe Character</CardTitle>
              <CardDescription>The main character for the Meme Race Tournament game</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {images["character"] && (
                <div className="relative">
                  <img
                    src={images["character"] || "/placeholder.svg"}
                    alt="Pepe Character"
                    className="rounded-lg border border-gray-200 shadow-md"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => downloadImage("character")} className="flex items-center gap-2">
                <Download size={16} />
                Download
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backgrounds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Game Background</CardTitle>
              <CardDescription>Platform game background with coins and platforms</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {images["background"] && (
                <div className="relative">
                  <img
                    src={images["background"] || "/placeholder.svg"}
                    alt="Game Background"
                    className="rounded-lg border border-gray-200 shadow-md"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => downloadImage("background")} className="flex items-center gap-2">
                <Download size={16} />
                Download
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="gameplay" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Race</CardTitle>
                <CardDescription>Super Mario-style platformer gameplay</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {images["platform-race"] && (
                  <div className="relative">
                    <img
                      src={images["platform-race"] || "/placeholder.svg"}
                      alt="Platform Race"
                      className="rounded-lg border border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => downloadImage("platform-race")} className="flex items-center gap-2">
                  <Download size={16} />
                  Download
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meme Battle</CardTitle>
                <CardDescription>Create and battle with memes</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {images["meme-battle"] && (
                  <div className="relative">
                    <img
                      src={images["meme-battle"] || "/placeholder.svg"}
                      alt="Meme Battle"
                      className="rounded-lg border border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => downloadImage("meme-battle")} className="flex items-center gap-2">
                  <Download size={16} />
                  Download
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Conquest</CardTitle>
                <CardDescription>Social media challenges and viral missions</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {images["social-conquest"] && (
                  <div className="relative">
                    <img
                      src={images["social-conquest"] || "/placeholder.svg"}
                      alt="Social Conquest"
                      className="rounded-lg border border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => downloadImage("social-conquest")} className="flex items-center gap-2">
                  <Download size={16} />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="avatars" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <Card key={num}>
                <CardHeader>
                  <CardTitle>Player Avatar {num}</CardTitle>
                  <CardDescription>Leaderboard player avatar</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  {images[`avatar-${num}`] && (
                    <div className="relative">
                      <img
                        src={images[`avatar-${num || "/placeholder.svg"}`]}
                        alt={`Player Avatar ${num}`}
                        className="rounded-lg border border-gray-200 shadow-md"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => downloadImage(`avatar-${num}`)} className="flex items-center gap-2">
                    <Download size={16} />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden image generators */}
      <div className="hidden">
        {generateImage("character")}
        {generateImage("background")}
        {generateImage("platform-race")}
        {generateImage("meme-battle")}
        {generateImage("social-conquest")}
        {generateImage("avatar", 1)}
        {generateImage("avatar", 2)}
        {generateImage("avatar", 3)}
      </div>
    </div>
  )
}
