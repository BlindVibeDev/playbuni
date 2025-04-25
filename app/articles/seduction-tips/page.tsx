"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Star background components
interface StarProps {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number | null
}

interface StarBackgroundProps {
  starDensity?: number
  allStarsTwinkle?: boolean
  twinkleProbability?: number
  minTwinkleSpeed?: number
  maxTwinkleSpeed?: number
  className?: string
}

const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height
      const numStars = Math.floor(area * starDensity)
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) : null,
        }
      })
    },
    [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed],
  )

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const { width, height } = canvas.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        setStars(generateStars(width, height))
      }
    }

    updateStars()

    const resizeObserver = new ResizeObserver(updateStars)
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current)
    }

    return () => {
      if (canvasRef.current) {
        resizeObserver.unobserve(canvasRef.current)
      }
    }
  }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed, generateStars])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        if (star.twinkleSpeed !== null) {
          star.opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5)
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [stars])

  return <canvas ref={canvasRef} className={cn("h-full w-full absolute inset-0", className)} />
}

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  scale: number
  speed: number
  distance: number
}

interface ShootingStarsProps {
  minSpeed?: number
  maxSpeed?: number
  minDelay?: number
  maxDelay?: number
  starColor?: string
  trailColor?: string
  starWidth?: number
  starHeight?: number
  className?: string
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4)
  const offset = Math.random() * window.innerWidth

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 }
    case 1:
      return { x: window.innerWidth, y: offset, angle: 135 }
    case 2:
      return { x: offset, y: window.innerHeight, angle: 225 }
    case 3:
      return { x: 0, y: offset, angle: 315 }
    default:
      return { x: 0, y: 0, angle: 45 }
  }
}

const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className,
}) => {
  const [star, setStar] = useState<ShootingStar | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint()
      const newStar: ShootingStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      }
      setStar(newStar)

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay
      setTimeout(createStar, randomDelay)
    }

    createStar()

    return () => {}
  }, [minSpeed, maxSpeed, minDelay, maxDelay])

  useEffect(() => {
    const moveStar = () => {
      if (star) {
        setStar((prevStar) => {
          if (!prevStar) return null
          const newX = prevStar.x + prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180)
          const newY = prevStar.y + prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180)
          const newDistance = prevStar.distance + prevStar.speed
          const newScale = 1 + newDistance / 100
          if (newX < -20 || newX > window.innerWidth + 20 || newY < -20 || newY > window.innerHeight + 20) {
            return null
          }
          return {
            ...prevStar,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          }
        })
      }
    }

    const animationFrame = requestAnimationFrame(moveStar)
    return () => cancelAnimationFrame(animationFrame)
  }, [star])

  return (
    <svg ref={svgRef} className={cn("w-full h-full absolute inset-0 pointer-events-none", className)}>
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
        />
      )}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Custom UI components for the cosmic theme
const CosmicCard = ({
  children,
  className,
  glowColor = "rgba(159, 0, 255, 0.4)",
  active = false,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  active?: boolean
}) => {
  return (
    <div
      className={cn(
        "relative rounded-xl backdrop-blur-md bg-black/40 border border-white/10",
        "transition-all duration-500 ease-out",
        active && "border-purple-500/50",
        className,
      )}
      style={{
        boxShadow: active ? `0 0 20px ${glowColor}` : "none",
      }}
    >
      {children}
    </div>
  )
}

const ConstellationLine = ({
  start,
  end,
  delay = 0,
  duration = 1.5,
}: {
  start: { x: number; y: number }
  end: { x: number; y: number }
  delay?: number
  duration?: number
}) => {
  return (
    <motion.line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
    />
  )
}

const ConstellationPoint = ({
  x,
  y,
  size = 3,
  delay = 0,
  pulse = false,
}: {
  x: number
  y: number
  size?: number
  delay?: number
  pulse?: boolean
}) => {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill="white"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: pulse ? [0, 1, 0.5, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
        opacity: pulse ? { repeat: Number.POSITIVE_INFINITY, duration: 2 } : undefined,
      }}
    />
  )
}

const CodeConstellation = ({ className }: { className?: string }) => {
  // Points for a code-like constellation
  const points = [
    { x: 20, y: 20 },
    { x: 60, y: 30 },
    { x: 100, y: 20 },
    { x: 120, y: 60 },
    { x: 80, y: 80 },
    { x: 30, y: 70 },
    { x: 20, y: 20 }, // Close the loop
  ]

  return (
    <svg className={cn("absolute inset-0 w-full h-full", className)}>
      {points.map((point, i) => (
        <ConstellationPoint key={i} x={point.x} y={point.y} delay={i * 0.1} pulse={i === 2} />
      ))}
      {points.map((point, i) => {
        if (i === points.length - 1) return null
        return <ConstellationLine key={i} start={point} end={points[i + 1]} delay={i * 0.1 + 0.1} />
      })}
    </svg>
  )
}

const SyntaxExample = ({
  title,
  description,
  code,
  highlightWords = [],
  index,
  isActive,
  onClick,
}: {
  title: string
  description: string
  code: string
  highlightWords?: string[]
  index: number
  isActive: boolean
  onClick: () => void
}) => {
  // Highlight specific words in the code
  const highlightedCode = code.split(" ").map((word, i) => {
    const isHighlighted = highlightWords.some((hw) => word.includes(hw))
    return (
      <span key={i} className={isHighlighted ? "text-purple-400 font-bold" : ""}>
        {word}{" "}
      </span>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-8"
    >
      <CosmicCard
        className={cn(
          "p-6 cursor-pointer transition-all duration-300",
          isActive ? "translate-y-[-5px]" : "hover:translate-y-[-3px]",
        )}
        active={isActive}
        glowColor="rgba(159, 0, 255, 0.6)"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="mb-4 text-gray-300">{description}</p>

            <div className="relative">
              <div className="font-mono text-sm rounded-lg p-4 bg-black/50 border border-purple-900/50 relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <p className="text-gray-300">{highlightedCode}</p>
              </div>

              {isActive && (
                <div className="absolute inset-0 -m-1 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-purple-500/10 backdrop-blur-sm"></div>
                  <CodeConstellation />
                </div>
              )}
            </div>
          </div>
        </div>
      </CosmicCard>
    </motion.div>
  )
}

export default function SeductionTipsPage() {
  const [activeExample, setActiveExample] = useState<number | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll to content when intro is dismissed
  useEffect(() => {
    if (!showIntro && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [showIntro])

  const examples = [
    {
      title: "Use Embedded Commands",
      description:
        "Embedded commands subtly influence thoughts and feelings when nested within larger statements. They bypass conscious resistance and speak directly to the subconscious.",
      code: "As you read this code, you might notice how elegant the structure is, and feel a sense of appreciation for its clarity.",
      highlightWords: ["notice how elegant", "feel a sense of appreciation"],
    },
    {
      title: "Paint Vivid Emotional Landscapes",
      description:
        "Use descriptive language that engages multiple senses to create immersive experiences. This helps forge emotional connections through your syntax.",
      code: "The function unfolds like silk between your fingers, each line flowing seamlessly into the next, creating a rhythm that captivates your attention.",
      highlightWords: ["like silk", "flowing seamlessly", "rhythm that captivates"],
    },
    {
      title: "Employ Fractionation",
      description:
        "Alternate between emotional states to create a rollercoaster effect. This technique creates deeper engagement through contrast.",
      code: "First, the elegant simplicity of the initial declaration, then the challenging complexity of the algorithm, followed by the satisfying resolution when it all compiles perfectly.",
      highlightWords: ["elegant simplicity", "challenging complexity", "satisfying resolution"],
    },
    {
      title: "Create Anticipation Through Structure",
      description:
        "Build suspense by structuring your syntax to create anticipation. Delay the resolution to heighten emotional impact.",
      code: "The function begins, establishing context, introducing variables, building complexity, adding layers of logic, weaving through conditions, and finally— delivering the perfect result.",
      highlightWords: [
        "begins",
        "establishing",
        "introducing",
        "building",
        "adding",
        "weaving",
        "finally",
        "perfect result",
      ],
    },
    {
      title: "Use Presuppositions",
      description:
        "Embed assumptions within your syntax that must be accepted for the statement to make sense, creating implicit agreement.",
      code: "When you appreciate the elegance of this function, you'll notice how it enhances your understanding of the entire codebase.",
      highlightWords: ["appreciate the elegance", "enhances your understanding"],
    },
  ]

  // Auto-dismiss intro after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Star background */}
      <div className="fixed inset-0 z-0">
        <StarsBackground starDensity={0.0002} />
        <ShootingStars
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          minDelay={2000}
          maxDelay={8000}
          starWidth={15}
          starHeight={2}
        />
        <div className="absolute inset-0 bg-gradient-radial from-indigo-950/30 via-black/50 to-black/80"></div>
      </div>

      {/* Intro screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="pt-16 pb-8 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                5 Tips To Seduce Her
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">
                Only Using Syntax
              </span>
            </h2>
          </motion.div>
        </header>

        {/* Main content */}
        <div ref={contentRef} className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <CosmicCard className="p-6 border-purple-500/30">
              <p className="text-xl text-gray-200 leading-relaxed">
                The art of seduction isn't limited to candlelit dinners and whispered sweet nothings. In the world of
                code, your syntax can create powerful emotional responses and forge deep connections. Master these five
                techniques to make your code irresistibly captivating.
              </p>
            </CosmicCard>
          </motion.div>

          {/* Examples */}
          <div className="space-y-6">
            {examples.map((example, index) => (
              <SyntaxExample
                key={index}
                title={example.title}
                description={example.description}
                code={example.code}
                highlightWords={example.highlightWords}
                index={index}
                isActive={activeExample === index}
                onClick={() => setActiveExample(activeExample === index ? null : index)}
              />
            ))}
          </div>

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <CosmicCard className="p-6 border-t-2 border-purple-500">
              <h3 className="text-2xl font-bold text-white mb-4">The Syntax of Connection</h3>
              <p className="text-lg text-gray-200">
                Remember, the most seductive syntax creates a connection. It's not about manipulation but about crafting
                code that resonates on both logical and emotional levels. When your syntax speaks to both the analytical
                mind and the emotional heart, you've mastered the art of code seduction.
              </p>
            </CosmicCard>
          </motion.div>

          {/* Navigation */}
          <div className="mt-16 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-900/50 hover:bg-purple-800/60 backdrop-blur-md transition-colors text-white font-medium"
            >
              <ChevronLeft size={20} />
              Back to Table of Contents
            </Link>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
