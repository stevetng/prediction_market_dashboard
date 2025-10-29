"use client"

import { useState, useEffect } from "react"
import { useDashboardStore } from "@/lib/store"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, PieChart, BarChart3, Activity, Target } from "lucide-react"
import { motion } from "framer-motion"

export function PortfolioSummary() {
  const [isClient, setIsClient] = useState(false)
  const portfolioStats = useDashboardStore((state) => state.portfolioStats)
  const currentPositions = useDashboardStore((state) => state.currentPositions)
  const availableCash = useDashboardStore((state) => state.availableCash)
  const positions = useDashboardStore((state) => state.positions)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Portfolio Summary</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    )
  }

  const totalValue = portfolioStats.value
  const positionsValue = currentPositions.value
  const cashValue = availableCash.value
  const positionsPercentage = totalValue > 0 ? (positionsValue / totalValue) * 100 : 0
  const cashPercentage = totalValue > 0 ? (cashValue / totalValue) * 100 : 0

  // Calculate some portfolio metrics
  const activePositions = positions.filter(p => Math.abs(p.currentValue) > 100).length
  const totalPositions = positions.length
  const avgPositionSize = totalPositions > 0 ? positionsValue / totalPositions : 0
  const portfolioDiversification = totalPositions > 0 ? Math.min(100, (activePositions / 10) * 100) : 0

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <PieChart className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="text-base font-medium">Portfolio Summary</h3>
          <p className="text-xs text-muted-foreground">Overview of your trading portfolio</p>
        </div>
      </div>

      {/* Main Portfolio Value */}
      <div className="mb-6 p-4 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Portfolio Value</div>
          <motion.div
            key={portfolioStats.value}
            initial={{ opacity: 0.7, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-bold tabular-nums mb-2"
          >
            {formatCurrency(totalValue)}
          </motion.div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "flex items-center justify-center gap-2 text-sm font-medium",
              portfolioStats.change >= 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {portfolioStats.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{formatCurrency(portfolioStats.change)} ({formatPercent(portfolioStats.changePercent)})</span>
          </motion.div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Asset Allocation</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Active Positions</span>
              <span className="text-sm font-medium">{positionsPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${positionsPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-blue-500 h-2 rounded-full"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{formatCurrency(positionsValue)}</div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Available Cash</span>
              <span className="text-sm font-medium">{cashPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cashPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{formatCurrency(cashValue)}</div>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="p-3 bg-muted/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-muted-foreground">Active Positions</span>
          </div>
          <div className="text-lg font-bold">{activePositions}</div>
          <div className="text-xs text-muted-foreground">of {totalPositions} total</div>
        </div>

        <div className="p-3 bg-muted/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-3 w-3 text-purple-500" />
            <span className="text-xs text-muted-foreground">Avg Position</span>
          </div>
          <div className="text-lg font-bold">{formatCurrency(avgPositionSize)}</div>
          <div className="text-xs text-muted-foreground">per position</div>
        </div>

        <div className="p-3 bg-muted/10 rounded-lg col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-3 w-3 text-green-500" />
            <span className="text-xs text-muted-foreground">Diversification Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold">{portfolioDiversification.toFixed(0)}%</div>
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${portfolioDiversification}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className={cn(
                  "h-1.5 rounded-full",
                  portfolioDiversification > 70 ? "bg-green-500" :
                  portfolioDiversification > 40 ? "bg-yellow-500" : "bg-red-500"
                )}
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {portfolioDiversification > 70 ? "Well diversified" :
             portfolioDiversification > 40 ? "Moderately diversified" : "Consider diversifying"}
          </div>
        </div>
      </div>
    </div>
  )
}
