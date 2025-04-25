"use client"

import type React from "react"
import { useEffect } from "react"

interface SnapScrollProps {
  children: React.ReactNode
}

export function SnapScroll({ children }: SnapScrollProps) {
  useEffect(() => {
    // Add scroll-snap styling to html element
    document.documentElement.style.scrollSnapType = "y mandatory"

    // Clean up when component unmounts
    return () => {
      document.documentElement.style.scrollSnapType = ""
    }
  }, [])

  return <>{children}</>
}
