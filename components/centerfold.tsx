"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MagazineBackground } from "./magazine-background"
import Image from "next/image"

interface CenterfoldProps {
  section3Content?: React.ReactNode
  section4Content?: React.ReactNode
}

export function Centerfold({ section3Content, section4Content }: CenterfoldProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Simple transform for sliding up
  const y = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if we're scrolling up or down
      const isScrollingDown = currentScrollY > lastScrollY

      // Lock/unlock based on scroll direction
      if (isScrollingDown && !isLocked && currentScrollY > 100) {
        setIsLocked(true)
      } else if (!isScrollingDown && isLocked) {
        setIsLocked(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLocked, lastScrollY])

  return (
    <div ref={containerRef} className="relative">
      {/* Section 1: First image sliding up from bottom */}
      <div ref={section1Ref} className="h-screen w-full relative overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ y }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-5xl px-4">
            <Image
              src="/images/centerfold-1.svg"
              alt="Centerfold illustration"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Section 2: Stationary full screen image */}
      <div
        ref={section2Ref}
        className="h-screen w-full relative overflow-hidden"
        style={{
          position: isLocked ? "sticky" : "relative",
          top: isLocked ? 0 : "auto",
          zIndex: isLocked ? 10 : "auto",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/centerfold-2.png')` }}
        />
      </div>

      {/* Section 3 */}
      <MagazineBackground className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl mx-auto w-full">
          {section3Content || (
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
              <h2 className="text-4xl font-black mb-6">Section 3 Content</h2>
              <p className="text-lg">Add your content for section 3 here.</p>
            </div>
          )}
        </div>
      </MagazineBackground>

      {/* Section 4 */}
      <MagazineBackground className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl mx-auto w-full">
          {section4Content || (
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
              <h2 className="text-4xl font-black mb-6">Section 4 Content</h2>
              <p className="text-lg">Add your content for section 4 here.</p>
            </div>
          )}
        </div>
      </MagazineBackground>
    </div>
  )
}
