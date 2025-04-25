"use client"

import type React from "react"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SliderProps {
  children: React.ReactNode
  className?: string
}

export function Slider({ children, className }: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth
      sliderRef.current.scrollBy({ left: -width * 0.8, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth
      sliderRef.current.scrollBy({ left: width * 0.8, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div ref={sliderRef} className={`editions-slider overflow-x-auto pb-8 hide-scrollbar ${className || ""}`}>
        <div className="flex gap-6 px-4">{children}</div>
      </div>
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 rounded-full p-2 shadow-lg z-10 slider-nav-btn"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 rounded-full p-2 shadow-lg z-10 slider-nav-btn"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}
