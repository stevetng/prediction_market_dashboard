"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store"
import { formatPrice, cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function TrendingMarketsTicker() {
  const trendingMarkets = useDashboardStore((state) => state.trendingMarkets)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate markets for seamless loop
  const markets = [...trendingMarkets, ...trendingMarkets]

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border overflow-hidden z-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-12 flex items-center">
        <motion.div
          className="flex gap-8 px-4"
          animate={isPaused ? {} : {
            x: [0, -50 * trendingMarkets.length],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {markets.map((market, index) => (
            <div key={`${market.id}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{market.category}</span>
                <span className="text-xs font-semibold">{market.name.slice(0, 40)}...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">YES</span>
                  <span className="text-xs font-semibold text-success">{formatPrice(market.yesPrice)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">NO</span>
                  <span className="text-xs font-semibold text-destructive">{formatPrice(market.noPrice)}</span>
                </div>
                <motion.div
                  key={market.change24h}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded",
                    market.change24h >= 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10",
                  )}
                >
                  {market.change24h >= 0 ? "+" : ""}
                  {market.change24h.toFixed(1)}%
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
