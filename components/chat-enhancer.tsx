"use client"

import { useEffect } from "react"
import { patchFetch, restoreFetch } from "@/lib/chat-patch"

export function ChatEnhancer() {
  useEffect(() => {
    // Apply the patch when the component mounts
    patchFetch()

    // Restore the original fetch when the component unmounts
    return () => {
      restoreFetch()
    }
  }, [])

  // This component doesn't render anything
  return null
}
