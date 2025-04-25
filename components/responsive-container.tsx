import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function ResponsiveContainer({ children, className, as: Component = "div" }: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        // Base padding for mobile
        "px-4 w-full mx-auto",
        // Different max-widths for different screen sizes
        "sm:px-6 sm:max-w-[540px]",
        "md:px-8 md:max-w-[720px]",
        "lg:px-10 lg:max-w-[960px]",
        "xl:px-12 xl:max-w-[1140px]",
        "2xl:max-w-[1320px]",
        className,
      )}
    >
      {children}
    </Component>
  )
}
