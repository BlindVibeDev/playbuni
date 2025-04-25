"use client"

import { Home, BookOpen, Calendar, MessageSquare, Sparkles } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ButtonContainer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  // Navigation items specific to Play Buni platform
  const navItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <BookOpen size={20} />, label: "Articles", href: "/articles" },
    { icon: <Calendar size={20} />, label: "Editions", href: "/editions" },
    { icon: <MessageSquare size={20} />, label: "Chat", href: "/chat" },
    { icon: <Sparkles size={20} />, label: "Exclusive", href: "/exclusive" },
  ]

  return (
    <div
      className={`flex items-center justify-around w-[300px] h-[40px] rounded-[10px] transition-colors duration-300 shadow-[0px_5px_15px_rgba(0,0,0,0.15)] ${
        isHomePage
          ? "bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.15)]"
          : "bg-[rgba(245,73,144,1)] shadow-[0px_5px_15px_rgba(0,0,0,0.15),5px_10px_15px_rgba(245,73,144,0.3)]"
      }`}
    >
      {navItems.map((button, index) => (
        <Link href={button.href} key={index}>
          <button
            className={`outline-none border-none w-[40px] h-[40px] rounded-full bg-transparent flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-[3px] ${
              pathname === button.href
                ? isHomePage
                  ? "bg-pink-100 text-pink-600"
                  : "bg-white/20 text-white"
                : isHomePage
                  ? "text-pink-600"
                  : "text-white"
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-label={button.label}
          >
            {button.icon}
          </button>
        </Link>
      ))}
    </div>
  )
}
