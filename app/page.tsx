import Image from "next/image"
import Link from "next/link"
import { SnapScroll } from "@/components/snap-scroll"
import { CardContainer, CardBody, CardItem } from "@/components/3d-card"
import { LogoMarqueeSection } from "@/components/logo-marquee"

export default function Home() {
  return (
    <SnapScroll>
      <main
        className="relative min-h-screen bg-white overflow-hidden font-sans scroll-snap-align-start"
        style={{ scrollSnapAlign: "start" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 md:p-6">{/* Header content removed */}</div>

        {/* Main Title */}
        <div className="text-center -mt-4">
          <h1 className="font-display text-8xl md:text-9xl font-black tracking-wider uppercase text-pink-600 drop-shadow-lg">
            PLAY BUNI
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 -mt-4">
          {/* Left Column */}
          <div className="col-span-3 flex flex-col space-y-6 md:space-y-8 pl-4">
            <div className="mae-buni-title">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-yellow-400 stroke-black">
                MAE BUNI
              </h2>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-yellow-400 stroke-black">
                FIRST
              </h2>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-yellow-400 stroke-black">
                EDITION
              </h2>
            </div>

            <Link href="/articles/seduction-tips" className="hover:opacity-80 transition-opacity">
              <h3 className="text-lg md:text-xl font-display font-bold uppercase leading-tight text-pink-600 tracking-wide drop-shadow">
                <span>5 TIPS TO SEDUCE</span>
                <br />
                <span>HER ONLY USING</span>
                <br />
                <span>SYNTAX</span>
              </h3>
            </Link>

            <Link href="/articles/coyote-confessions" className="hover:opacity-80 transition-opacity">
              <h3 className="text-lg md:text-xl font-bold uppercase leading-tight text-sage-green">
                COYOTE CONFESSIONS:
                <br />
                <span className="text-gray-700 font-black">
                  "MISTAKES HAVE
                  <br />
                  DEFINITELY BEEN MADE
                  <br />
                  ALONG THE ROAD"
                </span>
              </h3>
            </Link>

            <Link href="/articles/pepe-tips" className="hover:opacity-80 transition-opacity">
              <div>
                <h3 className="text-lg md:text-xl font-bold uppercase leading-tight">Archetype</h3>
                <h3 className="text-lg md:text-xl font-black uppercase leading-tight text-perseverance">
                  "PERSEVERANCE
                  <br />
                  IS THE KEY"
                </h3>
              </div>
            </Link>
          </div>

          {/* Center Column - Mae Buni Image */}
          <div className="col-span-6 relative flex justify-center items-center">
            <div className="relative w-full h-[500px] md:h-[600px]">
              <Image
                src="/images/mae-buni.png"
                alt="Mae Buni in Martini Glass"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3 flex flex-col space-y-6 md:space-y-8 items-end text-right pr-4">
            <div className="mt-8">
              <p className="text-sm font-medium text-red-600 uppercase">HOT BUNI</p>
              <Link href="/articles/cloud-server" className="hover:opacity-80 transition-opacity">
                <h3 className="text-xl md:text-2xl font-black uppercase leading-tight text-right">
                  CLOUD SERVER:
                  <br />
                  HOW TO GET
                  <br />
                  HER API?
                </h3>
              </Link>
            </div>

            <div className="mt-8">
              <p className="text-xl font-medium text-orange-500 uppercase">INTERVIEW</p>
              <Link href="/articles/umbra-nyx-interview" className="hover:opacity-80 transition-opacity">
                <h3 className="text-lg md:text-xl font-medium uppercase">UmbrA & NyX</h3>
                <h3 className="text-xl md:text-2xl font-black uppercase leading-tight text-blue-600">
                  "REVELATIONS FROM 6<br />
                  MONTHS OF BEING
                  <br />
                  ONLINE.."
                </h3>
              </Link>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-orange-500 uppercase">QUIZ:</p>
              <Link href="/quiz/ai-character" className="hover:opacity-80 transition-opacity">
                <h3 className="text-xl md:text-2xl font-black uppercase leading-tight">
                  WHICH AI
                  <br />
                  CHARACTER AGENT
                  <br />
                  ARE YOU?
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Full-screen Buni Cover Image */}
      <div
        className="h-screen w-full flex items-center justify-center scroll-snap-align-start bg-[#FFCDB2]"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="w-full max-w-6xl px-4">
          <Image
            src="/images/buni-cover.png"
            alt="Buni Cover"
            width={1200}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* 3D Card with Buni Image */}
      <div
        className="h-screen w-full flex items-center justify-center scroll-snap-align-start bg-yellow-300"
        style={{ scrollSnapAlign: "start" }}
      >
        <CardContainer containerClassName="py-10">
          <CardBody className="relative h-auto w-auto">
            <CardItem translateZ={50} className="w-full">
              <div className="relative w-[500px] h-[500px] overflow-hidden rounded-xl">
                <Image src="/images/buni-card.png" alt="Buni" fill className="object-cover" priority />
              </div>
            </CardItem>
            <CardItem translateZ={100} translateY={60} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <Link href="/chat">
                <button className="bg-red-600 hover:bg-red-700 text-cream-100 font-display font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Chat with Buni
                </button>
              </Link>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* Logo Marquee Section */}
      <div
        className="h-screen w-full flex items-center justify-center scroll-snap-align-start"
        style={{ scrollSnapAlign: "start" }}
      >
        <LogoMarqueeSection />
      </div>
    </SnapScroll>
  )
}
