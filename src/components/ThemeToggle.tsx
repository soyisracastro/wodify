"use client"

import { useTheme } from './contexts/ThemeContext'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
      ) : (
        <Sun className="h-4 w-4 text-neutral-400 dark:text-neutral-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}