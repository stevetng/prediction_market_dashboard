"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { generateRiskMetrics } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { PieChartIcon } from "lucide-react"

const CHART_COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777"]

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
      <div className="h-[200px] min-w-[200px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={200}>
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
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={color} 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    style={{ 
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      cursor: 'pointer'
                    }}
                  />
                )
              })}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null
                const data = payload[0]?.payload
                if (!data) return null
                
                const color = CHART_COLORS[riskMetrics.findIndex(m => m.category === data.category) % CHART_COLORS.length]
                
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-foreground">{data.category}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Exposure:</span>
                        <span className="font-bold text-foreground">{formatCurrency(data.exposure)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Percentage:</span>
                        <span className="font-bold text-foreground">{data.percentage}%</span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 mt-4">
        {riskMetrics.map((metric, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length]
          return (
            <div 
              key={metric.category} 
              className="flex items-center justify-between text-sm py-2 px-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 group-hover:scale-110 transition-transform" 
                  style={{ backgroundColor: color }} 
                />
                <span className="font-medium text-foreground group-hover:text-foreground/80">{metric.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold tabular-nums text-foreground">{formatCurrency(metric.exposure)}</span>
                <span 
                  className="font-medium text-white px-2 py-1 rounded-md group-hover:shadow-md transition-shadow"
                  style={{ backgroundColor: color }}
                >
                  {metric.percentage}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
