"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { generateCalibrationData } from "@/lib/mock-data"
import { TrendingUp } from "lucide-react"

export function CalibrationCurve() {
  const data = useMemo(() => {
    return generateCalibrationData()
  }, [])

  const chartData = useMemo(() => {
    return data.map((d) => ({
      predicted: d.predicted,
      actual: d.actual,
      perfect: d.predicted,
      count: d.count,
    }))
  }, [data])

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-4">Calibration Curve</h3>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Calibration Curve</h3>
          <p className="text-xs text-muted-foreground">Predicted vs. Actual Outcomes</p>
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
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
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any, name: any, props: any) => {
                const data = props.payload
                return [
                  <div key="content" className="space-y-1">
                    <div>Predicted: {data.predicted}%</div>
                    <div>Actual: {data.actual?.toFixed(1)}%</div>
                    {data.count && <div>Samples: {data.count}</div>}
                  </div>,
                  "",
                ]
              }}
            />
            <Line
              type="linear"
              dataKey="perfect"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Perfect Calibration"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#3b82f6", stroke: "#3b82f6", strokeWidth: 2 }}
              name="Your Calibration"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-muted" style={{ borderTop: "1px dashed #64748b" }} />
          <span className="text-xs text-muted-foreground">Perfect Calibration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-primary" />
          <span className="text-xs text-muted-foreground">Your Calibration</span>
        </div>
      </div>
    </div>
  )
}
