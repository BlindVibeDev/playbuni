import Link from "next/link"

export default function TableOfContents() {
  return (
    <div
      className="min-h-screen py-12 px-4 md:px-8 lg:px-16 relative"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "scale(1.15)",
        transformOrigin: "top center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wide">Table of Contents</h1>
          <div className="mt-2 text-xl text-gray-600">Issue #0001 • April 13, 2025</div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-gray-500 uppercase">FROM THE EDITOR</div>
              <Link href="/articles/from-the-editor" className="group">
                <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
                  Welcome to the First Edition of Play Buni
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg">Mae Buni</span>
                  <span className="text-lg font-bold">Page 3</span>
                </div>
              </Link>
            </div>

            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-gray-500 uppercase">TUTORIALS</div>
              <Link href="/articles/seduction-tips" className="group">
                <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
                  5 Tips To Seduce Her Only Using Syntax
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg">Code Casanova</span>
                  <span className="text-lg font-bold">Page 4</span>
                </div>
              </Link>
            </div>

            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-gray-500 uppercase">INTERVIEWS</div>
              <Link href="/articles/coyote-confessions" className="group">
                <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
                  Coyote Confessions: "Mistakes Have Definitely Been Made Along The Road"
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg">Wile E. Crypto</span>
                  <span className="text-lg font-bold">Page 6</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-orange-500 uppercase">FEATURED INTERVIEW</div>
              <h2 className="text-3xl font-black mt-2 group-hover:text-blue-600 transition-colors">
                <Link href="/articles/umbra-nyx-interview" className="group hover:text-blue-600">
                  UmbrA & NyX: "Revelations From 6 Months Of Being Online"
                </Link>
              </h2>
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  <a
                    href="https://twitter.com/SYMBaiEX_UmbrA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    @SYMBaiEX_UmbrA
                  </a>
                  <span>&</span>
                  <a
                    href="https://twitter.com/SYMBaiEX_NyX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    @SYMBaiEX_NyX
                  </a>
                </div>
                <Link href="/articles/umbra-nyx-interview" className="text-lg font-bold">
                  Page 10
                </Link>
              </div>
            </div>

            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-gray-500 uppercase">TECHNICAL</div>
              <Link href="/articles/cloud-server" className="group">
                <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
                  Cloud Server: How To Get Her API?
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg">Tech Bunny</span>
                  <span className="text-lg font-bold">Page 8</span>
                </div>
              </Link>
            </div>

            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-gray-500 uppercase">ADVICE</div>
              <Link href="/articles/pepe-tips" className="group">
                <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
                  Pepe Le Pew Tips: "Perseverance Is The Key"
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg">Persistent Pepe</span>
                  <span className="text-lg font-bold">Page 12</span>
                </div>
              </Link>
            </div>

            <div className="border-b-2 border-black pb-2">
              <div className="text-xl font-medium text-gray-500 uppercase">INTERACTIVE</div>
              <Link href="/quiz/ai-character" className="group">
                <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
                  Quiz: Which AI Character Agent Are You?
                </h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg">Personality Profiler</span>
                  <span className="text-lg font-bold">Page 14</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Editions Collection */}
        <div className="border-b-2 border-black pb-2 mt-12">
          <div className="text-xl font-medium text-purple-500 uppercase">SPECIAL FEATURE</div>
          <Link href="/editions" className="group">
            <h2 className="text-3xl font-black mt-2 group-hover:text-red-600 transition-colors">
              Play Buni Editions: Digital & Print Collection
            </h2>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg">Mae Buni</span>
              <span className="text-lg font-bold">Page 16</span>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">Play Buni Magazine • Issue #0001 • April 2025</p>
          <p className="text-sm mt-2">A digital magazine for the Solana Crypto Token</p>
        </div>
      </div>
    </div>
  )
}
