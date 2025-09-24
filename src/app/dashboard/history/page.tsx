"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Calendar, Clock, Star } from "lucide-react"
import Link from "next/link"

interface WodSection {
  id: string
  title: string
  type: string
  duration?: string
  description?: string
  movements?: string[]
  notes?: string
  order: number
}

interface WodProgress {
  id: string
  completedAt: string
  duration?: number
  notes?: string
  rating?: number
  perceivedEffort?: number
}

interface GeneratedWod {
  id: string
  title: string
  createdAt: string
  isCustom: boolean
  sections: WodSection[]
  progress: WodProgress[]
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [history, setHistory] = useState<GeneratedWod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchHistory()
    }
  }, [session])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/wod/history")
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      } else if (response.status === 403) {
        setError("Premium subscription required to view workout history")
      } else {
        setError("Failed to load workout history")
      }
    } catch (error) {
      setError("An error occurred while loading history")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Workout History</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                Welcome, {session.user?.name}
              </span>
              <Link href="/auth/signout">
                <Button variant="outline" size="sm" className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* History List */}
        <div className="space-y-6">
          {history.map((wod) => (
            <Card key={wod.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-red-600 dark:text-red-400">
                      {wod.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(wod.createdAt).toLocaleDateString()}
                      </span>
                      {wod.isCustom && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Saved
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {wod.progress.length > 0 && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <Clock className="h-4 w-4" />
                        Completed {new Date(wod.progress[0].completedAt).toLocaleDateString()}
                      </div>
                      {wod.progress[0].duration && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Duration: {wod.progress[0].duration} min
                        </div>
                      )}
                      {wod.progress[0].rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{wod.progress[0].rating}/5</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Sections:</h4>
                  {wod.sections.slice(0, 2).map((section) => (
                    <div key={section.id} className="text-sm text-gray-600 dark:text-gray-400">
                      • {section.title} ({section.type})
                    </div>
                  ))}
                  {wod.sections.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{wod.sections.length - 2} more sections
                    </div>
                  )}

                  {wod.progress.length > 0 && wod.progress[0].notes && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {wod.progress[0].notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {history.length === 0 && !isLoading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Workout History Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Complete some workouts to see your history here.
              </p>
              <Link href="/dashboard">
                <Button>Generate Your First WOD</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}