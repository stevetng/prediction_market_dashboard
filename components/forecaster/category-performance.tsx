"use client"

import { useState, useEffect } from "react"
import { generateCategoryPerformance } from "@/lib/mock-data"
import { formatCurrency, cn } from "@/lib/utils"
import { BarChart3 } from "lucide-react"

interface CategoryData {
  category: string
  winRate: number
  trades: number
  pnl: number
}

export function CategoryPerformance() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState<CategoryData[]>([])

  useEffect(() => {
    setIsClient(true)
    setData(generateCategoryPerformance())
  }, [])

  if (!isClient || data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Performance by Market</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          {!isClient ? "Loading..." : "No data available"}
        </div>
      </div>
    )
  }

  // Sort data by P&L for better visualization
  const sortedData = [...data].sort((a, b) => b.pnl - a.pnl)
  const maxAbsPnL = Math.max(...sortedData.map(item => Math.abs(item.pnl)))

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium">Performance by Market</h3>
      </div>

      <div className="flex-1 space-y-4">
        {sortedData.map((item, index) => {
          const barWidth = Math.abs(item.pnl) / maxAbsPnL * 100
          const isPositive = item.pnl >= 0
          
          return (
            <div key={item.category} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {item.category}
                </span>
                <span className={cn(
                  "text-sm font-mono font-medium",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {formatCurrency(item.pnl)}
                </span>
              </div>
              
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    isPositive ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span>{item.trades} trades</span>
                <span>{item.winRate.toFixed(0)}% win rate</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
