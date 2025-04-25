import type React from "react"

interface MagazineBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function MagazineBackground({ children, className = "" }: MagazineBackgroundProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  )
}
