import { SubscriptionForm } from "@/components/subscription-form"

export default function SubscribePage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-4">Subscribe to Play Buni</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of sophisticated degens and get exclusive access to the latest editions of Play Buni
            magazine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Why Subscribe?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Monthly digital editions with exclusive content</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Quarterly print editions with in-depth coverage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Early access to interactive features and quizzes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Community access to discuss with fellow readers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Special interviews with crypto personalities</span>
              </li>
            </ul>
          </div>

          <div>
            <SubscriptionForm />
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">How often is Play Buni published?</h3>
              <p className="text-gray-700">
                Play Buni digital editions are published monthly, with quarterly print editions that cover the previous
                three digital releases in greater depth.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-700">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your
                current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-bold">What's included in the Premium subscription?</h3>
              <p className="text-gray-700">
                Premium subscribers receive collector's edition prints, exclusive merchandise, early access to new
                features, and invitations to virtual events with the Play Buni team.
              </p>
            </div>
            <div>
              <h3 className="font-bold">How do I access the digital editions?</h3>
              <p className="text-gray-700">
                Digital editions are accessible through your account on the Play Buni website and can be read on any
                device with a web browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
