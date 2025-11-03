"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Calendar, TrendingUp, Clock } from "lucide-react"
import { useMarketContext } from "@/lib/market-context"

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
  const { selectedMarket } = useMarketContext()
  const [isClient, setIsClient] = useState(false)
  const [marketData, setMarketData] = useState<MarketOverview | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    const generateMarketData = (): MarketOverview => {
      const now = Date.now()
      
      // Market-specific configuration based on selected market
      const getMarketConfig = () => {
        const marketTitle = selectedMarket.title.toLowerCase()
        
        if (marketTitle.includes('trump') || marketTitle.includes('election') || marketTitle.includes('president')) {
          return {
            resolutionDate: new Date("2024-11-05T23:59:59.000Z"),
            startProb: 58 + Math.random() * 8, // 58-66%
            startSecondary: 42 + Math.random() * 8, // 42-50%
            startTertiary: 35 + Math.random() * 8, // 35-43%
            labels: {
              main: "Trump Win Probability",
              secondary: "Electoral College Margin", 
              tertiary: "Popular Vote Margin"
            },
            trend: 'volatile' // More volatile for political markets
          }
        } else if (marketTitle.includes('fed') || marketTitle.includes('rate') || marketTitle.includes('interest')) {
          return {
            resolutionDate: new Date("2024-12-18T23:59:59.000Z"),
            startProb: 72 + Math.random() * 6, // 72-78%
            startSecondary: 25 + Math.random() * 10, // 25-35%
            startTertiary: 15 + Math.random() * 10, // 15-25%
            labels: {
              main: "Rate Cut Probability",
              secondary: "50bps Cut Chance",
              tertiary: "75bps Cut Chance"
            },
            trend: 'stable' // More stable for economic indicators
          }
        } else if (marketTitle.includes('inflation') || marketTitle.includes('cpi')) {
          return {
            resolutionDate: new Date("2024-12-11T23:59:59.000Z"),
            startProb: 45 + Math.random() * 10, // 45-55%
            startSecondary: 65 + Math.random() * 8, // 65-73%
            startTertiary: 28 + Math.random() * 12, // 28-40%
            labels: {
              main: "Above Target Probability",
              secondary: "Core CPI > 3.2%",
              tertiary: "Headline CPI > 2.8%"
            },
            trend: 'trending' // Gradual trends for inflation
          }
        } else {
          // Default configuration for other markets
          return {
            resolutionDate: new Date(now + (Math.random() * 90 + 30) * 24 * 60 * 60 * 1000), // 30-120 days
            startProb: 50 + Math.random() * 20, // 50-70%
            startSecondary: 40 + Math.random() * 20, // 40-60%
            startTertiary: 30 + Math.random() * 20, // 30-50%
            labels: {
              main: "Primary Outcome",
              secondary: "Secondary Factor",
              tertiary: "Tertiary Factor"
            },
            trend: 'moderate'
          }
        }
      }
      
      const config = getMarketConfig()
      const daysRemaining = Math.ceil((config.resolutionDate.getTime() - now) / (1000 * 60 * 60 * 24))
      
      // Generate price data for the last 30 days
      const priceData: MarketData[] = []
      let probability = config.startProb
      let secondary = config.startSecondary
      let tertiary = config.startTertiary
      
      for (let i = 30; i >= 0; i--) {
        const timestamp = now - (i * 24 * 60 * 60 * 1000)
        
        // Apply market-specific movement patterns
        let probChange, secChange, tertChange
        
        switch (config.trend) {
          case 'volatile':
            probChange = (Math.random() - 0.5) * 6 // ±3%
            secChange = (Math.random() - 0.5) * 5 // ±2.5%
            tertChange = (Math.random() - 0.5) * 4 // ±2%
            break
          case 'stable':
            probChange = (Math.random() - 0.5) * 2 // ±1%
            secChange = (Math.random() - 0.5) * 2 // ±1%
            tertChange = (Math.random() - 0.5) * 2 // ±1%
            break
          case 'trending':
            // Add slight upward/downward bias
            const bias = i > 15 ? 0.2 : -0.2 // Trend change mid-period
            probChange = (Math.random() - 0.5) * 3 + bias
            secChange = (Math.random() - 0.5) * 3 + bias * 0.8
            tertChange = (Math.random() - 0.5) * 3 + bias * 0.6
            break
          default:
            probChange = (Math.random() - 0.5) * 4
            secChange = (Math.random() - 0.5) * 3
            tertChange = (Math.random() - 0.5) * 3
        }
        
        probability += probChange
        secondary += secChange
        tertiary += tertChange
        
        // Keep within reasonable bounds
        probability = Math.max(15, Math.min(85, probability))
        secondary = Math.max(10, Math.min(80, secondary))
        tertiary = Math.max(5, Math.min(75, tertiary))
        
        priceData.push({
          timestamp,
          probability,
          tariffInflation: secondary,
          quantitativeTightening: tertiary
        })
      }
      
      const currentData = priceData[priceData.length - 1]
      
      return {
        title: selectedMarket.title,
        description: selectedMarket.description,
        resolutionDate: config.resolutionDate,
        daysRemaining: Math.max(0, daysRemaining),
        totalVolume: selectedMarket.volume,
        roi: 0.8 + Math.random() * 1.2, // Random ROI between 0.8 and 2.0
        probabilities: {
          main: { 
            label: config.labels.main, 
            value: Math.round(currentData.probability), 
            color: "#10b981" 
          },
          secondary: { 
            label: config.labels.secondary, 
            value: Math.round(currentData.tariffInflation), 
            color: "#3b82f6" 
          },
          tertiary: { 
            label: config.labels.tertiary, 
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
  }, [selectedMarket])

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
        <div className={`w-16 h-16 bg-gradient-to-br ${selectedMarket.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-xl">{selectedMarket.icon}</span>
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
      <div className="flex-1 min-h-[200px] min-w-[300px] mb-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={300}>
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
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
                fontSize: "12px",
                color: "#111827",
                zIndex: 1000
              }}
              wrapperStyle={{ zIndex: 1000 }}
              formatter={(value: any, name: any) => {
                if (name === "probability") return [`${Math.round(value)}%`, marketData.probabilities.main.label]
                if (name === "tariffInflation") return [`${Math.round(value)}%`, marketData.probabilities.secondary.label]
                if (name === "quantitativeTightening") return [`${Math.round(value)}%`, marketData.probabilities.tertiary.label]
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
