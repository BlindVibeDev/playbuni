"use client"

import { useState } from "react"
import Image from "next/image"
import { CardContainer, CardBody, CardItem } from "@/components/3d-card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface EditionCardProps {
  imageSrc: string
  title: string
  color: string
  excerpt?: string
  className?: string
}

export function EnhancedEditionCard({ imageSrc, title, color, excerpt, className }: EditionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleTalkToMae = () => {
    router.push(`/chat?topic=edition&title=${encodeURIComponent(title)}`)
  }

  if (isExpanded) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
          className,
        )}
        onClick={() => setIsExpanded(false)}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto relative edition-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
            onClick={() => setIsExpanded(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <div
                className="rounded-lg overflow-hidden border-4 w-full max-w-[200px] mx-auto"
                style={{ borderColor: color }}
              >
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={title}
                  width={257}
                  height={364}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <div className="prose dark:prose-invert mb-6">
                <p>
                  {excerpt ||
                    "This edition features exclusive interviews, stunning photoshoots, and in-depth articles about the latest in crypto, tech, and culture. Join Mae Buni as she explores the digital frontier and shares insights about the future of Play Buni."}
                </p>
              </div>

              <Button
                className="w-full md:w-auto"
                onClick={handleTalkToMae}
                style={{
                  backgroundColor: color,
                  color: isLightColor(color) ? "black" : "white",
                }}
              >
                Talk to Mae about this edition
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-[300px] flex-shrink-0 mx-4", className)} onClick={() => setIsExpanded(true)}>
      <CardContainer className="w-full cursor-pointer">
        <CardBody className="relative w-full h-auto aspect-[257/364] rounded-xl">
          <CardItem
            translateZ="100"
            className="w-full h-full rounded-xl overflow-hidden border-4"
            style={{ borderColor: color }}
          >
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={title}
              width={257}
              height={364}
              className="w-full h-full object-cover"
            />
          </CardItem>
          <CardItem
            translateZ="50"
            translateY="60"
            className="absolute bottom-0 left-0 right-0 px-4 py-2 text-center bg-black/70 backdrop-blur-sm rounded-b-lg"
          >
            <h3 className="text-white font-bold">{title}</h3>
          </CardItem>
          <CardItem
            translateZ="80"
            translateX="-40"
            translateY="-40"
            className="absolute top-0 left-0 w-24 h-24 rotate-12"
          >
            <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full blur-md" />
          </CardItem>
          <CardItem
            translateZ="60"
            translateX="40"
            translateY="40"
            className="absolute bottom-0 right-0 w-16 h-16 -rotate-12"
          >
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-md" />
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>
  )
}

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Simple implementation - could be improved
  const hex = color.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}
