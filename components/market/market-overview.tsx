"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Calendar, TrendingUp, Clock } from "lucide-react"

interface MarketData {
  timestamp: number
  probability: number
  tariffInflation: number
  quantitativeTightening: number
}

interface MarketOverview {
  title: string
  description: string
  resolutionDate: Date
  daysRemaining: number
  totalVolume: number
  roi: number
  probabilities: {
    main: { label: string; value: number; color: string }
    secondary: { label: string; value: number; color: string }
    tertiary: { label: string; value: number; color: string }
  }
  priceData: MarketData[]
}

export function MarketOverview() {
  const [isClient, setIsClient] = useState(false)
  const [marketData, setMarketData] = useState<MarketOverview | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    const generateMarketData = (): MarketOverview => {
      const now = Date.now()
      const resolutionDate = new Date("2024-11-05T23:59:59.000Z")
      const daysRemaining = Math.ceil((resolutionDate.getTime() - now) / (1000 * 60 * 60 * 24))
      
      // Generate price data for the last 30 days
      const priceData: MarketData[] = []
      let probability = 55 + Math.random() * 10 // Start around 55-65%
      let tariffInflation = 40 + Math.random() * 10 // Start around 40-50%
      let quantitativeTightening = 35 + Math.random() * 10 // Start around 35-45%
      
      for (let i = 30; i >= 0; i--) {
        const timestamp = now - (i * 24 * 60 * 60 * 1000)
        
        // Add some realistic price movement
        probability += (Math.random() - 0.5) * 4
        tariffInflation += (Math.random() - 0.5) * 3
        quantitativeTightening += (Math.random() - 0.5) * 3
        
        // Keep within reasonable bounds
        probability = Math.max(20, Math.min(80, probability))
        tariffInflation = Math.max(20, Math.min(70, tariffInflation))
        quantitativeTightening = Math.max(20, Math.min(70, quantitativeTightening))
        
        priceData.push({
          timestamp,
          probability,
          tariffInflation,
          quantitativeTightening
        })
      }
      
      const currentData = priceData[priceData.length - 1]
      
      return {
        title: "Will Trump win the 2024 Presidential Election?",
        description: "This market will resolve to 'Yes' if Donald Trump wins the 2024 U.S. Presidential Election and becomes the 47th President of the United States.",
        resolutionDate,
        daysRemaining: Math.max(0, daysRemaining),
        totalVolume: 353014,
        roi: 1.42,
        probabilities: {
          main: { 
            label: "Probability", 
            value: Math.round(currentData.probability), 
            color: "#10b981" 
          },
          secondary: { 
            label: "Tariff Inflation", 
            value: Math.round(currentData.tariffInflation), 
            color: "#3b82f6" 
          },
          tertiary: { 
            label: "QT / Quantitative Tightening", 
            value: Math.round(currentData.quantitativeTightening), 
            color: "#1f2937" 
          }
        },
        priceData
      }
    }

    setMarketData(generateMarketData())
    
    // Update every 30 seconds
    const interval = setInterval(() => {
      setMarketData(generateMarketData())
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (!isClient || !marketData) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Market Overview</h3>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading market data...
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
      {/* Header with market image placeholder and title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">DT</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold leading-tight mb-2">{marketData.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Begins in {marketData.daysRemaining} days</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(marketData.resolutionDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">86</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-muted rounded">
              <Calendar className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Clock className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <TrendingUp className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <span className="text-lg">⊕</span>
            </button>
          </div>
        </div>
      </div>

      {/* Probability indicators */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: marketData.probabilities.main.color }}></div>
          <span className="text-sm font-medium">{marketData.probabilities.main.label}</span>
          <span className="text-sm font-bold">{marketData.probabilities.main.value}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: marketData.probabilities.secondary.color }}></div>
          <span className="text-sm font-medium">{marketData.probabilities.secondary.label}</span>
          <span className="text-sm font-bold">{marketData.probabilities.secondary.value}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: marketData.probabilities.tertiary.color }}></div>
          <span className="text-sm font-medium">{marketData.probabilities.tertiary.label}</span>
          <span className="text-sm font-bold">{marketData.probabilities.tertiary.value}%</span>
        </div>
      </div>

      {/* ROI Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          ROI +${marketData.roi.toFixed(2)}
        </span>
        <span className="ml-4 text-sm text-muted-foreground">80%</span>
      </div>

      {/* Price Chart */}
      <div className="flex-1 min-h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marketData.priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp)
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
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
                fontSize: "12px"
              }}
              formatter={(value: any, name: any) => {
                if (name === "probability") return [`${Math.round(value)}%`, "Probability"]
                if (name === "tariffInflation") return [`${Math.round(value)}%`, "Tariff Inflation"]
                if (name === "quantitativeTightening") return [`${Math.round(value)}%`, "QT / Quantitative Tightening"]
                return [value, name]
              }}
              labelFormatter={(timestamp) => {
                const date = new Date(timestamp)
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }}
            />
            <Line
              type="monotone"
              dataKey="probability"
              stroke={marketData.probabilities.main.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: marketData.probabilities.main.color }}
            />
            <Line
              type="monotone"
              dataKey="tariffInflation"
              stroke={marketData.probabilities.secondary.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: marketData.probabilities.secondary.color }}
            />
            <Line
              type="monotone"
              dataKey="quantitativeTightening"
              stroke={marketData.probabilities.tertiary.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: marketData.probabilities.tertiary.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume and timeframe controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          ${marketData.totalVolume.toLocaleString()} vol
        </div>
        <div className="flex gap-2">
          {['1D', '1W', '1M', 'ALL'].map((timeframe) => (
            <button
              key={timeframe}
              className={`px-2 py-1 text-xs rounded ${
                timeframe === 'ALL' 
                  ? 'bg-muted text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {timeframe}
            </button>
          ))}
          <button className="p-1 hover:bg-muted rounded">
            <span className="text-sm">≡</span>
          </button>
        </div>
      </div>
    </div>
  )
}
