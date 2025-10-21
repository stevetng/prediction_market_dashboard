"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Target, Users } from "lucide-react"

export function InsiderView() {
  const [isClient, setIsClient] = useState(false)
  const [userHitRate, setUserHitRate] = useState(68.5)
  const [marketHitRate, setMarketHitRate] = useState(62.3)
  const totalPredictions = 247
  
  useEffect(() => {
    setIsClient(true)
    setUserHitRate(68.5 + Math.random() * 2)
    setMarketHitRate(62.3 + Math.random() * 2)
  }, [])

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Insider View</h3>
        <Target className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Your Hit Rate</span>
          </div>
          <div className="text-3xl font-bold text-success">{userHitRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">{totalPredictions} predictions</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Market Average</span>
          </div>
          <div className="text-3xl font-bold">{marketHitRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Global benchmark</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Correct Predictions</span>
          <span className="font-semibold">{Math.floor(totalPredictions * (userHitRate / 100))}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Incorrect Predictions</span>
          <span className="font-semibold">{totalPredictions - Math.floor(totalPredictions * (userHitRate / 100))}</span>
        </div>
      </div>
    </div>
  )
}
