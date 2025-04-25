"use client"

import { useState, useEffect } from "react"

type Viewport = "mobile" | "tablet" | "desktop"

export function useViewport() {
  const [viewport, setViewport] = useState<Viewport>("mobile")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setViewport("mobile")
      } else if (width >= 768 && width < 1024) {
        setViewport("tablet")
      } else {
        setViewport("desktop")
      }
    }

    // Set initial viewport
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return viewport
}
