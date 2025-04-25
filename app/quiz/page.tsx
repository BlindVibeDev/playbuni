import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const quizzes = [
  {
    title: "Which AI Character Agent Are You?",
    description: "Take this fun quiz to discover which AI character agent matches your personality.",
    path: "/quiz/ai-character",
  },
  {
    title: "AI Character Gallery",
    description: "Explore the unique AI personas created by the Play Buni community.",
    path: "/quiz/gallery",
  },
]

export default function QuizPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-black mb-8">Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.path} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{quiz.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={quiz.path} className="text-sm font-medium text-primary hover:underline">
                Take the quiz →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
