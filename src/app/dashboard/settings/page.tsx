"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft, Bell, Moon, Sun, Shield, Settings as SettingsIcon } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [settings, setSettings] = useState({
    emailNotifications: true,
    workoutReminders: true,
    weeklyProgress: false,
    dataSharing: false,
    units: "metric" as "metric" | "imperial",
    language: "es" as "es" | "en",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    // Load user settings from localStorage or API
    const savedSettings = localStorage.getItem('wodify-settings')
    if (savedSettings) {
      try {
        setSettings({ ...settings, ...JSON.parse(savedSettings) })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const handleSettingChange = (key: string, value: boolean | string) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    // Save to localStorage immediately
    localStorage.setItem('wodify-settings', JSON.stringify(newSettings))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Here you would typically save to your backend
      // For now, we'll just save to localStorage
      localStorage.setItem('wodify-settings', JSON.stringify(settings))

      setSuccess("Settings saved successfully!")
    } catch (error) {
      setError("An error occurred while saving your settings")
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
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Settings</span>
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Application Settings
              </CardTitle>
              <CardDescription>
                Customize your Wodify experience and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Notifications Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </h3>

                  <div className="space-y-4 pl-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive email updates about your account and workouts
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="workout-reminders">Workout Reminders</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get reminded to complete your daily workouts
                        </p>
                      </div>
                      <Switch
                        id="workout-reminders"
                        checked={settings.workoutReminders}
                        onCheckedChange={(checked) => handleSettingChange('workoutReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-progress">Weekly Progress Reports</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive weekly summaries of your fitness progress
                        </p>
                      </div>
                      <Switch
                        id="weekly-progress"
                        checked={settings.weeklyProgress}
                        onCheckedChange={(checked) => handleSettingChange('weeklyProgress', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Appearance
                  </h3>

                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose your preferred theme. You can also toggle between light and dark mode using the button in the header.
                      </p>
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Use system preference or toggle manually
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value as "es" | "en")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Preferences
                  </h3>

                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="units">Units</Label>
                      <select
                        id="units"
                        value={settings.units}
                        onChange={(e) => handleSettingChange('units', e.target.value as "metric" | "imperial")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="metric">Metric (kg, km)</option>
                        <option value="imperial">Imperial (lbs, miles)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-sharing">Data Sharing</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Allow anonymous usage data to help improve Wodify
                        </p>
                      </div>
                      <Switch
                        id="data-sharing"
                        checked={settings.dataSharing}
                        onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account</h3>

                  <div className="space-y-4 pl-7">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        value={session.user?.email || ""}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email address cannot be changed here. Contact support if needed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}