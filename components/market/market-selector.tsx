"use client"

import { useState } from "react"
import { ChevronDown, Check, TrendingUp, Users, DollarSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMarketContext } from "@/lib/market-context"
import { formatCurrency, cn } from "@/lib/utils"

export function MarketSelector() {
  const { selectedMarket, setSelectedMarket, availableMarkets } = useMarketContext()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Selected Market Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors w-full min-w-[300px]"
      >
        <div 
          className={`w-10 h-10 bg-gradient-to-br ${selectedMarket.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-white font-bold text-sm">{selectedMarket.icon}</span>
        </div>
        
        <div className="flex-1 text-left">
          <div className="font-semibold text-sm truncate">{selectedMarket.title}</div>
          <div className="text-xs text-muted-foreground">{selectedMarket.category}</div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{(selectedMarket.currentPrice * 100).toFixed(0)}¢</span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 mb-1">
                Select Market to Analyze
              </div>
              
              {availableMarkets.map((market) => (
                <button
                  key={market.id}
                  onClick={() => {
                    setSelectedMarket(market)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div 
                    className={`w-8 h-8 bg-gradient-to-br ${market.iconColor} rounded-md flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-xs">{market.icon}</span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm truncate group-hover:text-foreground">
                      {market.title}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(market.volume)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {market.traders}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {(market.currentPrice * 100).toFixed(0)}¢
                      </span>
                    </div>
                  </div>
                  
                  {selectedMarket.id === market.id && (
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
