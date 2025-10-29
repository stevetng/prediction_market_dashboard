"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function DashboardHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Force start in light mode for debugging
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    setIsDarkMode(false)
    
    console.log('Component mounted, set to light mode')
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    
    // Update state first
    setIsDarkMode(newDarkMode)
    
    // Update DOM immediately with more explicit changes
    const html = document.documentElement
    if (newDarkMode) {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
      localStorage.setItem('theme', 'light')
    }
    
    // Force a repaint
    html.style.display = 'none'
    html.offsetHeight // Trigger reflow
    html.style.display = ''
    
    console.log('Theme toggled to:', newDarkMode ? 'dark' : 'light')
    console.log('HTML classes:', html.className)
    console.log('Color scheme:', html.style.colorScheme)
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Prediction Market Analytics</h1>
            <span className="text-sm text-muted-foreground">Advanced Trading Analysis</span>
          </div>
          <div className="w-20 h-10"></div> {/* Placeholder for button */}
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Prediction Market Analytics</h1>
          <span className="text-sm text-muted-foreground">Advanced Trading Analysis</span>
        </div>
        
        <button
          onClick={(e) => {
            e.preventDefault()
            console.log('Button clicked, current mode:', isDarkMode)
            toggleDarkMode()
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
          type="button"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Switch to Light</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Switch to Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
