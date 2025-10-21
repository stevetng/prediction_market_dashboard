"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, Calendar } from "lucide-react"

interface PricePoint {
  timestamp: number
  price: number
  volume: number
}

export function PriceChart() {
  const [isClient, setIsClient] = useState(false)
  const [priceData, setPriceData] = useState<PricePoint[]>([])
  const [timeframe, setTimeframe] = useState<"1H" | "4H" | "1D" | "1W">("1H")

  useEffect(() => {
    setIsClient(true)
    
    const generatePriceData = (timeframe: string): PricePoint[] => {
      const now = Date.now()
      let points: number
      let interval: number
      
      switch (timeframe) {
        case "1H":
          points = 60
          interval = 60 * 1000 // 1 minute intervals
          break
        case "4H":
          points = 48
          interval = 5 * 60 * 1000 // 5 minute intervals
          break
        case "1D":
          points = 96
          interval = 15 * 60 * 1000 // 15 minute intervals
          break
        case "1W":
          points = 168
          interval = 60 * 60 * 1000 // 1 hour intervals
          break
        default:
          points = 60
          interval = 60 * 1000
      }
      
      let price = 0.45 + Math.random() * 0.1 // Start between 0.45 and 0.55
      
      return Array.from({ length: points }, (_, i) => {
        // Add some realistic price movement
        const change = (Math.random() - 0.5) * 0.02 // ±1% change
        price = Math.max(0.01, Math.min(0.99, price + change))
        
        return {
          timestamp: now - (points - i) * interval,
          price,
          volume: Math.floor(Math.random() * 1000) + 100
        }
      })
    }

    setPriceData(generatePriceData(timeframe))
    
    // Update every 30 seconds for live data
    const interval = setInterval(() => {
      setPriceData(prev => {
        const newPoint: PricePoint = {
          timestamp: Date.now(),
          price: Math.max(0.01, Math.min(0.99, prev[prev.length - 1].price + (Math.random() - 0.5) * 0.01)),
          volume: Math.floor(Math.random() * 1000) + 100
        }
        return [...prev.slice(1), newPoint]
      })
    }, 30000)
    
    return () => clearInterval(interval)
  }, [timeframe])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    if (timeframe === "1H") {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (timeframe === "4H" || timeframe === "1D") {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (!isClient || priceData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Price Chart</h3>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading price data...
        </div>
      </div>
    )
  }

  const currentPrice = priceData[priceData.length - 1]?.price || 0
  const startPrice = priceData[0]?.price || 0
  const priceChange = currentPrice - startPrice
  const priceChangePercent = startPrice > 0 ? (priceChange / startPrice) * 100 : 0
  const isPositive = priceChange >= 0

  const maxPrice = Math.max(...priceData.map(p => p.price))
  const minPrice = Math.min(...priceData.map(p => p.price))
  const totalVolume = priceData.reduce((sum, p) => sum + p.volume, 0)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Price Chart</h3>
          <p className="text-xs text-muted-foreground">Will Trump win 2024?</p>
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-2xl font-bold">{currentPrice.toFixed(3)}</div>
          <div className={`text-sm font-medium flex items-center gap-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}>
            <span>{isPositive ? "+" : ""}{priceChange.toFixed(3)}</span>
            <span>({isPositive ? "+" : ""}{priceChangePercent.toFixed(2)}%)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">24h Range</div>
          <div className="text-sm font-medium">
            {minPrice.toFixed(3)} - {maxPrice.toFixed(3)}
          </div>
          <div className="text-xs text-muted-foreground">
            Volume: {totalVolume.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-1 mb-4">
        {(["1H", "4H", "1D", "1W"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              timeframe === tf
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <YAxis
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
              tickFormatter={(value) => value.toFixed(3)}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any, name: any, props: any) => {
                const data = props.payload
                return [
                  <div key="content" className="space-y-1">
                    <div className="font-semibold">Price: {data.price.toFixed(3)}</div>
                    <div>Volume: {data.volume.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(data.timestamp).toLocaleString()}
                    </div>
                  </div>,
                  "",
                ]
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: isPositive ? "#10b981" : "#ef4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Live Indicator */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live prices</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
