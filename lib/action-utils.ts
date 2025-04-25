"use client"

import { toast } from "@/components/ui/use-toast"

// Text-to-speech functionality
export const textToSpeech = (text: string, voiceName = "en-US-Neural2-F") => {
  if (!text) return

  // Stop any existing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  // Create utterance with the provided text
  const utterance = new SpeechSynthesisUtterance(text)

  // Get available voices and set the preferred one
  const voices = window.speechSynthesis.getVoices()
  const preferredVoice = voices.find((voice) => voice.name.includes(voiceName))
  if (preferredVoice) utterance.voice = preferredVoice

  // Set properties for a more pleasant voice
  utterance.pitch = 1.1
  utterance.rate = 1.0
  utterance.volume = 1.0

  // Speak the text
  window.speechSynthesis.speak(utterance)

  return {
    stop: () => window.speechSynthesis.cancel(),
    pause: () => window.speechSynthesis.pause(),
    resume: () => window.speechSynthesis.resume(),
    speaking: () => window.speechSynthesis.speaking,
  }
}

// Save article to local storage
export const saveArticle = async (articleId: string, title: string) => {
  try {
    // Get existing saved articles
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]")

    // Check if already saved
    if (savedArticles.some((article: any) => article.id === articleId)) {
      toast({
        title: "Already saved",
        description: "This article is already in your saved items",
      })
      return false
    }

    // Add new article
    savedArticles.push({
      id: articleId,
      title,
      savedAt: new Date().toISOString(),
    })

    // Save back to local storage
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles))

    // If user is logged in, sync with database
    const userId = localStorage.getItem("userId")
    if (userId) {
      try {
        await fetch("/api/user/save-article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, articleId, title }),
        })
      } catch (error) {
        console.error("Error syncing saved article to database:", error)
      }
    }

    toast({
      title: "Article saved",
      description: "You can find it in your saved items",
    })
    return true
  } catch (error) {
    console.error("Error saving article:", error)
    toast({
      title: "Error saving article",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

// Get saved articles
export const getSavedArticles = () => {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem("savedArticles") || "[]")
  } catch (error) {
    console.error("Error getting saved articles:", error)
    return []
  }
}

// Remove saved article
export const removeSavedArticle = async (articleId: string) => {
  try {
    // Get existing saved articles
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]")

    // Filter out the article to remove
    const updatedArticles = savedArticles.filter((article: any) => article.id !== articleId)

    // Save back to local storage
    localStorage.setItem("savedArticles", JSON.stringify(updatedArticles))

    // If user is logged in, sync with database
    const userId = localStorage.getItem("userId")
    if (userId) {
      try {
        await fetch("/api/user/remove-saved-article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, articleId }),
        })
      } catch (error) {
        console.error("Error syncing removed article to database:", error)
      }
    }

    toast({
      title: "Article removed",
      description: "Article removed from your saved items",
    })
    return true
  } catch (error) {
    console.error("Error removing saved article:", error)
    toast({
      title: "Error removing article",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

// Share content using Web Share API or fallback
export const shareContent = async (data: { title?: string; text?: string; url?: string }) => {
  try {
    if (navigator.share) {
      await navigator.share(data)
      return true
    } else {
      // Fallback for browsers that don't support Web Share API
      if (data.url) {
        await navigator.clipboard.writeText(data.url)
        toast({
          title: "Link copied",
          description: "URL copied to clipboard",
        })
        return true
      }
    }
  } catch (error) {
    console.error("Error sharing content:", error)
    toast({
      title: "Sharing failed",
      description: "Please try again or copy the URL manually",
      variant: "destructive",
    })
    return false
  }
}

// Download edition as PDF
export const downloadEdition = async (editionId: string, editionTitle: string) => {
  try {
    toast({
      title: "Preparing download",
      description: "Your edition is being prepared...",
    })

    // In a real implementation, this would fetch the PDF from an API
    // For now, we'll simulate a download after a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a fake download link
    const link = document.createElement("a")
    link.href = `/api/editions/download?id=${editionId}`
    link.download = `${editionTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your edition is downloading",
    })
    return true
  } catch (error) {
    console.error("Error downloading edition:", error)
    toast({
      title: "Download failed",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

// Navigate between editions
export const navigateEditions = (direction: "prev" | "next", currentEditionId: string) => {
  // This would typically fetch from an API to get the next/prev edition
  // For now, we'll just navigate based on a simple ID increment/decrement

  const editionNumber = Number.parseInt(currentEditionId.replace("edition-", ""))
  let targetEdition

  if (direction === "prev") {
    targetEdition = Math.max(1, editionNumber - 1)
  } else {
    // Assume we have 10 editions max for this example
    targetEdition = Math.min(10, editionNumber + 1)
  }

  if (targetEdition !== editionNumber) {
    window.location.href = `/editions/edition-${targetEdition}`
    return true
  }

  toast({
    title: direction === "prev" ? "First edition" : "Last edition",
    description: `This is the ${direction === "prev" ? "first" : "latest"} available edition`,
  })
  return false
}

// Toggle favorite status
export const toggleFavorite = async (itemId: string, itemType: "article" | "edition", title: string) => {
  try {
    // Get existing favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")

    // Initialize the type array if it doesn't exist
    if (!favorites[itemType]) {
      favorites[itemType] = []
    }

    // Check if already favorited
    const existingIndex = favorites[itemType].findIndex((item: any) => item.id === itemId)

    if (existingIndex >= 0) {
      // Remove from favorites
      favorites[itemType].splice(existingIndex, 1)
      localStorage.setItem("favorites", JSON.stringify(favorites))

      toast({
        title: "Removed from favorites",
        description: `${title} removed from your favorites`,
      })
    } else {
      // Add to favorites
      favorites[itemType].push({
        id: itemId,
        title,
        favoritedAt: new Date().toISOString(),
      })
      localStorage.setItem("favorites", JSON.stringify(favorites))

      toast({
        title: "Added to favorites",
        description: `${title} added to your favorites`,
      })
    }

    // If user is logged in, sync with database
    const userId = localStorage.getItem("userId")
    if (userId) {
      try {
        await fetch("/api/user/update-favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, favorites }),
        })
      } catch (error) {
        console.error("Error syncing favorites to database:", error)
      }
    }

    return true
  } catch (error) {
    console.error("Error updating favorites:", error)
    toast({
      title: "Error updating favorites",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

// Check if an item is favorited
export const isFavorited = (itemId: string, itemType: "article" | "edition") => {
  try {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
    if (!favorites[itemType]) return false

    return favorites[itemType].some((item: any) => item.id === itemId)
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return false
  }
}

// Chat management functions
export const startNewChat = async () => {
  try {
    // Clear current chat from localStorage
    localStorage.removeItem("currentChat")

    // Redirect to chat page with a new session ID
    const sessionId = `session-${Date.now()}`
    window.location.href = `/chat?session=${sessionId}`
    return true
  } catch (error) {
    console.error("Error starting new chat:", error)
    toast({
      title: "Error starting new chat",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

export const clearChat = async () => {
  try {
    // Get current chat session ID
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get("session")

    if (sessionId) {
      // Clear chat messages from localStorage
      localStorage.removeItem(`chat-${sessionId}`)

      // Reload the page to show empty chat
      window.location.reload()
    } else {
      // If no session ID, just clear current chat
      localStorage.removeItem("currentChat")
      window.location.reload()
    }

    return true
  } catch (error) {
    console.error("Error clearing chat:", error)
    toast({
      title: "Error clearing chat",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

export const saveChat = async () => {
  try {
    // Get current chat session ID
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get("session") || `session-${Date.now()}`

    // Get current chat messages
    const chatMessages = JSON.parse(localStorage.getItem(`chat-${sessionId}`) || "[]")

    if (chatMessages.length === 0) {
      toast({
        title: "No messages to save",
        description: "Start a conversation first",
      })
      return false
    }

    // Get saved chats
    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")

    // Check if already saved
    if (savedChats.some((chat: any) => chat.id === sessionId)) {
      // Update existing saved chat
      const index = savedChats.findIndex((chat: any) => chat.id === sessionId)
      savedChats[index] = {
        id: sessionId,
        messages: chatMessages,
        updatedAt: new Date().toISOString(),
        title: savedChats[index].title || `Chat ${savedChats.length + 1}`,
      }
    } else {
      // Add new saved chat
      savedChats.push({
        id: sessionId,
        messages: chatMessages,
        savedAt: new Date().toISOString(),
        title: `Chat ${savedChats.length + 1}`,
      })
    }

    // Save back to localStorage
    localStorage.setItem("savedChats", JSON.stringify(savedChats))

    toast({
      title: "Chat saved",
      description: "You can access it from your saved chats",
    })
    return true
  } catch (error) {
    console.error("Error saving chat:", error)
    toast({
      title: "Error saving chat",
      description: "Please try again later",
      variant: "destructive",
    })
    return false
  }
}

// Search functionality
export const openSearch = () => {
  // This would typically open a search modal or navigate to a search page
  // For now, we'll just navigate to a search page
  window.location.href = "/search"
  return true
}

// Filter content
export const openFilter = () => {
  // This would typically open a filter modal
  // For now, we'll just toggle a class on the body to show/hide a filter sidebar
  document.body.classList.toggle("show-filters")

  if (document.body.classList.contains("show-filters")) {
    toast({
      title: "Filters shown",
      description: "Use the sidebar to filter content",
    })
  } else {
    toast({
      title: "Filters hidden",
      description: "Filter sidebar hidden",
    })
  }

  return true
}
