"use client"

import { useEffect } from "react"
import { useDashboardStore } from "@/lib/store"

export function useRealtimeUpdates() {
  const updateData = useDashboardStore((state) => state.updateData)
  const initializeData = useDashboardStore((state) => state.initializeData)
  const isInitialized = useDashboardStore((state) => state.isInitialized)

  useEffect(() => {
    // Initialize data on client-side only
    if (!isInitialized) {
      initializeData()
    }
  }, [initializeData, isInitialized])

  useEffect(() => {
    // Only start updates after initialization
    if (!isInitialized) return

    const interval = setInterval(() => {
      updateData()
    }, 5000)

    return () => clearInterval(interval)
  }, [updateData, isInitialized])
}
