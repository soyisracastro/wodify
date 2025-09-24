"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Settings, Plus, History, User, Play } from "lucide-react"
import Link from "next/link"

interface WodSection {
  title: string
  duration?: string
  parts?: string[]
  details?: string[]
  type?: string
  description?: string
  movements?: string[]
  notes?: string
}

interface Wod {
  title: string
  warmUp: WodSection
  strengthSkill: WodSection
  metcon: WodSection
  coolDown: WodSection
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wod, setWod] = useState<Wod | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const generateWod = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/wod/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: session?.user?.location || "GYM",
          equipment: session?.user?.equipment || "FULL",
          level: session?.user?.level || "INTERMEDIATE",
          injury: "",
        }),
      })

      if (response.ok) {
        const newWod = await response.json()
        setWod(newWod)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to generate WOD")
      }
    } catch (error) {
      setError("An error occurred while generating the WOD")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold">WODify</span>
              </Link>
              <span className="text-gray-600 dark:text-gray-300">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {session.user?.name}
              </span>
              <Link href="/auth/signout">
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={generateWod}
            disabled={isLoading}
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
            <span>Generate WOD</span>
          </Button>

          <Link href="/dashboard/profile">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <User className="h-6 w-6" />
              <span>Profile</span>
            </Button>
          </Link>

          <Link href="/dashboard/history">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <History className="h-6 w-6" />
              <span>History</span>
            </Button>
          </Link>

          <Link href="/dashboard/presets">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Play className="h-6 w-6" />
              <span>Browse Presets</span>
            </Button>
          </Link>

          <Link href="/dashboard/settings">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* WOD Display */}
        {wod && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-red-600 dark:text-red-400">
                {wod.title}
              </CardTitle>
              <CardDescription className="text-center">
                Your personalized CrossFit workout for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Warm Up */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                  {wod.warmUp.title}
                </h3>
                {wod.warmUp.duration && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Duration: {wod.warmUp.duration}
                  </p>
                )}
                {wod.warmUp.parts && (
                  <ul className="list-disc list-inside space-y-1">
                    {wod.warmUp.parts.map((part, index) => (
                      <li key={index} className="text-sm">{part}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Strength/Skill */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg text-green-600 dark:text-green-400">
                  {wod.strengthSkill.title}
                </h3>
                {wod.strengthSkill.details && (
                  <ul className="list-disc list-inside space-y-1">
                    {wod.strengthSkill.details.map((detail, index) => (
                      <li key={index} className="text-sm">{detail}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Metcon */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-lg text-red-600 dark:text-red-400">
                  {wod.metcon.title}
                </h3>
                {wod.metcon.type && (
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type: {wod.metcon.type}
                  </p>
                )}
                {wod.metcon.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {wod.metcon.description}
                  </p>
                )}
                {wod.metcon.movements && (
                  <ul className="list-disc list-inside space-y-1">
                    {wod.metcon.movements.map((movement, index) => (
                      <li key={index} className="text-sm">{movement}</li>
                    ))}
                  </ul>
                )}
                {wod.metcon.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                    Note: {wod.metcon.notes}
                  </p>
                )}
              </div>

              {/* Cool Down */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                  {wod.coolDown.title}
                </h3>
                {wod.coolDown.duration && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Duration: {wod.coolDown.duration}
                  </p>
                )}
                {wod.coolDown.parts && (
                  <ul className="list-disc list-inside space-y-1">
                    {wod.coolDown.parts.map((part, index) => (
                      <li key={index} className="text-sm">{part}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!wod && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No WOD Generated Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click the button above to generate your first personalized CrossFit workout!
              </p>
              <Button onClick={generateWod}>
                Generate Your First WOD
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}