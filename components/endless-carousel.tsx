"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EndlessCarouselProps {
  children: React.ReactNode
  className?: string
  speed?: number // pixels per second
  pauseOnHover?: boolean
}

export function EndlessCarousel({ children, className, speed = 30, pauseOnHover = true }: EndlessCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const [duplicated, setDuplicated] = useState(false)
  const [position, setPosition] = useState(0)

  // Measure container and content width
  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return

    const measureWidths = () => {
      const containerWidth = containerRef.current?.clientWidth || 0
      const contentWidth = innerRef.current?.scrollWidth || 0
      setContainerWidth(containerWidth)
      setContentWidth(contentWidth)
    }

    measureWidths()
    window.addEventListener("resize", measureWidths)
    return () => window.removeEventListener("resize", measureWidths)
  }, [children])

  // Duplicate content if needed to create endless effect
  useEffect(() => {
    if (contentWidth > 0 && containerWidth > 0 && !duplicated) {
      // Only duplicate if content doesn't already fill the container
      setDuplicated(true)
    }
  }, [contentWidth, containerWidth, duplicated])

  // Animation loop
  useEffect(() => {
    if (isPaused || !duplicated || contentWidth === 0) return

    let animationId: number
    let lastTime = performance.now()

    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      // Move position based on speed and time
      setPosition((prev) => {
        const newPosition = prev - (speed * deltaTime) / 1000
        // Reset position when we've scrolled through one set of content
        return newPosition <= -contentWidth / 2 ? 0 : newPosition
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isPaused, duplicated, contentWidth, speed])

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        ref={innerRef}
        className="flex"
        style={{
          transform: `translateX(${position}px)`,
          transition: isPaused ? "transform 0.5s ease-out" : "none",
        }}
      >
        {children}
        {duplicated && children} {/* Duplicate content for endless effect */}
      </div>
    </div>
  )
}
