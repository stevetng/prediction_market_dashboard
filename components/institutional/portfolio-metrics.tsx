"use client"

import { useDashboardStore } from "@/lib/store"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export function PortfolioMetrics() {
  const portfolioStats = useDashboardStore((state) => state.portfolioStats)
  const currentPositions = useDashboardStore((state) => state.currentPositions)
  const availableCash = useDashboardStore((state) => state.availableCash)

  const metrics = [
    {
      label: "Portfolio Value",
      value: portfolioStats.value,
      change: portfolioStats.change,
      changePercent: portfolioStats.changePercent,
    },
    {
      label: "Current Positions",
      value: currentPositions.value,
      change: currentPositions.change,
      changePercent: currentPositions.changePercent,
    },
    {
      label: "Available Cash",
      value: availableCash.value,
      change: availableCash.change,
      changePercent: availableCash.changePercent,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-200">
            <CardContent className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mb-1.5">
                    {metric.label}
                  </div>
                  <motion.div
                    key={metric.value}
                    initial={{ opacity: 0.6, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-xl font-semibold tabular-nums tracking-tight"
                  >
                    {formatCurrency(metric.value)}
                  </motion.div>
                </div>
                <motion.div
                  key={`${metric.change}-${metric.changePercent}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold tabular-nums px-2 py-1 rounded-md",
                    metric.change >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50",
                  )}
                >
                  {metric.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{formatPercent(metric.changePercent)}</span>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
