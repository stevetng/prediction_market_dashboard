"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Activity } from "lucide-react"

export function BrierScore() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState<Array<{ timestamp: number; score: number }>>([])
  
  useEffect(() => {
    setIsClient(true)
    const now = Date.now()
    const points = 30
    const interval = (30 * 24 * 60 * 60 * 1000) / points
    let score = 0.18

    const generatedData = Array.from({ length: points }, (_, i) => {
      score += (Math.random() - 0.52) * 0.01
      score = Math.max(0.1, Math.min(0.3, score))
      return {
        timestamp: now - (points - i) * interval,
        score: score,
      }
    })
    setData(generatedData)
  }, [])

  const currentScore = data.length > 0 ? data[data.length - 1]?.score || 0 : 0
  const avgScore = data.length > 0 ? data.reduce((sum, d) => sum + d.score, 0) / data.length : 0

  if (!isClient || data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
        <h3 className="text-sm font-semibold mb-4">Brier Score Dashboard</h3>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {!isClient ? "Loading..." : "No data available"}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Brier Score Dashboard</h3>
          <p className="text-xs text-muted-foreground">Lower is better (0 = perfect)</p>
        </div>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current Score</div>
          <div className="text-2xl font-bold text-emerald-600">{currentScore.toFixed(3)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">30-Day Average</div>
          <div className="text-2xl font-bold">{avgScore.toFixed(3)}</div>
        </div>
      </div>
      <div className="flex-1 min-h-[150px] min-w-[250px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={250}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              domain={[0, 0.5]}
              tickFormatter={(value) => value.toFixed(2)}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: "hsl(var(--foreground))"
              }}
              formatter={(value: any) => [(value as number).toFixed(3), "Brier Score"]}
              labelFormatter={(timestamp) => {
                const date = new Date(timestamp)
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
