"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronUp,
  Menu,
  Share2,
  Bookmark,
  Volume2,
  Download,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Heart,
  Copy,
  Send,
  Search,
  Filter,
  Settings,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showPageActions, setShowPageActions] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items specific to Play Buni platform
  const navItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <BookOpen size={20} />, label: "Articles", href: "/articles" },
    { icon: <Calendar size={20} />, label: "Editions", href: "/editions" },
    { icon: <MessageSquare size={20} />, label: "Chat", href: "/chat" },
    { icon: <Sparkles size={20} />, label: "Exclusive", href: "/exclusive" },
  ]

  // Find current page for contextual awareness
  const currentPage =
    navItems.find((item) => item.href === pathname || pathname.startsWith(item.href + "/")) || navItems[0]

  // Show subscribe button on specific pages
  const showSubscribe = pathname === "/" || pathname === "/articles" || pathname === "/editions"

  // Define page-specific actions based on the current path
  const getPageActions = () => {
    // For article pages
    if (pathname.startsWith("/articles/")) {
      return [
        {
          icon: <Share2 size={18} />,
          label: "Share",
          action: () => navigator.share?.({ url: window.location.href, title: document.title }),
        },
        { icon: <Bookmark size={18} />, label: "Save", action: () => alert("Article saved!") },
        { icon: <Volume2 size={18} />, label: "Listen", action: () => alert("Text-to-speech started") },
        {
          icon: <Copy size={18} />,
          label: "Copy Link",
          action: () => {
            navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
          },
        },
      ]
    }

    // For editions pages
    if (pathname.startsWith("/editions")) {
      return [
        { icon: <Download size={18} />, label: "Download", action: () => alert("Edition downloading...") },
        { icon: <ArrowLeft size={18} />, label: "Previous", action: () => alert("Previous edition") },
        { icon: <ArrowRight size={18} />, label: "Next", action: () => alert("Next edition") },
        { icon: <Heart size={18} />, label: "Favorite", action: () => alert("Added to favorites!") },
      ]
    }

    // For chat page
    if (pathname.startsWith("/chat")) {
      return [
        { icon: <Plus size={18} />, label: "New Chat", action: () => alert("Starting new chat...") },
        { icon: <Trash2 size={18} />, label: "Clear", action: () => alert("Chat cleared") },
        { icon: <Save size={18} />, label: "Save", action: () => alert("Chat saved") },
        { icon: <Send size={18} />, label: "Share", action: () => alert("Share this conversation") },
      ]
    }

    // For about page
    if (pathname.startsWith("/about")) {
      return [
        {
          icon: <Share2 size={18} />,
          label: "Share",
          action: () => navigator.share?.({ url: window.location.href, title: document.title }),
        },
        { icon: <MessageSquare size={18} />, label: "Contact", action: () => alert("Contact form opened") },
      ]
    }

    // For subscribe page
    if (pathname.startsWith("/subscribe")) {
      return [
        { icon: <Settings size={18} />, label: "Options", action: () => alert("Subscription options") },
        { icon: <MessageSquare size={18} />, label: "Support", action: () => alert("Contact support") },
      ]
    }

    // For quiz pages
    if (pathname.startsWith("/quiz")) {
      return [
        { icon: <Save size={18} />, label: "Save Results", action: () => alert("Results saved") },
        { icon: <Share2 size={18} />, label: "Share Results", action: () => alert("Share your results") },
        { icon: <ArrowLeft size={18} />, label: "Restart", action: () => alert("Restart quiz") },
      ]
    }

    // For home page
    if (pathname === "/") {
      return [
        { icon: <Search size={18} />, label: "Search", action: () => alert("Search opened") },
        { icon: <Filter size={18} />, label: "Filter", action: () => alert("Filter content") },
        { icon: <Heart size={18} />, label: "Favorites", action: () => alert("View favorites") },
      ]
    }

    // Default actions for any other page
    return [
      {
        icon: <Share2 size={18} />,
        label: "Share",
        action: () => navigator.share?.({ url: window.location.href, title: document.title }),
      },
      { icon: <Home size={18} />, label: "Home", action: () => (window.location.href = "/") },
    ]
  }

  const pageActions = getPageActions()

  return (
    <TooltipProvider>
      <>
        {/* Main FAB */}
        <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-3">
          {/* Page-specific actions when activated */}
          {showPageActions && (
            <div className="flex flex-col gap-2 items-end mb-2 animate-in fade-in slide-in-from-right duration-300">
              {pageActions.map((action, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-white shadow-md border-pink-200 text-pink-600 hover:bg-pink-50"
                      onClick={() => {
                        action.action()
                        setShowPageActions(false)
                      }}
                    >
                      {action.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Expanded menu when open */}
          {isOpen && (
            <div className="flex flex-col gap-2 items-end mb-2 animate-in fade-in slide-in-from-bottom duration-300">
              {navItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full bg-white shadow-md border-pink-200 transition-all duration-300",
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "text-white bg-pink-600 border-pink-600"
                        : "text-pink-600",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              ))}

              {showSubscribe && (
                <Link href="/subscribe">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full bg-pink-600 hover:bg-pink-700 font-display shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Subscribe
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Secondary action button - page specific */}
          {!isOpen && pageActions.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full shadow-md transition-all duration-300",
                showPageActions
                  ? "bg-pink-600 hover:bg-pink-700 text-white border-pink-600"
                  : "bg-white border-pink-200 text-pink-600 hover:bg-pink-50",
              )}
              onClick={() => {
                setShowPageActions(!showPageActions)
                setIsOpen(false)
              }}
            >
              {showPageActions ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <div className="relative">
                  {currentPage.icon}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </div>
              )}
            </Button>
          )}

          {/* Main FAB button */}
          <Button
            variant={isOpen ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
              isOpen ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-white border-pink-200 text-pink-600",
            )}
            onClick={() => {
              setIsOpen(!isOpen)
              setShowPageActions(false)
            }}
          >
            {isOpen ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <>{scrollPosition > 100 ? <Menu className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</>
            )}
          </Button>
        </div>

        {/* Back to top FAB - only shows when scrolled down */}
        {scrollPosition > 300 && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-20 left-6 z-50 h-10 w-10 rounded-full bg-white shadow-md border-pink-200 text-pink-600 transition-all duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        )}
      </>
    </TooltipProvider>
  )
}
