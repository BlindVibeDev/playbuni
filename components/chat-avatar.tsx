import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ChatAvatar({ src, alt, size = "md", className }: ChatAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("relative rounded-full overflow-hidden border-2 border-white", sizeClasses[size], className)}>
      <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
    </div>
  )
}
