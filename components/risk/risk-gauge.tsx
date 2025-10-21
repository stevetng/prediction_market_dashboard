"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react"

interface RiskMetric {
  label: string
  value: number
  maxValue: number
  color: string
  status: "low" | "medium" | "high"
  description: string
}

export function RiskGauge() {
  const [isClient, setIsClient] = useState(false)
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([])
  const [overallRisk, setOverallRisk] = useState(0)

  useEffect(() => {
    setIsClient(true)
    
    const generateRiskMetrics = (): RiskMetric[] => {
      const volatility = Math.random() * 100
      const concentration = Math.random() * 100
      const leverage = Math.random() * 100
      const liquidity = Math.random() * 100

      return [
        {
          label: "Volatility Risk",
          value: volatility,
          maxValue: 100,
          color: volatility > 70 ? "#ef4444" : volatility > 40 ? "#f59e0b" : "#10b981",
          status: volatility > 70 ? "high" : volatility > 40 ? "medium" : "low",
          description: "Price movement uncertainty"
        },
        {
          label: "Concentration Risk",
          value: concentration,
          maxValue: 100,
          color: concentration > 60 ? "#ef4444" : concentration > 30 ? "#f59e0b" : "#10b981",
          status: concentration > 60 ? "high" : concentration > 30 ? "medium" : "low",
          description: "Portfolio diversification level"
        },
        {
          label: "Leverage Risk",
          value: leverage,
          maxValue: 100,
          color: leverage > 80 ? "#ef4444" : leverage > 50 ? "#f59e0b" : "#10b981",
          status: leverage > 80 ? "high" : leverage > 50 ? "medium" : "low",
          description: "Exposure relative to capital"
        },
        {
          label: "Liquidity Risk",
          value: liquidity,
          maxValue: 100,
          color: liquidity > 75 ? "#ef4444" : liquidity > 45 ? "#f59e0b" : "#10b981",
          status: liquidity > 75 ? "high" : liquidity > 45 ? "medium" : "low",
          description: "Ability to exit positions quickly"
        }
      ]
    }

    const metrics = generateRiskMetrics()
    setRiskMetrics(metrics)
    
    // Calculate overall risk score (weighted average)
    const weights = [0.3, 0.25, 0.25, 0.2] // volatility, concentration, leverage, liquidity
    const overall = metrics.reduce((sum, metric, index) => sum + (metric.value * weights[index]), 0)
    setOverallRisk(overall)
  }, [])

  const getOverallRiskStatus = (risk: number) => {
    if (risk > 65) return { status: "High Risk", color: "#ef4444", icon: AlertTriangle }
    if (risk > 35) return { status: "Medium Risk", color: "#f59e0b", icon: Activity }
    return { status: "Low Risk", color: "#10b981", icon: Shield }
  }

  const getRiskIcon = (status: string) => {
    switch (status) {
      case "high": return <AlertTriangle className="h-4 w-4" />
      case "medium": return <Activity className="h-4 w-4" />
      case "low": return <Shield className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Portfolio Risk Gauge</h3>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading risk metrics...
        </div>
      </div>
    )
  }

  const overallStatus = getOverallRiskStatus(overallRisk)
  const OverallIcon = overallStatus.icon

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Portfolio Risk Gauge</h3>
          <p className="text-xs text-muted-foreground">Real-time risk assessment</p>
        </div>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Overall Risk Score */}
      <div className="mb-6 p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <OverallIcon className="h-5 w-5" style={{ color: overallStatus.color }} />
            <span className="font-semibold" style={{ color: overallStatus.color }}>
              {overallStatus.status}
            </span>
          </div>
          <span className="text-2xl font-bold" style={{ color: overallStatus.color }}>
            {overallRisk.toFixed(0)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${overallRisk}%`,
              backgroundColor: overallStatus.color,
              opacity: 0.8
            }}
          />
        </div>
      </div>

      {/* Individual Risk Metrics */}
      <div className="space-y-4">
        {riskMetrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ color: metric.color }}>
                  {getRiskIcon(metric.status)}
                </div>
                <div>
                  <span className="text-sm font-medium">{metric.label}</span>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold" style={{ color: metric.color }}>
                  {metric.value.toFixed(0)}%
                </span>
                <p className="text-xs text-muted-foreground capitalize">{metric.status}</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(metric.value / metric.maxValue) * 100}%`,
                  backgroundColor: metric.color,
                  opacity: 0.7
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Risk Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">High Risk Areas:</span>
            <span className="ml-1 font-medium text-red-600">
              {riskMetrics.filter(m => m.status === "high").length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Low Risk Areas:</span>
            <span className="ml-1 font-medium text-green-600">
              {riskMetrics.filter(m => m.status === "low").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
