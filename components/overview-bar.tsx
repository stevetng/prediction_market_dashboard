"use client"

import { useDashboardStore } from "@/lib/store"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

export function OverviewBar() {
  const portfolioStats = useDashboardStore((state) => state.portfolioStats)
  const currentPositions = useDashboardStore((state) => state.currentPositions)
  const availableCash = useDashboardStore((state) => state.availableCash)

  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
            <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
            <div className="flex items-center gap-3">
              <motion.div
                key={portfolioStats.value}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-2xl font-semibold tabular-nums"
              >
                {formatCurrency(portfolioStats.value)}
              </motion.div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  portfolioStats.change >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {portfolioStats.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {formatPercent(portfolioStats.changePercent)}
              </motion.div>
            </div>
          </motion.div>

          <div className="h-12 w-px bg-border" />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.05 }}
          >
            <div className="text-sm text-muted-foreground mb-1">Current Positions</div>
            <div className="flex items-center gap-3">
              <motion.div
                key={currentPositions.value}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-2xl font-semibold tabular-nums"
              >
                {formatCurrency(currentPositions.value)}
              </motion.div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  currentPositions.change >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {currentPositions.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formatPercent(currentPositions.changePercent)}
              </motion.div>
            </div>
          </motion.div>

          <div className="h-12 w-px bg-border" />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.1 }}
          >
            <div className="text-sm text-muted-foreground mb-1">Available Cash</div>
            <div className="flex items-center gap-3">
              <motion.div
                key={availableCash.value}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-2xl font-semibold tabular-nums"
              >
                {formatCurrency(availableCash.value)}
              </motion.div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  availableCash.change >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {availableCash.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {formatPercent(availableCash.changePercent)}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            more
          </button>
        </div>
      </div>
    </div>
  )
}
