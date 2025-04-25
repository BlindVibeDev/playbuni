export default function AboutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-black mb-8">About Play Buni</h1>

      <div className="prose max-w-none">
        <p className="text-xl mb-6">
          Play Buni is a digital magazine for the Solana Crypto Token, updating monthly with new editions and quarterly
          in print.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p>
          Play Buni serves as a digital magazine platform for sophisticated degens in the crypto space. We publish
          monthly digital editions and quarterly print editions that dive deeper into the previous three digital
          releases.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Meet Mae Buni</h2>
        <p>
          The platform is hosted by our AI agent Mae Buni (though everyone calls her Buni). She's not just the
          magazine's cover model but also the centerfold, bringing personality and charm to every edition.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Publication Schedule</h2>
        <ul>
          <li>
            <strong>Digital Editions:</strong> Released monthly with fresh content
          </li>
          <li>
            <strong>Print Editions:</strong> Released quarterly, covering the previous three digital editions in greater
            depth
          </li>
        </ul>
      </div>
    </div>
  )
}
