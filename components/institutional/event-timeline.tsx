"use client"

import { useMemo, useState, useEffect } from "react"
import { generateEvents } from "@/lib/mock-data"
import { formatRelativeTime, formatCurrency, cn } from "@/lib/utils"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"

export function EventTimeline() {
  const [isClient, setIsClient] = useState(false)
  const [events, setEvents] = useState<ReturnType<typeof generateEvents>>([])
  
  useEffect(() => {
    setIsClient(true)
    setEvents(generateEvents(8))
  }, [])
  
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.resolutionDate.getTime() - b.resolutionDate.getTime()),
    [events],
  )
  const [showAll, setShowAll] = useState(false)
  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 5)

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Upcoming Event Timeline</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Loading events...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Upcoming Event Timeline</h3>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className={cn("space-y-3", showAll && "max-h-[400px] overflow-y-auto pr-2")}>
        {displayedEvents.map((event, index) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-background hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {index < displayedEvents.length - 1 && <div className="w-px h-full bg-border mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-sm font-medium line-clamp-1">{event.name}</div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(event.resolutionDate)}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{event.category}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">{formatCurrency(event.exposure)}</span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={cn(
                    "font-medium",
                    event.probability > 0.6
                      ? "text-emerald-600"
                      : event.probability < 0.4
                        ? "text-red-600"
                        : "text-muted-foreground",
                  )}
                >
                  {(event.probability * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedEvents.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 rounded-lg hover:bg-accent/50"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show {sortedEvents.length - 5} More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
