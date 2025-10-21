"use client"

import { useState, useEffect, useRef } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useDashboardStore } from "@/lib/store"
import { formatCurrency, cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

type Timeframe = "1D" | "1W" | "1M" | "YTD"

function generateTimeRangeData(timeframe: Timeframe, baseValue: number) {
  const now = Date.now()
  let startTime: number
  let points: number

  switch (timeframe) {
    case "1D":
      startTime = now - 24 * 60 * 60 * 1000 // 24 hours ago
      points = 50
      break
    case "1W":
      startTime = now - 7 * 24 * 60 * 60 * 1000 // 7 days ago
      points = 70
      break
    case "1M":
      startTime = now - 30 * 24 * 60 * 60 * 1000 // 30 days ago
      points = 90
      break
    case "YTD":
      // Start from January 1st of current year
      const currentYear = new Date(now).getFullYear()
      startTime = new Date(currentYear, 0, 1).getTime()
      points = 120
      break
    default:
      startTime = now - 24 * 60 * 60 * 1000
      points = 50
  }

  const interval = (now - startTime) / points
  let value = baseValue

  return Array.from({ length: points }, (_, i) => {
    value += (Math.random() - 0.48) * 200
    return {
      timestamp: startTime + i * interval,
      value: Math.max(value, baseValue * 0.8),
    }
  })
}

export function PortfolioChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D")
  const portfolioValue = useDashboardStore((state) => state.portfolioStats.value)
  const [chartData, setChartData] = useState<Array<{ timestamp: number; value: number }>>([])
  const lastUpdateRef = useRef<number>(Date.now())

  useEffect(() => {
    const initialData = generateTimeRangeData(timeframe, portfolioValue)
    setChartData(initialData)
    lastUpdateRef.current = Date.now()
  }, [timeframe])

  useEffect(() => {
    if (chartData.length === 0) return

    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateRef.current

    // Only add new point if enough time has passed (5 seconds)
    if (timeSinceLastUpdate >= 5000) {
      setChartData((prev) => {
        const newPoint = {
          timestamp: now,
          value: portfolioValue,
        }
        // Keep the same number of points by removing the oldest
        const maxPoints = timeframe === "1D" ? 50 : timeframe === "1W" ? 70 : timeframe === "1M" ? 90 : 120
        const updated = [...prev, newPoint]
        return updated.length > maxPoints ? updated.slice(1) : updated
      })
      lastUpdateRef.current = now
    }
  }, [portfolioValue, timeframe, chartData.length])

  const getCustomTicks = () => {
    if (chartData.length === 0) return []

    const ticks: number[] = []
    const firstTimestamp = chartData[0].timestamp
    const lastTimestamp = chartData[chartData.length - 1].timestamp

    // Define time intervals for each timeframe to ensure unique labels
    let interval: number
    let numTicks: number

    switch (timeframe) {
      case "1D":
        // Show every 4 hours for 1 day
        interval = 4 * 60 * 60 * 1000 // 4 hours in ms
        numTicks = 6
        break
      case "1W":
        // Show every day for 1 week
        interval = 24 * 60 * 60 * 1000 // 1 day in ms
        numTicks = 7
        break
      case "1M":
        // Show every 4 days for 1 month
        interval = 4 * 24 * 60 * 60 * 1000 // 4 days in ms
        numTicks = 8
        break
      case "YTD":
        // Calculate interval based on total time span
        const totalSpan = lastTimestamp - firstTimestamp
        interval = totalSpan / 10 // Divide into 10 segments
        numTicks = 10
        break
      default:
        interval = 60 * 60 * 1000
        numTicks = 6
    }

    // Find the closest data point for each target timestamp
    for (let i = 0; i < numTicks; i++) {
      const targetTime = firstTimestamp + i * interval

      // Find the data point closest to this target time
      let closestIndex = 0
      let minDiff = Math.abs(chartData[0].timestamp - targetTime)

      for (let j = 1; j < chartData.length; j++) {
        const diff = Math.abs(chartData[j].timestamp - targetTime)
        if (diff < minDiff) {
          minDiff = diff
          closestIndex = j
        }
      }

      const timestamp = chartData[closestIndex].timestamp
      // Only add if not already in ticks (avoid duplicates)
      if (!ticks.includes(timestamp)) {
        ticks.push(timestamp)
      }
    }

    // Always include the last point if not already included
    if (!ticks.includes(lastTimestamp)) {
      ticks.push(lastTimestamp)
    }

    return ticks.sort((a, b) => a - b)
  }

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp)
    switch (timeframe) {
      case "1D":
        return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
      case "1W":
        return date.toLocaleDateString("en-US", { weekday: "short" })
      case "1M":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "YTD":
        return date.toLocaleDateString("en-US", { month: "short" })
      default:
        return ""
    }
  }

  const currentValue = portfolioValue
  const startValue = chartData.length > 0 ? chartData[0]?.value || 0 : 0
  const change = currentValue - startValue
  const changePercent = startValue !== 0 && isFinite(startValue) ? (change / startValue) * 100 : 0
  const isPositive = change >= 0

  const timeframes: Timeframe[] = ["1D", "1W", "1M", "YTD"]

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 flex flex-col h-full">
        <h3 className="text-sm font-semibold mb-4">Portfolio Performance</h3>
        <div className="flex-1 min-h-[200px] flex items-center justify-center text-muted-foreground">No data available</div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Portfolio Performance</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold tabular-nums">{formatCurrency(currentValue)}</span>
            <span
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                isPositive ? "text-emerald-600" : "text-red-600",
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {formatCurrency(change)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors",
                timeframe === tf ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              ticks={getCustomTicks()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={["dataMin - 100", "dataMax + 100"]}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Portfolio Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
