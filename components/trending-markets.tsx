"use client"

import { useRef } from "react"
import { useDashboardStore } from "@/lib/store"
import { formatPrice, cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export function TrendingMarkets() {
  const trendingMarkets = useDashboardStore((state) => state.trendingMarkets)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6 py-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Trending Markets</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => scroll("left")} className="p-1 hover:bg-accent rounded transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-1 hover:bg-accent rounded transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 px-6 pb-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {trendingMarkets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: index * 0.02 }}
            className="flex-shrink-0 w-64 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-sm font-medium mb-1 line-clamp-2">{market.name}</div>
                <div className="text-xs text-muted-foreground">{market.category}</div>
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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">YES</div>
                <motion.div
                  key={market.yesPrice}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-semibold text-success"
                >
                  {formatPrice(market.yesPrice)}
                </motion.div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-0.5">NO</div>
                <motion.div
                  key={market.noPrice}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-semibold text-destructive"
                >
                  {formatPrice(market.noPrice)}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
