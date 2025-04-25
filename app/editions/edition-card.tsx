"use client"
import Image from "next/image"
import { CardContainer, CardBody, CardItem } from "@/components/3d-card"
import { cn } from "@/lib/utils"

interface EditionCardProps {
  imageSrc: string
  title: string
  color: string
  className?: string
}

export function EditionCard({ imageSrc, title, color, className }: EditionCardProps) {
  return (
    <CardContainer className={cn("w-full max-w-xs mx-auto", className)} containerClassName="py-10">
      <CardBody className="relative w-full h-auto aspect-[257/364] rounded-xl">
        <CardItem
          translateZ="100"
          className="w-full h-full rounded-xl overflow-hidden border-4"
          style={{ borderColor: color }}
        >
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            width={257}
            height={364}
            className="w-full h-full object-cover"
          />
        </CardItem>
        <CardItem
          translateZ="50"
          translateY="60"
          className="absolute bottom-0 left-0 right-0 px-4 py-2 text-center bg-black/70 backdrop-blur-sm rounded-b-lg"
        >
          <h3 className="text-white font-bold">{title}</h3>
        </CardItem>
        <CardItem
          translateZ="80"
          translateX="-40"
          translateY="-40"
          className="absolute top-0 left-0 w-24 h-24 rotate-12"
        >
          <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full blur-md" />
        </CardItem>
        <CardItem
          translateZ="60"
          translateX="40"
          translateY="40"
          className="absolute bottom-0 right-0 w-16 h-16 -rotate-12"
        >
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-md" />
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}
