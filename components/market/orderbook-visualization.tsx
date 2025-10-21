"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { BookOpen, TrendingUp, TrendingDown } from "lucide-react"

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

interface OrderBookData {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  midPrice: number
}

export function OrderbookVisualization() {
  const [isClient, setIsClient] = useState(false)
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null)
  const [selectedMarket, setSelectedMarket] = useState("Will Trump win 2024?")

  useEffect(() => {
    setIsClient(true)
    
    const generateOrderBook = (): OrderBookData => {
      const midPrice = 0.45 + Math.random() * 0.1 // Between 0.45 and 0.55
      const spread = 0.02 + Math.random() * 0.03 // Between 0.02 and 0.05
      
      const bids: OrderBookEntry[] = []
      const asks: OrderBookEntry[] = []
      
      let totalBidSize = 0
      let totalAskSize = 0
      
      // Generate bids (below mid price)
      for (let i = 0; i < 8; i++) {
        const price = midPrice - spread/2 - (i * 0.01)
        const size = Math.floor(Math.random() * 500) + 100
        totalBidSize += size
        bids.push({
          price: Math.max(0.01, price),
          size,
          total: totalBidSize
        })
      }
      
      // Generate asks (above mid price)
      for (let i = 0; i < 8; i++) {
        const price = midPrice + spread/2 + (i * 0.01)
        const size = Math.floor(Math.random() * 500) + 100
        totalAskSize += size
        asks.push({
          price: Math.min(0.99, price),
          size,
          total: totalAskSize
        })
      }
      
      return {
        bids,
        asks,
        spread,
        midPrice
      }
    }

    setOrderBook(generateOrderBook())
    
    // Update every 2 seconds
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook())
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  if (!isClient || !orderBook) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Order Book</h3>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading order book...
        </div>
      </div>
    )
  }

  const maxBidTotal = Math.max(...orderBook.bids.map(b => b.total))
  const maxAskTotal = Math.max(...orderBook.asks.map(a => a.total))
  const maxTotal = Math.max(maxBidTotal, maxAskTotal)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Order Book</h3>
          <p className="text-xs text-muted-foreground">{selectedMarket}</p>
        </div>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Market Info */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Mid Price</div>
          <div className="text-sm font-semibold">{orderBook.midPrice.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Spread</div>
          <div className="text-sm font-semibold">{(orderBook.spread * 100).toFixed(2)}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="text-sm font-semibold">{(maxBidTotal + maxAskTotal).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">BIDS</span>
          </div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-1">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>
            {orderBook.bids.slice(0, 6).map((bid, index) => (
              <div key={index} className="relative">
                <div
                  className="absolute inset-0 bg-green-500/10 rounded"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <div className="relative grid grid-cols-3 gap-2 text-xs py-1 px-2">
                  <span className="font-mono text-green-600">{bid.price.toFixed(3)}</span>
                  <span className="text-right font-mono">{bid.size.toLocaleString()}</span>
                  <span className="text-right font-mono text-muted-foreground">{bid.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-600">ASKS</span>
          </div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-1">
              <span>Price</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>
            {orderBook.asks.slice(0, 6).map((ask, index) => (
              <div key={index} className="relative">
                <div
                  className="absolute inset-0 bg-red-500/10 rounded"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <div className="relative grid grid-cols-3 gap-2 text-xs py-1 px-2">
                  <span className="font-mono text-red-600">{ask.price.toFixed(3)}</span>
                  <span className="text-right font-mono">{ask.size.toLocaleString()}</span>
                  <span className="text-right font-mono text-muted-foreground">{ask.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Depth Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Bid Depth: {maxBidTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Ask Depth: {maxAskTotal.toLocaleString()}</span>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
