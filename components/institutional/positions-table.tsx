"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store"
import { formatCurrency, formatPrice, formatPercent, cn } from "@/lib/utils"
import { ArrowUpDown, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { motion } from "framer-motion"
import type { Position } from "@/lib/types"

export function PositionsTable() {
  const positions = useDashboardStore((state) => state.positions)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [showAll, setShowAll] = useState(false)
  const displayedPositions = showAll ? positions : positions.slice(0, 5)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Open Positions</h3>
      </div>
      <div className={cn("overflow-x-auto", showAll && "max-h-[400px] overflow-y-auto")}>
        <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground p-3">
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Market
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Side</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Shares</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Avg Price</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Current Price</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Current Value</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">P&L</th>
            </tr>
          </thead>
          <tbody>
            {displayedPositions.map((position, index) => (
              <motion.tr
                key={position.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                onClick={() => setSelectedPosition(position)}
                className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{position.marketName}</span>
                    <span className="text-xs text-muted-foreground">{position.category}</span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      position.side === "YES" ? "bg-emerald-600/10 text-emerald-600" : "bg-red-600/10 text-red-600",
                    )}
                  >
                    {position.side}
                  </span>
                </td>
                <td className="p-3 text-right text-sm tabular-nums">{position.shares}</td>
                <td className="p-3 text-right text-sm tabular-nums">{formatPrice(position.avgPrice)}</td>
                <td className="p-3 text-right text-sm tabular-nums">
                  <motion.span key={position.currentPrice} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }}>
                    {formatPrice(position.currentPrice)}
                  </motion.span>
                </td>
                <td className="p-3 text-right text-sm font-medium tabular-nums">
                  <motion.span key={position.currentValue} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }}>
                    {formatCurrency(position.currentValue)}
                  </motion.span>
                </td>
                <td className="p-3 text-right">
                  <motion.div
                    key={position.change}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center justify-end gap-1"
                  >
                    {position.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium tabular-nums",
                        position.change >= 0 ? "text-emerald-600" : "text-red-600",
                      )}
                    >
                      {formatCurrency(Math.abs(position.change))}
                    </span>
                    <span
                      className={cn("text-xs tabular-nums", position.change >= 0 ? "text-emerald-600" : "text-red-600")}
                    >
                      ({formatPercent(position.changePercent)})
                    </span>
                  </motion.div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {positions.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-3 border-t border-border hover:bg-accent/50"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show {positions.length - 5} More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
