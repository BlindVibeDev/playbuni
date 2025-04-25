import type { Metadata } from "next"
import "./editions.css"
import "./editions-enhanced.css"
import { ResponsiveContainer } from "@/components/responsive-container"
import { EndlessCarousel } from "@/components/endless-carousel"
import { EnhancedEditionCard } from "@/components/enhanced-edition-card"

export const metadata: Metadata = {
  title: "Editions | Play Buni",
  description: "Browse all Play Buni digital and print editions",
}

interface EditionSection {
  title: string
  editions: {
    imageSrc: string
    title: string
    color: string
    excerpt?: string
  }[]
}

export default function EditionsPage() {
  const sections: EditionSection[] = [
    {
      title: "Current Edition",
      editions: [
        {
          imageSrc: "/images/buni-cover.png",
          title: "April 2025 Edition",
          color: "#ff3366",
          excerpt:
            "The April 2025 edition features Mae Buni's exclusive interview with leading crypto innovators, a deep dive into the latest meme trends, and a special feature on the intersection of AI and digital art. Don't miss the centerfold showcase of Mae's latest photoshoot!",
        },
        {
          imageSrc: "/images/centerfold-1.svg",
          title: "April 2025 Centerfold",
          color: "#8d9f87",
          excerpt:
            "This special centerfold edition showcases Mae Buni in a stunning visual narrative exploring the theme of digital rebirth. The artistic direction blends retro aesthetics with futuristic elements, creating a unique visual experience that complements the April 2025 main edition.",
        },
        {
          imageSrc: "/images/buni-cards.png",
          title: "Collector Cards April 2025",
          color: "#ff5722",
          excerpt:
            "The April 2025 collector cards feature limited edition artwork of Mae Buni and friends. Each card contains a unique QR code that unlocks special digital content. This month's collection focuses on the evolution of meme culture and includes rare holographic variants.",
        },
      ],
    },
    {
      title: "Archive",
      editions: [
        {
          imageSrc: "/images/buni-cover-poster.png",
          title: "March 2025 Edition",
          color: "#1E88E5",
          excerpt:
            "The March 2025 edition explored the rise of decentralized social media platforms and featured an exclusive interview with the creators of the viral 'CryptoKitties 2.0' phenomenon. Mae Buni's editorial on digital identity in the metaverse sparked widespread discussion in the crypto community.",
        },
        {
          imageSrc: "/images/centerfold-2.png",
          title: "March 2025 Centerfold",
          color: "#E53935",
          excerpt:
            "The March centerfold presented Mae Buni in a cyberpunk-inspired setting, blending neon aesthetics with blockchain symbolism. The photoshoot was created in collaboration with award-winning digital artists and includes interactive AR elements accessible through the Play Buni app.",
        },
        {
          imageSrc: "/images/buni-character.png",
          title: "February 2025 Edition",
          color: "#FFEE58",
          excerpt:
            "February's edition focused on the intersection of gaming and crypto, with Mae Buni exploring the most promising play-to-earn ecosystems. The issue included an in-depth analysis of tokenomics in virtual worlds and a beginner's guide to NFT collecting.",
        },
      ],
    },
    {
      title: "Coming Soon",
      editions: [
        {
          imageSrc: "/images/buni-rocket.png",
          title: "May 2025 Edition",
          color: "#FF9800",
          excerpt:
            "The upcoming May 2025 edition will feature a special focus on space-themed crypto projects and the future of interplanetary digital economies. Mae Buni interviews leading scientists and crypto visionaries about the potential for blockchain technology in space exploration.",
        },
        {
          imageSrc: "/images/buni-peeking.png",
          title: "June 2025 Edition",
          color: "#8d516e",
          excerpt:
            "June's edition will dive into the world of privacy-focused cryptocurrencies and the growing movement for digital sovereignty. Mae Buni investigates the balance between transparency and privacy in the evolving crypto landscape.",
        },
        {
          imageSrc: "/images/buni-stamp.png",
          title: "Q2 2025 Print Collection",
          color: "#6e695e",
          excerpt:
            "The Q2 2025 Print Collection will compile the best content from April, May, and June editions in a premium physical format. This collector's item will include exclusive bonus content, high-quality prints, and special access codes for limited digital assets.",
        },
      ],
    },
  ]

  return (
    <div className="editions-page bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      <ResponsiveContainer as="main" className="py-8 md:py-12 lg:py-16">
        <h1 className="text-responsive-3xl md:text-responsive-4xl lg:text-responsive-5xl mb-8 md:mb-12">
          Play Buni Editions
        </h1>

        {sections.map((section, index) => (
          <section key={index} className="editions-section">
            <header>
              <h2 className="text-responsive-2xl md:text-responsive-3xl mb-4 md:mb-6">{section.title}</h2>
            </header>
            <div className="editions-carousel-container">
              <EndlessCarousel speed={20} pauseOnHover={true}>
                {section.editions.map((edition, editionIndex) => (
                  <EnhancedEditionCard
                    key={editionIndex}
                    imageSrc={edition.imageSrc}
                    title={edition.title}
                    color={edition.color}
                    excerpt={edition.excerpt}
                  />
                ))}
              </EndlessCarousel>
            </div>
          </section>
        ))}
      </ResponsiveContainer>
    </div>
  )
}
