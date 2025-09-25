"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Play } from "lucide-react"
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

interface PresetWod {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  equipment: string
  location: string
  category: string
  tags: string[]
  sections: WodSection[]
}

export default function PresetsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [presets, setPresets] = useState<PresetWod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    fetchPresets()
  }, [])

  const fetchPresets = async () => {
    try {
      const response = await fetch("/api/presets")
      if (response.ok) {
        const data = await response.json()
        setPresets(data)
      } else {
        setError("Failed to load preset workouts")
      }
    } catch (_error) {
      setError("An error occurred while loading presets")
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
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Preset Workouts</span>
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

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <Card key={preset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-red-600 dark:text-red-400">
                      {preset.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {preset.description}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    preset.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                    preset.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {preset.difficulty}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {preset.duration}
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {preset.equipment}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Sections:</h4>
                  {preset.sections.slice(0, 3).map((section) => (
                    <div key={section.id} className="text-sm text-gray-600 dark:text-gray-400">
                      • {section.title} ({section.type})
                    </div>
                  ))}
                  {preset.sections.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{preset.sections.length - 3} more sections
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link href={`/dashboard/presets/${preset.id}`}>
                    <Button className="w-full" size="sm">
                      View Full Workout
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {presets.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Preset Workouts Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Preset workouts should be loaded in the database.
              </p>
              <Button onClick={fetchPresets}>
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}