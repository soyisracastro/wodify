"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Settings, Plus, History, User, Play, Crown, Zap, Save, CheckCircle } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

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

interface SubscriptionStatus {
  tier: 'FREE' | 'PREMIUM'
  isActive: boolean
  remainingWods: number | 'unlimited'
  dailyLimit: number | 'unlimited'
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wod, setWod] = useState<Wod | null>(null)
  const [currentWodId, setCurrentWodId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchSubscriptionStatus()
    }
  }, [session])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription/status")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  const saveWod = async () => {
    if (!currentWodId) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/wod/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wodId: currentWodId,
          title: wod?.title,
        }),
      })

      if (response.ok) {
        setError("")
        // Could show a success message here
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save WOD")
      }
    } catch (error) {
      setError("An error occurred while saving the WOD")
    } finally {
      setIsSaving(false)
    }
  }

  const completeWod = async () => {
    if (!currentWodId) return

    setIsCompleting(true)
    try {
      const response = await fetch("/api/wod/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wodId: currentWodId,
          // Could add duration, notes, etc. in a future enhancement
        }),
      })

      if (response.ok) {
        setError("")
        // Could show a success message here
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to mark WOD as completed")
      }
    } catch (error) {
      setError("An error occurred while completing the WOD")
    } finally {
      setIsCompleting(false)
    }
  }

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
        setCurrentWodId(newWod.id)
        // Refresh subscription status after successful generation
        await fetchSubscriptionStatus()
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
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">WODify</span>
              </Link>
              <span className="text-neutral-500 dark:text-neutral-400">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                Welcome, {session.user?.name}
              </span>
              <ThemeToggle />
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
        {/* Subscription Status */}
        {!subscriptionLoading && subscription && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {subscription.tier === 'PREMIUM' ? (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <Zap className="h-6 w-6 text-blue-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {subscription.tier === 'PREMIUM' ? 'Premium' : 'Free'} Plan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subscription.tier === 'PREMIUM'
                        ? 'Unlimited AI-generated WODs'
                        : `Daily limit: ${subscription.remainingWods === 'unlimited' ? 'unlimited' : `${subscription.remainingWods}/${subscription.dailyLimit}`} WODs remaining`
                      }
                    </p>
                  </div>
                </div>
                {subscription.tier === 'FREE' && (
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>

              {/* Premium Actions */}
              {subscription?.tier === 'PREMIUM' && currentWodId && (
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={saveWod}
                    disabled={isSaving}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Workout
                  </Button>
                  <Button
                    onClick={completeWod}
                    disabled={isCompleting}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isCompleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Mark Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={generateWod}
            disabled={isLoading || (subscription?.tier === 'FREE' && subscription.remainingWods !== 'unlimited' && subscription.remainingWods === 0)}
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-red-500 hover:bg-red-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
            <span>Generate WOD</span>
            {subscription && subscription.tier === 'FREE' && subscription.remainingWods === 0 && (
              <span className="text-xs opacity-75">Limit reached</span>
            )}
          </Button>

          <Link href="/dashboard/profile">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <User className="h-6 w-6" />
              <span>Profile</span>
            </Button>
          </Link>

          {subscription?.tier === 'PREMIUM' && (
            <Link href="/dashboard/history">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <History className="h-6 w-6" />
                <span>History</span>
              </Button>
            </Link>
          )}

          <Link href="/dashboard/presets">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Play className="h-6 w-6" />
              <span>Browse Presets</span>
            </Button>
          </Link>

          <Link href="/dashboard/settings">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
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