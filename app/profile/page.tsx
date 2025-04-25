import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-black mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  Guest
                </div>
                <div>
                  <p className="font-medium text-lg">Guest User</p>
                  <p className="text-sm text-gray-500">Not signed in</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/subscribe">Subscribe</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Play Buni Subscription</CardTitle>
              <CardDescription>Manage your subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-1">No Active Subscription</h3>
                <p className="text-sm text-gray-700">Subscribe to access premium content</p>
              </div>

              <div className="pt-2">
                <h3 className="font-medium mb-2">Subscription Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Access to all digital editions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Exclusive interactive content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Early access to new features</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/subscribe">Subscribe Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Your AI Characters</CardTitle>
                <CardDescription>AI personas you've created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't created any AI characters yet.</p>
                  <Button asChild>
                    <Link href="/quiz/ai-character">Take the AI Character Quiz</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
