"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Download, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentImageDisplayProps {
  imageUrl: string
  agentName: string
  onRegenerate: () => void
  onDownload: () => void
  colorScheme: "blue" | "purple" | "pink" | "green" | "indigo"
  isLoading?: boolean
}

export function AgentImageDisplay({
  imageUrl,
  agentName,
  onRegenerate,
  onDownload,
  colorScheme = "indigo",
  isLoading = false,
}: AgentImageDisplayProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const buttonClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    pink: "bg-pink-600 hover:bg-pink-700",
    green: "bg-green-600 hover:bg-green-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  }

  return (
    <div className="text-center">
      <div
        className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-4 rounded-lg overflow-hidden border-4 border-gray-200 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        onClick={() => setIsZoomed(true)}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            <img src={imageUrl || "/placeholder.svg"} alt={agentName} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 font-medium">
                Click to enlarge
              </span>
            </div>
          </>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{agentName}</h3>
      <p className="text-gray-600 mb-4">Your unique AI agent visualization</p>

      <div className="flex justify-center gap-3">
        <Button onClick={onRegenerate} variant="outline" className="flex items-center gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw size={16} />}
          Regenerate
        </Button>
        <Button onClick={onDownload} className={`flex items-center gap-2 ${buttonClasses[colorScheme]}`}>
          <Download size={16} />
          Download Image
        </Button>
      </div>

      {/* Fullscreen image modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={agentName}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black bg-opacity-50 text-white border-gray-600"
                  onClick={() => setIsZoomed(false)}
                >
                  Close
                </Button>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <Button onClick={onDownload} className={`flex items-center gap-2 ${buttonClasses[colorScheme]}`}>
                  <Download size={16} />
                  Download Image
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
