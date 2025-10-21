"use client"

import { useState, useEffect } from "react"
import { formatCurrency, cn } from "@/lib/utils"
import { AlertTriangle, TrendingDown, Clock, Target } from "lucide-react"

interface RiskAlert {
  id: string
  type: "concentration" | "volatility" | "exposure" | "correlation"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  value: string
  change?: string
  timestamp: Date
}

export function RiskAlerts() {
  const [isClient, setIsClient] = useState(false)
  const [alerts, setAlerts] = useState<RiskAlert[]>([])

  useEffect(() => {
    setIsClient(true)
    
    const generateAlerts = (): RiskAlert[] => {
      const alertTypes = [
        {
          type: "concentration" as const,
          severity: "high" as const,
          title: "High Concentration Risk",
          description: "Politics exposure exceeds 40% of portfolio",
          value: "42.3%",
          change: "+5.2%",
        },
        {
          type: "volatility" as const,
          severity: "medium" as const,
          title: "Increased Volatility",
          description: "Sports markets showing unusual price swings",
          value: "±18.4%",
          change: "+12.1%",
        },
        {
          type: "exposure" as const,
          severity: "high" as const,
          title: "Large Position Alert",
          description: "Single position represents >15% of portfolio",
          value: formatCurrency(3847),
          change: "+8.3%",
        },
        {
          type: "correlation" as const,
          severity: "medium" as const,
          title: "High Correlation Risk",
          description: "Tech and Economics positions highly correlated",
          value: "0.87",
          change: "+0.12",
        },
        {
          type: "exposure" as const,
          severity: "low" as const,
          title: "Approaching Limit",
          description: "Climate exposure nearing risk threshold",
          value: "28.7%",
          change: "+2.1%",
        },
      ]

      return alertTypes.map((alert, index) => ({
        id: `alert-${index}`,
        ...alert,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      }))
    }

    setAlerts(generateAlerts())
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "concentration":
        return <Target className="h-4 w-4" />
      case "volatility":
        return <TrendingDown className="h-4 w-4" />
      case "exposure":
        return <AlertTriangle className="h-4 w-4" />
      case "correlation":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date(Date.now())
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Risk Alerts</h3>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Loading alerts...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Risk Alerts</h3>
          <p className="text-xs text-muted-foreground">Active risk monitoring</p>
        </div>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-3 max-h-[320px] overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent/50",
              getSeverityColor(alert.severity)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getTypeIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-medium line-clamp-1">{alert.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {alert.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{alert.value}</span>
                  {alert.change && (
                    <span className={cn(
                      "text-xs font-medium",
                      alert.change.startsWith('+') ? "text-red-600" : "text-green-600"
                    )}>
                      {alert.change}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
