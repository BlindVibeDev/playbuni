"use client"

import { useEffect, useRef } from "react"

interface GameImageGeneratorProps {
  type: "character" | "background" | "platform-race" | "meme-battle" | "social-conquest" | "avatar"
  avatarNumber?: number
  width?: number
  height?: number
  onGenerated?: (dataUrl: string) => void
}

export function GameImageGenerator({
  type,
  avatarNumber = 1,
  width = 400,
  height = 300,
  onGenerated,
}: GameImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Generate different images based on type
    switch (type) {
      case "character":
        generatePepeCharacter(ctx, width, height)
        break
      case "background":
        generateGameBackground(ctx, width, height)
        break
      case "platform-race":
        generatePlatformRace(ctx, width, height)
        break
      case "meme-battle":
        generateMemeBattle(ctx, width, height)
        break
      case "social-conquest":
        generateSocialConquest(ctx, width, height)
        break
      case "avatar":
        generatePlayerAvatar(ctx, width, height, avatarNumber)
        break
    }

    // Call onGenerated callback with the data URL if provided
    if (onGenerated) {
      onGenerated(canvas.toDataURL("image/png"))
    }
  }, [type, avatarNumber, width, height, onGenerated])

  return <canvas ref={canvasRef} className="hidden" />
}

// Helper function to draw a rounded rectangle
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// Generate Pepe character
function generatePepeCharacter(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Background
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2)
  gradient.addColorStop(0, "#4ade80")
  gradient.addColorStop(1, "#166534")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Character body (green circle)
  ctx.fillStyle = "#10b981"
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, height / 3, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.arc(width / 2 - 25, height / 2 - 15, 20, 0, Math.PI * 2)
  ctx.arc(width / 2 + 25, height / 2 - 15, 20, 0, Math.PI * 2)
  ctx.fill()

  // Pupils
  ctx.fillStyle = "black"
  ctx.beginPath()
  ctx.arc(width / 2 - 25, height / 2 - 15, 10, 0, Math.PI * 2)
  ctx.arc(width / 2 + 25, height / 2 - 15, 10, 0, Math.PI * 2)
  ctx.fill()

  // Mouth
  ctx.fillStyle = "#ef4444"
  ctx.beginPath()
  ctx.arc(width / 2, height / 2 + 20, 30, 0, Math.PI)
  ctx.fill()

  // Crown
  ctx.fillStyle = "#fcd34d"
  ctx.beginPath()
  ctx.moveTo(width / 2 - 40, height / 2 - 60)
  ctx.lineTo(width / 2 - 30, height / 2 - 80)
  ctx.lineTo(width / 2 - 15, height / 2 - 60)
  ctx.lineTo(width / 2, height / 2 - 80)
  ctx.lineTo(width / 2 + 15, height / 2 - 60)
  ctx.lineTo(width / 2 + 30, height / 2 - 80)
  ctx.lineTo(width / 2 + 40, height / 2 - 60)
  ctx.closePath()
  ctx.fill()

  // Game controller
  ctx.fillStyle = "#6366f1"
  roundRect(ctx, width / 2 - 40, height / 2 + 60, 80, 40, 10)
  ctx.fill()

  // Controller buttons
  ctx.fillStyle = "#f43f5e"
  ctx.beginPath()
  ctx.arc(width / 2 + 20, height / 2 + 70, 8, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#fcd34d"
  ctx.beginPath()
  ctx.arc(width / 2 + 5, height / 2 + 80, 8, 0, Math.PI * 2)
  ctx.fill()
}

// Generate game background
function generateGameBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
  skyGradient.addColorStop(0, "#0ea5e9")
  skyGradient.addColorStop(1, "#7dd3fc")
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height)

  // Sun
  ctx.fillStyle = "#fcd34d"
  ctx.beginPath()
  ctx.arc(width - 70, 70, 50, 0, Math.PI * 2)
  ctx.fill()

  // Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
  drawCloud(ctx, 100, 80, 80, 40)
  drawCloud(ctx, 300, 60, 100, 50)
  drawCloud(ctx, 500, 100, 70, 35)

  // Ground
  ctx.fillStyle = "#65a30d"
  ctx.fillRect(0, height - 80, width, 80)

  // Platforms
  ctx.fillStyle = "#84cc16"
  roundRect(ctx, 50, height - 150, 100, 20, 10)
  ctx.fill()

  roundRect(ctx, 200, height - 200, 120, 20, 10)
  ctx.fill()

  roundRect(ctx, 400, height - 180, 150, 20, 10)
  ctx.fill()

  // Coins
  drawCoins(ctx, width, height)

  // Meme symbols in the sky
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
  ctx.font = "40px Arial"
  ctx.fillText("🚀", 150, 150)
  ctx.fillText("💎", 350, 120)
  ctx.fillText("🌕", 250, 200)
}

// Helper to draw a cloud
function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.beginPath()
  ctx.arc(x, y, height / 2, 0, Math.PI * 2)
  ctx.arc(x + width / 3, y - height / 3, height / 2, 0, Math.PI * 2)
  ctx.arc(x + width / 1.5, y, height / 2, 0, Math.PI * 2)
  ctx.arc(x + width / 3, y + height / 3, height / 2, 0, Math.PI * 2)
  ctx.fill()
}

// Helper to draw coins
function drawCoins(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#fcd34d"
  ctx.strokeStyle = "#d97706"
  ctx.lineWidth = 2

  const coinPositions = [
    { x: 80, y: height - 180 },
    { x: 120, y: height - 180 },
    { x: 250, y: height - 230 },
    { x: 290, y: height - 230 },
    { x: 450, y: height - 210 },
    { x: 490, y: height - 210 },
  ]

  coinPositions.forEach((pos) => {
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  })
}

// Generate platform race scene
function generatePlatformRace(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Background
  generateGameBackground(ctx, width, height)

  // Character
  const characterSize = 60
  ctx.fillStyle = "#10b981"
  ctx.beginPath()
  ctx.arc(width / 3, height - 180, characterSize / 3, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.arc(width / 3 - 8, height - 185, 7, 0, Math.PI * 2)
  ctx.arc(width / 3 + 8, height - 185, 7, 0, Math.PI * 2)
  ctx.fill()

  // Pupils
  ctx.fillStyle = "black"
  ctx.beginPath()
  ctx.arc(width / 3 - 8, height - 185, 3, 0, Math.PI * 2)
  ctx.arc(width / 3 + 8, height - 185, 3, 0, Math.PI * 2)
  ctx.fill()

  // Mouth
  ctx.fillStyle = "#ef4444"
  ctx.beginPath()
  ctx.arc(width / 3, height - 175, 10, 0, Math.PI)
  ctx.fill()

  // Race elements
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
  ctx.font = "20px Arial"
  ctx.fillText("RACE MODE", 20, 30)

  // Timer
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  roundRect(ctx, width / 2 - 50, 10, 100, 30, 5)
  ctx.fill()

  ctx.fillStyle = "white"
  ctx.font = "18px Arial"
  ctx.textAlign = "center"
  ctx.fillText("01:23.45", width / 2, 30)

  // Opponent
  ctx.fillStyle = "#f43f5e"
  ctx.beginPath()
  ctx.arc(width / 1.5, height - 210, characterSize / 3, 0, Math.PI * 2)
  ctx.fill()

  // Opponent eyes
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.arc(width / 1.5 - 8, height - 215, 7, 0, Math.PI * 2)
  ctx.arc(width / 1.5 + 8, height - 215, 7, 0, Math.PI * 2)
  ctx.fill()

  // Opponent pupils
  ctx.fillStyle = "black"
  ctx.beginPath()
  ctx.arc(width / 1.5 - 8, height - 215, 3, 0, Math.PI * 2)
  ctx.arc(width / 1.5 + 8, height - 215, 3, 0, Math.PI * 2)
  ctx.fill()

  // Power-up
  ctx.fillStyle = "#a855f7"
  ctx.beginPath()
  ctx.arc(width - 100, height - 230, 15, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = "white"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width - 100, height - 240)
  ctx.lineTo(width - 100, height - 220)
  ctx.moveTo(width - 110, height - 230)
  ctx.lineTo(width - 90, height - 230)
  ctx.stroke()
}

// Generate meme battle scene
function generateMemeBattle(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Background
  ctx.fillStyle = "#1e293b"
  ctx.fillRect(0, 0, width, height)

  // Battle arena
  ctx.fillStyle = "#334155"
  roundRect(ctx, 20, 50, width - 40, height - 100, 10)
  ctx.fill()

  // VS text
  ctx.fillStyle = "#f43f5e"
  ctx.font = "bold 40px Arial"
  ctx.textAlign = "center"
  ctx.fillText("VS", width / 2, height / 2)

  // Player 1 meme
  ctx.fillStyle = "#1e40af"
  roundRect(ctx, 40, 70, width / 2 - 60, height / 2 - 40, 10)
  ctx.fill()

  // Player 1 meme content
  ctx.fillStyle = "white"
  ctx.font = "14px Arial"
  ctx.textAlign = "center"
  ctx.fillText("WHEN YOU BUY THE DIP", width / 4, 100)
  ctx.fillText("BUT IT KEEPS DIPPING", width / 4, 120)

  // Simple meme face in player 1 meme
  ctx.beginPath()
  ctx.arc(width / 4, height / 4, 30, 0, Math.PI * 2)
  ctx.fillStyle = "#fcd34d"
  ctx.fill()

  ctx.beginPath()
  ctx.arc(width / 4 - 10, height / 4 - 10, 5, 0, Math.PI * 2)
  ctx.arc(width / 4 + 10, height / 4 - 10, 5, 0, Math.PI * 2)
  ctx.fillStyle = "black"
  ctx.fill()

  ctx.beginPath()
  ctx.arc(width / 4, height / 4 + 10, 15, 0, Math.PI, true)
  ctx.stroke()

  // Player 2 meme
  ctx.fillStyle = "#9f1239"
  roundRect(ctx, width / 2 + 20, 70, width / 2 - 60, height / 2 - 40, 10)
  ctx.fill()

  // Player 2 meme content
  ctx.fillStyle = "white"
  ctx.font = "14px Arial"
  ctx.textAlign = "center"
  ctx.fillText("HODL TILL LAMBO", (width * 3) / 4, 100)
  ctx.fillText("OR RAMEN", (width * 3) / 4, 120)

  // Simple rocket in player 2 meme
  ctx.fillStyle = "#f43f5e"
  ctx.beginPath()
  ctx.moveTo((width * 3) / 4, height / 4 - 30)
  ctx.lineTo((width * 3) / 4 - 15, height / 4 + 20)
  ctx.lineTo((width * 3) / 4 + 15, height / 4 + 20)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = "#f97316"
  ctx.beginPath()
  ctx.moveTo((width * 3) / 4 - 10, height / 4 + 20)
  ctx.lineTo((width * 3) / 4, height / 4 + 40)
  ctx.lineTo((width * 3) / 4 + 10, height / 4 + 20)
  ctx.closePath()
  ctx.fill()

  // Voting section
  ctx.fillStyle = "#475569"
  roundRect(ctx, 40, height / 2 + 50, width - 80, 80, 10)
  ctx.fill()

  ctx.fillStyle = "white"
  ctx.font = "18px Arial"
  ctx.textAlign = "center"
  ctx.fillText("COMMUNITY VOTE", width / 2, height / 2 + 80)

  // Vote buttons
  ctx.fillStyle = "#3b82f6"
  roundRect(ctx, width / 4 - 50, height / 2 + 100, 100, 30, 15)
  ctx.fill()

  ctx.fillStyle = "#e11d48"
  roundRect(ctx, (width * 3) / 4 - 50, height / 2 + 100, 100, 30, 15)
  ctx.fill()

  ctx.fillStyle = "white"
  ctx.font = "16px Arial"
  ctx.textAlign = "center"
  ctx.fillText("VOTE (42%)", width / 4, height / 2 + 120)
  ctx.fillText("VOTE (58%)", (width * 3) / 4, height / 2 + 120)

  // Battle info
  ctx.fillStyle = "white"
  ctx.font = "14px Arial"
  ctx.textAlign = "left"
  ctx.fillText("MEME BATTLE - ROUND 2/5", 20, 30)

  ctx.textAlign = "right"
  ctx.fillText("TIME LEFT: 0:45", width - 20, 30)
}

// Generate social conquest scene
function generateSocialConquest(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#4f46e5")
  gradient.addColorStop(1, "#7e22ce")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Social media icons background
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 30 + 10
    ctx.font = `${size}px Arial`
    const icon = ["📱", "💬", "👍", "🔄", "❤️", "📢", "🌐"][Math.floor(Math.random() * 7)]
    ctx.fillText(icon, x, y)
  }

  // Main panel
  ctx.fillStyle = "rgba(30, 41, 59, 0.8)"
  roundRect(ctx, width / 2 - 150, height / 2 - 120, 300, 240, 15)
  ctx.fill()

  // Panel header
  ctx.fillStyle = "#8b5cf6"
  roundRect(ctx, width / 2 - 150, height / 2 - 120, 300, 40, 15)
  ctx.fill()

  // Round off bottom corners
  ctx.fillStyle = "rgba(30, 41, 59, 0.8)"
  ctx.fillRect(width / 2 - 150, height / 2 - 90, 300, 10)

  // Header text
  ctx.fillStyle = "white"
  ctx.font = "bold 18px Arial"
  ctx.textAlign = "center"
  ctx.fillText("SOCIAL CONQUEST", width / 2, height / 2 - 95)

  // Challenge description
  ctx.fillStyle = "white"
  ctx.font = "16px Arial"
  ctx.textAlign = "center"
  ctx.fillText("DAILY CHALLENGE", width / 2, height / 2 - 60)

  ctx.font = "14px Arial"
  ctx.fillText('Create a meme about "diamond hands"', width / 2, height / 2 - 30)
  ctx.fillText("and share it to earn 500 points!", width / 2, height / 2 - 10)

  // Progress bar background
  ctx.fillStyle = "#475569"
  roundRect(ctx, width / 2 - 120, height / 2 + 20, 240, 20, 10)
  ctx.fill()

  // Progress bar fill
  ctx.fillStyle = "#10b981"
  roundRect(ctx, width / 2 - 120, height / 2 + 20, 120, 20, 10)
  ctx.fill()

  // Progress text
  ctx.fillStyle = "white"
  ctx.font = "12px Arial"
  ctx.textAlign = "center"
  ctx.fillText("PROGRESS: 50%", width / 2, height / 2 + 35)

  // Share button
  ctx.fillStyle = "#3b82f6"
  roundRect(ctx, width / 2 - 100, height / 2 + 60, 200, 40, 20)
  ctx.fill()

  ctx.fillStyle = "white"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.fillText("SHARE TO SOCIAL MEDIA", width / 2, height / 2 + 85)

  // Social stats
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
  ctx.font = "14px Arial"
  ctx.textAlign = "left"
  ctx.fillText("👥 Followers: 1,248", 20, 30)
  ctx.fillText("⭐ Influence: 78/100", 20, 50)

  ctx.textAlign = "right"
  ctx.fillText("🏆 Rank: #42", width - 20, 30)
  ctx.fillText("🔥 Streak: 7 days", width - 20, 50)
}

// Generate player avatar
function generatePlayerAvatar(ctx: CanvasRenderingContext2D, width: number, height: number, avatarNumber: number) {
  // Make it square
  const size = Math.min(width, height)

  // Background
  let bgColor
  switch (avatarNumber) {
    case 1:
      bgColor = "#3b82f6" // Blue
      break
    case 2:
      bgColor = "#10b981" // Green
      break
    case 3:
      bgColor = "#f43f5e" // Red
      break
    default:
      bgColor = "#8b5cf6" // Purple
  }

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, bgColor)
  gradient.addColorStop(1, shadeColor(bgColor, -30))

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()

  // Avatar pattern based on number
  switch (avatarNumber) {
    case 1: // Crown avatar
      // Crown
      ctx.fillStyle = "#fcd34d"
      ctx.beginPath()
      ctx.moveTo(size / 2 - 30, size / 2 - 10)
      ctx.lineTo(size / 2 - 20, size / 2 - 25)
      ctx.lineTo(size / 2 - 10, size / 2 - 10)
      ctx.lineTo(size / 2, size / 2 - 25)
      ctx.lineTo(size / 2 + 10, size / 2 - 10)
      ctx.lineTo(size / 2 + 20, size / 2 - 25)
      ctx.lineTo(size / 2 + 30, size / 2 - 10)
      ctx.closePath()
      ctx.fill()

      // Face
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(size / 2 - 10, size / 2 + 10, 5, 0, Math.PI * 2)
      ctx.arc(size / 2 + 10, size / 2 + 10, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(size / 2, size / 2 + 25, 10, 0, Math.PI)
      ctx.stroke()
      break

    case 2: // Rocket avatar
      // Rocket
      ctx.fillStyle = "#f43f5e"
      ctx.beginPath()
      ctx.moveTo(size / 2, size / 2 - 30)
      ctx.lineTo(size / 2 - 20, size / 2 + 20)
      ctx.lineTo(size / 2 + 20, size / 2 + 20)
      ctx.closePath()
      ctx.fill()

      // Rocket window
      ctx.fillStyle = "#0ea5e9"
      ctx.beginPath()
      ctx.arc(size / 2, size / 2 - 10, 8, 0, Math.PI * 2)
      ctx.fill()

      // Flame
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.moveTo(size / 2 - 10, size / 2 + 20)
      ctx.lineTo(size / 2, size / 2 + 35)
      ctx.lineTo(size / 2 + 10, size / 2 + 20)
      ctx.closePath()
      ctx.fill()
      break

    case 3: // Frog avatar
      // Face
      ctx.fillStyle = "#84cc16"
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, 25, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(size / 2 - 10, size / 2 - 10, 8, 0, Math.PI * 2)
      ctx.arc(size / 2 + 10, size / 2 - 10, 8, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(size / 2 - 10, size / 2 - 10, 4, 0, Math.PI * 2)
      ctx.arc(size / 2 + 10, size / 2 - 10, 4, 0, Math.PI * 2)
      ctx.fill()

      // Mouth
      ctx.strokeStyle = "black"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(size / 2, size / 2 + 5, 15, 0.2 * Math.PI, 0.8 * Math.PI)
      ctx.stroke()
      break

    default:
      // Default face
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(size / 2 - 10, size / 2 - 10, 5, 0, Math.PI * 2)
      ctx.arc(size / 2 + 10, size / 2 - 10, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(size / 2, size / 2 + 10, 15, 0, Math.PI)
      ctx.stroke()
  }
}

// Helper to shade a color
function shadeColor(color: string, percent: number): string {
  let R = Number.parseInt(color.substring(1, 3), 16)
  let G = Number.parseInt(color.substring(3, 5), 16)
  let B = Number.parseInt(color.substring(5, 7), 16)

  R = Math.floor((R * (100 + percent)) / 100)
  G = Math.floor((G * (100 + percent)) / 100)
  B = Math.floor((B * (100 + percent)) / 100)

  R = R < 255 ? R : 255
  G = G < 255 ? G : 255
  B = B < 255 ? B : 255

  R = R > 0 ? R : 0
  G = G > 0 ? G : 0
  B = B > 0 ? B : 0

  const RR = R.toString(16).padStart(2, "0")
  const GG = G.toString(16).padStart(2, "0")
  const BB = B.toString(16).padStart(2, "0")

  return `#${RR}${GG}${BB}`
}
