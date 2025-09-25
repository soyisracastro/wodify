"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Clock, Target, Zap, Heart } from "lucide-react"
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

export default function PresetDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [preset, setPreset] = useState<PresetWod | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      fetchPreset(params.id as string)
    }
  }, [params.id])

  const fetchPreset = async (id: string) => {
    try {
      const response = await fetch(`/api/presets/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPreset(data)
      } else {
        setError("Failed to load workout details")
      }
    } catch (_error) {
      setError("An error occurred while loading workout")
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'ADVANCED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'WARMUP': return <Heart className="h-5 w-5 text-blue-500" />
      case 'STRENGTH': return <Target className="h-5 w-5 text-green-500" />
      case 'METCON': return <Zap className="h-5 w-5 text-red-500" />
      case 'COOLDOWN': return <Clock className="h-5 w-5 text-purple-500" />
      default: return <Target className="h-5 w-5 text-gray-500" />
    }
  }

  const getSectionBorderColor = (type: string) => {
    switch (type) {
      case 'WARMUP': return 'border-blue-500'
      case 'STRENGTH': return 'border-green-500'
      case 'METCON': return 'border-red-500'
      case 'COOLDOWN': return 'border-purple-500'
      default: return 'border-gray-500'
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/dashboard/presets">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Presets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!preset) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>Workout not found</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/dashboard/presets">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Presets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/presets" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Presets</span>
              </Link>
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{preset.title}</span>
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
        {/* Workout Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-red-600 dark:text-red-400 mb-2">
                  {preset.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {preset.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex flex-wrap gap-2 justify-end">
                  <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(preset.difficulty)}`}>
                    {preset.difficulty}
                  </span>
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                    {preset.duration}
                  </span>
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                    {preset.equipment}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Category:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{preset.category}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Location:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{preset.location}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Tags:</span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{preset.tags.join(", ")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Sections */}
        <div className="space-y-6">
          {preset.sections.map((section) => (
            <Card key={section.id} className={`border-l-4 ${getSectionBorderColor(section.type)}`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {getSectionIcon(section.type)}
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {section.type.toLowerCase()}
                      </span>
                      {section.duration && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {section.duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.description && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {section.description}
                  </p>
                )}

                {section.movements && section.movements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Movements:</h4>
                    <ul className="space-y-1">
                      {section.movements.map((movement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{movement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> {section.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
          <Button className="bg-red-600 hover:bg-red-700">
            Start This Workout
          </Button>
        </div>
      </main>
    </div>
  )
}