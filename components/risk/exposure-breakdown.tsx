"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { generateRiskMetrics } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { PieChartIcon } from "lucide-react"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]

export function ExposureBreakdown() {
  const [isClient, setIsClient] = useState(false)
  const [riskMetrics, setRiskMetrics] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    setRiskMetrics(generateRiskMetrics())
  }, [])

  if (!isClient || riskMetrics.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Exposure Breakdown</h3>
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          {!isClient ? "Loading..." : "No data available"}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Exposure Breakdown</h3>
        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskMetrics}
              dataKey="exposure"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              label={false}
            >
              {riskMetrics.map((entry, index) => {
                const color = CHART_COLORS[index % CHART_COLORS.length]
                return <Cell key={`cell-${index}`} fill={color} stroke="#ffffff" strokeWidth={2} />
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any, name: any, props: any) => [
                `${formatCurrency(Number(value))} (${props.payload.percentage}%)`,
                props.payload.category,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 mt-4">
        {riskMetrics.map((metric, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length]
          return (
            <div key={metric.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{metric.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium tabular-nums">{formatCurrency(metric.exposure)}</span>
                <span className="text-muted-foreground">({metric.percentage}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
