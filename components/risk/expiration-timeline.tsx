"use client"

import { useMemo, useState, useEffect } from "react"
import { generateEvents } from "@/lib/mock-data"
import { formatCurrency, cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export function ExpirationTimeline() {
  const [isClient, setIsClient] = useState(false)
  const [events, setEvents] = useState<ReturnType<typeof generateEvents>>([])
  
  useEffect(() => {
    setIsClient(true)
    setEvents(generateEvents(6))
  }, [])
  
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.resolutionDate.getTime() - b.resolutionDate.getTime()),
    [events],
  )

  const now = useMemo(() => new Date(), [isClient])
  const maxDate = sortedEvents[sortedEvents.length - 1]?.resolutionDate || now
  const timeRange = maxDate.getTime() - now.getTime()

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Upcoming Expirations</h3>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Loading expirations...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Upcoming Expirations</h3>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {sortedEvents.map((event) => {
          const daysUntil = Math.ceil((event.resolutionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          const position = ((event.resolutionDate.getTime() - now.getTime()) / timeRange) * 100

          return (
            <div key={event.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{event.name}</div>
                  <div className="text-xs text-muted-foreground">{event.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{formatCurrency(event.exposure)}</div>
                  <div
                    className={cn(
                      "text-xs font-medium",
                      daysUntil <= 3
                        ? "text-destructive"
                        : daysUntil <= 7
                          ? "text-yellow-500"
                          : "text-muted-foreground",
                    )}
                  >
                    {daysUntil}d
                  </div>
                </div>
              </div>
              <div className="relative h-1.5 rounded-full bg-background overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                    daysUntil <= 3 ? "bg-destructive" : daysUntil <= 7 ? "bg-yellow-500" : "bg-primary",
                  )}
                  style={{ width: `${Math.min(position, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
