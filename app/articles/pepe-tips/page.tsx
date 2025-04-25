"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ChevronLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PepeTipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-2 text-yellow-400 drop-shadow-glow">Pepe Le Pew Tips</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-glow">"Perseverance Is The Key"</h2>
          </header>

          <div className="bg-green-800 rounded-xl overflow-hidden border-4 border-green-600 shadow-2xl">
            <div className="bg-green-700 p-6 text-center">
              <div className="inline-block bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                COMING SOON
              </div>
              <h2 className="text-3xl font-bold mb-2">Meme Race Tournament</h2>
              <p className="text-green-200 max-w-2xl mx-auto">
                A recurring interactive competition in Play Buni Magazine where you'll race, battle, and meme your way
                to victory against friends and global competitors!
              </p>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="bg-green-900 bg-opacity-50 rounded-lg p-6 border border-green-700 text-center max-w-2xl">
                <h3 className="text-xl font-bold mb-3 flex items-center justify-center">
                  <Calendar className="mr-2 text-yellow-400" />
                  Coming in the Next Edition
                </h3>
                <p className="text-lg mb-6">
                  Pepe Le Pew's exclusive tips on perseverance in crypto and gaming will be revealed in our upcoming
                  edition, along with the launch of our interactive Meme Race Tournament!
                </p>

                <div className="bg-green-800 p-6 rounded-lg mb-6">
                  <h4 className="font-bold text-xl mb-4 text-yellow-300">What to Expect:</h4>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">✓</span>
                      <span>Super Mario-style platformer with social challenges</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">✓</span>
                      <span>Head-to-head meme battles with friends and global competitors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">✓</span>
                      <span>Monthly tournaments with exclusive prizes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">✓</span>
                      <span>Pepe's wisdom on perseverance in competition</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-700 rounded-lg p-6 shadow-md border border-yellow-600 text-left">
                  <div className="flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-300 mr-2"
                    >
                      <path d="M19.3 5a9 9 0 0 0-13.4 0" />
                      <path d="M16 8a4 4 0 0 0-6 0" />
                      <circle cx="12" cy="13" r="1" />
                    </svg>
                    <h3 className="text-lg font-bold text-white">Pepe's Teaser</h3>
                  </div>
                  <p className="text-yellow-100 italic">
                    "In ze race of memes, my friends, it is not ze fastest runner who wins, but ze one who keeps jumping
                    when others fall! Perseverance in competition is ze key to becoming ze champion!"
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/subscribe">
                  <Button className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full">
                    Subscribe for Early Access
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-green-700 p-4 text-center">
              <p className="text-yellow-200 italic">
                A recurring interactive competition in Play Buni Magazine • Coming soon in the next edition!
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 transition-colors text-white font-medium"
            >
              <ChevronLeft size={20} />
              Back to Table of Contents
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.5));
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 0, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(255, 255, 0, 0.8)); }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
