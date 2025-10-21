"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { Activity, Clock } from "lucide-react"

interface Trade {
  id: string
  timestamp: Date
  price: number
  size: number
  side: "buy" | "sell"
  value: number
}

export function RecentTrades() {
  const [isClient, setIsClient] = useState(false)
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    setIsClient(true)
    
    const generateTrade = (): Trade => {
      const price = 0.40 + Math.random() * 0.20 // Between 0.40 and 0.60
      const size = Math.floor(Math.random() * 200) + 10
      const side = Math.random() > 0.5 ? "buy" : "sell"
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        price,
        size,
        side,
        value: price * size
      }
    }

    // Initialize with some trades
    const initialTrades = Array.from({ length: 12 }, () => {
      const trade = generateTrade()
      trade.timestamp = new Date(Date.now() - Math.random() * 300000) // Last 5 minutes
      return trade
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    setTrades(initialTrades)
    
    // Add new trades every 3-8 seconds
    const interval = setInterval(() => {
      const newTrade = generateTrade()
      setTrades(prev => [newTrade, ...prev.slice(0, 19)]) // Keep last 20 trades
    }, 3000 + Math.random() * 5000)
    
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent Trades</h3>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading trades...
        </div>
      </div>
    )
  }

  const totalVolume = trades.reduce((sum, trade) => sum + trade.value, 0)
  const avgPrice = trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.price, 0) / trades.length : 0
  const buyTrades = trades.filter(t => t.side === "buy").length
  const sellTrades = trades.filter(t => t.side === "sell").length

  return (
    <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Recent Trades</h3>
          <p className="text-xs text-muted-foreground font-medium">Will Trump win the 2024 Presidential Election?</p>
          <p className="text-xs text-muted-foreground">Live trading activity</p>
        </div>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Trade Summary */}
      <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="text-sm font-semibold">{formatCurrency(totalVolume)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Avg Price</div>
          <div className="text-sm font-semibold">{avgPrice.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-green-600">Buys</div>
          <div className="text-sm font-semibold text-green-600">{buyTrades}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-red-600">Sells</div>
          <div className="text-sm font-semibold text-red-600">{sellTrades}</div>
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground mb-2 px-2">
          <span>Time</span>
          <span className="text-right">Price</span>
          <span className="text-right">Size</span>
          <span className="text-right">Value</span>
          <span className="text-center">Side</span>
        </div>
        
        {trades.map((trade, index) => (
          <div 
            key={trade.id} 
            className={`grid grid-cols-5 gap-2 text-xs py-2 px-2 rounded transition-all duration-500 ${
              index === 0 ? 'bg-blue-50 border border-blue-200' : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-mono text-xs">{formatTime(trade.timestamp)}</span>
              <span className="text-xs text-muted-foreground">{getTimeAgo(trade.timestamp)}</span>
            </div>
            <span className={`text-right font-mono font-semibold ${
              trade.side === "buy" ? "text-green-600" : "text-red-600"
            }`}>
              {trade.price.toFixed(3)}
            </span>
            <span className="text-right font-mono">{trade.size.toLocaleString()}</span>
            <span className="text-right font-mono">{formatCurrency(trade.value)}</span>
            <div className="text-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                trade.side === "buy" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {trade.side.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Indicator */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground">Live updates</span>
      </div>
    </div>
  )
}
