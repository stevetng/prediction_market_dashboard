"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"

interface CalibrationData {
  predicted: number
  actual: number
  count: number
}

export function CalibrationCurveYes() {
  const [isClient, setIsClient] = useState(false)
  const [chartData, setChartData] = useState<CalibrationData[]>([])

  useEffect(() => {
    setIsClient(true)
    
    // Generate calibration data for YES bets
    const data: CalibrationData[] = []
    for (let predicted = 10; predicted <= 90; predicted += 10) {
      // YES bets tend to be slightly overconfident at higher probabilities
      const variance = Math.random() * 8 - 4 // ±4% variance
      const overconfidenceBias = predicted > 60 ? (predicted - 60) * 0.1 : 0 // Slight overconfidence bias
      const actual = Math.max(0, Math.min(100, predicted + variance - overconfidenceBias))
      
      data.push({
        predicted,
        actual,
        count: Math.floor(Math.random() * 50) + 20 // 20-70 samples
      })
    }
    
    setChartData(data)
  }, [])

  if (!isClient || chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Calibration Curve - YES Bets</h3>
            <p className="text-xs text-muted-foreground">Predicted vs. Actual Outcomes</p>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Calibration Curve - YES Bets</h3>
          <p className="text-xs text-muted-foreground">Predicted vs. Actual Outcomes</p>
        </div>
        <TrendingUp className="h-4 w-4 text-green-600" />
      </div>
      <div className="h-[200px] min-w-[250px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <XAxis
              dataKey="predicted"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              label={{
                value: "Predicted Probability",
                position: "insideBottom",
                offset: -10,
                fontSize: 11,
                fill: "#6b7280",
              }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              label={{ value: "Actual Outcome", angle: -90, position: "insideLeft", fontSize: 11, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
                color: "#111827",
                zIndex: 1000
              }}
              wrapperStyle={{ zIndex: 1000 }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null
                const data = payload[0]?.payload
                if (!data) return null
                
                return (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg">
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-green-700">YES Bet Calibration</div>
                      <div>Predicted: {data.predicted}%</div>
                      <div>Actual: {data.actual?.toFixed(1)}%</div>
                      {data.count && <div>Samples: {data.count}</div>}
                    </div>
                  </div>
                )
              }}
            />
            {/* Perfect calibration line */}
            <Line
              type="linear"
              dataKey="predicted"
              stroke="#d1d5db"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Perfect Calibration"
            />
            {/* Actual calibration line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
              name="YES Bets"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
