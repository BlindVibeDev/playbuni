import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"

// Load Inter as our body font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

// Load Montserrat as our display font
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Play Buni - Digital Magazine",
  description: "A digital magazine for the Solana Crypto Token Play Buni, featuring Mae Buni",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          {children}
          {/* MobileNav removed as the FAB now handles navigation */}
        </ThemeProvider>
      </body>
    </html>
  )
}
