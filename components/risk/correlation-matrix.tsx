"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const CATEGORIES = ["Politics", "Economics", "Sports", "Technology", "Climate"]

export function CorrelationMatrix() {
  const [isClient, setIsClient] = useState(false)
  const [correlations, setCorrelations] = useState<number[][]>([])
  
  useEffect(() => {
    setIsClient(true)
    const generatedCorrelations = CATEGORIES.map((cat1) =>
      CATEGORIES.map((cat2) => {
        if (cat1 === cat2) return 1
        return (Math.random() - 0.5) * 2
      }),
    )
    setCorrelations(generatedCorrelations)
  }, [])

  const getCorrelationColor = (value: number) => {
    if (value > 0.5) return "bg-success/80"
    if (value > 0.2) return "bg-success/40"
    if (value > -0.2) return "bg-muted"
    if (value > -0.5) return "bg-destructive/40"
    return "bg-destructive/80"
  }

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Correlation Matrix</h3>
          <p className="text-xs text-muted-foreground">Market co-movement analysis</p>
        </div>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Loading correlations...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Correlation Matrix</h3>
        <p className="text-xs text-muted-foreground">Market co-movement analysis</p>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-24" />
            {CATEGORIES.map((cat) => (
              <div key={cat} className="w-20 text-center">
                <div className="text-xs font-medium text-muted-foreground transform -rotate-45 origin-left mb-8">
                  {cat}
                </div>
              </div>
            ))}
          </div>
          {CATEGORIES.map((cat1, i) => (
            <div key={cat1} className="flex items-center">
              <div className="w-24 text-xs font-medium text-muted-foreground pr-2 text-right">{cat1}</div>
              {CATEGORIES.map((cat2, j) => {
                const value = correlations[i][j]
                return (
                  <div key={cat2} className="w-20 p-1">
                    <div
                      className={cn(
                        "h-12 rounded flex items-center justify-center transition-all hover:scale-110",
                        getCorrelationColor(value),
                      )}
                    >
                      <span className="text-xs font-semibold">{value.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/80" />
          <span className="text-xs text-muted-foreground">Strong Negative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span className="text-xs text-muted-foreground">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/80" />
          <span className="text-xs text-muted-foreground">Strong Positive</span>
        </div>
      </div>
    </div>
  )
}
