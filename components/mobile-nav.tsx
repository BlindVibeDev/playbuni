"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, BookOpen, Calendar, MessageSquare, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const routes = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Articles",
    path: "/articles",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: "Editions",
    path: "/editions",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Chat",
    path: "/chat",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    name: "Exclusive",
    path: "/exclusive",
    icon: <Sparkles className="h-5 w-5" />,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Bottom mobile navigation bar - only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div className="flex justify-around items-center h-16">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-colors",
                pathname === route.path ? "text-pink-600" : "text-muted-foreground hover:text-pink-600",
              )}
            >
              {route.icon}
              <span className="mt-1">{route.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet navigation - visible only on tablet */}
      <div className="hidden md:block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex justify-center items-center h-16">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center justify-center py-2 px-6 text-sm font-medium transition-colors",
                pathname === route.path
                  ? "text-pink-600 border-t-2 border-pink-600"
                  : "text-muted-foreground hover:text-pink-600",
              )}
            >
              {route.icon}
              <span className="ml-2">{route.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Add padding to the bottom of the page to prevent content from being hidden behind the nav bar */}
      <div className="pb-16 md:pb-16 lg:pb-0"></div>

      {/* Hamburger menu for mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden fixed top-4 right-4 z-50" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <div className="px-7">
            <div className="flex flex-col space-y-3 mt-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-pink-600",
                    pathname === route.path ? "text-pink-600 font-bold" : "text-muted-foreground",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {route.icon}
                  <span className="ml-2">{route.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
