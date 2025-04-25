"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useAnimationFrame, useMotionValue } from "motion/react"
import { cn } from "@/lib/utils"

interface MarqueeItemProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  isMedia?: boolean
}

interface MarqueeProps {
  className?: string
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  items: MarqueeItemProps[]
  isMediaRow?: boolean
}

export function Marquee({
  className,
  speed = 20,
  direction = "left",
  pauseOnHover = true,
  items,
  isMediaRow = false,
}: MarqueeProps) {
  const [duplicateCount, setDuplicateCount] = useState(3)
  const [hovering, setHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  // Calculate how many times to repeat the items to fill the container
  useEffect(() => {
    const calculateDuplicates = () => {
      if (containerRef.current && itemsRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const itemsWidth = itemsRef.current.offsetWidth
        const count = Math.ceil((containerWidth * 2) / itemsWidth) + 1
        setDuplicateCount(Math.max(count, 3))
      }
    }

    calculateDuplicates()
    window.addEventListener("resize", calculateDuplicates)
    return () => window.removeEventListener("resize", calculateDuplicates)
  }, [])

  // Animation
  useAnimationFrame((_, delta) => {
    if (pauseOnHover && hovering) return

    // Calculate movement based on direction and speed
    const moveBy = (direction === "left" ? -1 : 1) * speed * (delta / 1000)

    // Update position
    const newX = x.get() + moveBy

    // Handle wrapping
    if (itemsRef.current) {
      const itemsWidth = itemsRef.current.offsetWidth

      // If we've moved beyond the width of one set of items, reset to create infinite loop effect
      if (direction === "left" && newX <= -itemsWidth) {
        x.set(0)
      } else if (direction === "right" && newX >= itemsWidth) {
        x.set(0)
      } else {
        x.set(newX)
      }
    } else {
      x.set(newX)
    }
  })

  // Create duplicated items for seamless looping
  const renderItems = () => {
    const itemsArray = []

    for (let i = 0; i < duplicateCount; i++) {
      itemsArray.push(
        <div key={i} ref={i === 0 ? itemsRef : undefined} className="flex items-center flex-nowrap">
          {items.map((item, itemIndex) => (
            <div
              key={`${i}-${itemIndex}`}
              className={cn("flex-shrink-0", isMediaRow ? "mx-1 md:mx-2" : "mx-4 md:mx-6")}
            >
              {isMediaRow ? (
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-56 h-36 md:w-64 md:h-40">
                    <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                    {item.alt}
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative w-28 h-28 md:w-32 md:h-32 bg-cream-100 rounded-lg p-2 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-contain p-3" />
                  </div>
                  <div className="text-center mt-2 text-sm font-medium">{item.alt}</div>
                </>
              )}
            </div>
          ))}
        </div>,
      )
    }

    return itemsArray
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden relative", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex">
        <motion.div className="flex items-center" style={{ x }}>
          {renderItems()}
        </motion.div>

        {/* Duplicate for seamless looping */}
        <motion.div
          className="flex items-center"
          style={{
            x:
              direction === "left"
                ? x.get() + (itemsRef.current?.offsetWidth || 0)
                : x.get() - (itemsRef.current?.offsetWidth || 0),
          }}
        >
          {renderItems()}
        </motion.div>
      </div>
    </div>
  )
}

export function LogoMarqueeSection() {
  // Vintage tech logos
  const logos = [
    { src: "/images/logo-elizaos.png", alt: "ElizaOS Framework" },
    { src: "/images/logo-supabase.png", alt: "Supabase" },
    { src: "/images/logo-anthropic.png", alt: "Anthropic Trusted AI" },
    { src: "/images/logo-vercel.png", alt: "Vercel Service" },
  ]

  // Expanded platform media images - added many more items for a truly endless appearance
  const platformMedia = [
    // Magazine covers and promotional images
    { src: "/images/buni-cover.png", alt: "Magazine Cover" },
    { src: "/images/buni-cover-poster.png", alt: "April Edition" },
    { src: "/images/buni-card.png", alt: "Collector Card" },

    // Character images
    { src: "/images/mae-buni.png", alt: "Mae Buni" },
    { src: "/images/buni-peeking.png", alt: "Buni Chat Assistant" },

    // Feature images
    { src: "/images/buni-rocket.png", alt: "Rocket Feature" },
    { src: "/images/buni-cards.png", alt: "Content Cards" },

    // Article screenshots
    { src: "/images/background.png", alt: "Article Background" },
    { src: "/images/buni-pattern-bg.png", alt: "Pattern Background" },
    { src: "/images/bgpb.png", alt: "Featured Article" },

    // UI elements
    { src: "/images/buni-stamp.png", alt: "Buni Stamp" },
    { src: "/images/play-buni-stamp.png", alt: "Play Buni Logo" },
    { src: "/images/buni-character.png", alt: "Character Profile" },

    // Additional variations with different captions
    { src: "/images/buni-cover.png", alt: "Latest Issue" },
    { src: "/images/buni-card.png", alt: "Premium Content" },
    { src: "/images/mae-buni.png", alt: "Centerfold Feature" },
  ]

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-red-600 font-impact text-center mb-8">Powered By</h2>
        <p className="text-xl text-gray-700 text-center mb-12">Cutting-edge technology with a vintage feel</p>

        <div className="space-y-16">
          <Marquee direction="left" speed={25} items={logos} />
          <Marquee direction="right" speed={20} items={platformMedia} isMediaRow={true} />
        </div>
      </div>
    </div>
  )
}
