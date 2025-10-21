"use client"

import { useState, useEffect } from "react"
import { generateRiskMetrics } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

export function RiskHeatmap() {
  const [isClient, setIsClient] = useState(false)
  const [riskMetrics, setRiskMetrics] = useState<any[]>([])
  const [maxExposure, setMaxExposure] = useState(0)

  useEffect(() => {
    setIsClient(true)
    const metrics = generateRiskMetrics()
    setRiskMetrics(metrics)
    setMaxExposure(Math.max(...metrics.map((m) => m.exposure)))
  }, [])

  if (!isClient || riskMetrics.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Risk Heatmap by Category</h3>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
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
        <h3 className="text-sm font-semibold">Risk Heatmap by Category</h3>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {riskMetrics.map((metric) => {
          const intensity = (metric.exposure / maxExposure) * 100
          return (
            <div key={metric.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{metric.percentage}%</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(metric.exposure)}</span>
                </div>
              </div>
              <div className="relative h-8 rounded overflow-hidden bg-background">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500"
                  style={{
                    width: `${metric.percentage}%`,
                    backgroundColor: metric.color,
                    opacity: 0.2 + (intensity / 100) * 0.6,
                  }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-medium" style={{ color: metric.color }}>
                    {metric.percentage}% exposure
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
