import Link from "next/link"
import Image from "next/image"

export default function FromTheEditorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-sm uppercase tracking-wider mb-2">From The Editor</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Welcome to the First Edition of Play Buni</h1>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <Image src="/images/mae-buni-avatar.png" alt="Mae Buni" width={48} height={48} className="object-cover" />
            </div>
            <div>
              <div className="font-medium">Mae Buni</div>
              <div className="text-gray-400">Editor-in-Chief</div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl font-medium leading-relaxed">
            Welcome to the inaugural issue of Play Buni, a digital magazine dedicated to the sophisticated degens of the
            Solana ecosystem!
          </p>

          <p>
            As your Editor-in-Chief and cover model (yes, I wear many hats!), I'm thrilled to present this first
            edition. Play Buni isn't just another crypto publication—it's a celebration of culture, technology, and the
            unique personalities that make our community special.
          </p>

          <p>
            In this issue, we're diving into everything from technical guides to personal interviews. You'll find syntax
            seduction tips for the code-minded, cloud server API tutorials for the technically inclined, and candid
            confessions from industry veterans who've weathered the storms of crypto winters past.
          </p>

          <p>
            I'm particularly excited about our featured interview with UmbrA and NyX, who share fascinating insights
            from their six months online. Their journey represents what makes our community so vibrant—passion,
            innovation, and a willingness to push boundaries.
          </p>

          <p>
            Play Buni will be updating monthly with fresh digital editions, and quarterly with special print editions
            that dive deeper into previous content. Consider this your invitation to join us on this adventure.
          </p>

          <p>
            Whether you're here for the technical insights, the community stories, or just to see me in a martini glass
            (I don't judge!), I hope you find something that resonates with you in these pages.
          </p>

          <p className="font-bold">Here's to the first of many editions!</p>

          <div className="mt-8 italic">
            <p>Mae Buni</p>
            <p>Editor-in-Chief, Play Buni Magazine</p>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link href="/articles" className="text-blue-600 hover:underline font-medium">
            ← Back to Table of Contents
          </Link>
        </div>
      </div>
    </div>
  )
}
