"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, TrendingUp, Target, DollarSign } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"

interface PositionDetail {
  market: string
  exposure: number
  percentage: number
  pnl: number
  status: "profit" | "loss"
}

interface ConcentrationRisk {
  totalExposure: number
  limit: number
  utilizationPercent: number
  status: "safe" | "warning" | "critical"
  largestPosition: number
  topPositions: PositionDetail[]
  diversificationScore: number
}

export function RiskAlertsMonitor() {
  const [isClient, setIsClient] = useState(false)
  const [riskData, setRiskData] = useState<ConcentrationRisk | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    const generateRiskData = (): ConcentrationRisk => {
      // Portfolio cash values - matching the dashboard store values
      const totalPortfolioCash = 31029.15 // Portfolio Value + Available Cash (24569.03 + 6459.73 + current positions value)
      const allocatedCash = 18006.26 // Current Positions value from dashboard
      
      const topPositions: PositionDetail[] = [
        {
          market: "Trump 2024 Election",
          exposure: 5620,
          percentage: 31.2,
          pnl: 1850,
          status: "profit"
        },
        {
          market: "Fed Rate Cut Dec",
          exposure: 4015,
          percentage: 22.3,
          pnl: -420,
          status: "loss"
        },
        {
          market: "Inflation > 3%",
          exposure: 2791,
          percentage: 15.5,
          pnl: 680,
          status: "profit"
        },
        {
          market: "Tech Earnings Beat",
          exposure: 2161,
          percentage: 12.0,
          pnl: -180,
          status: "loss"
        },
        {
          market: "Climate Bill Pass",
          exposure: 1405,
          percentage: 7.8,
          pnl: 95,
          status: "profit"
        },
        {
          market: "Sports Betting",
          exposure: 1089,
          percentage: 6.0,
          pnl: 245,
          status: "profit"
        },
        {
          market: "AI Regulation",
          exposure: 925,
          percentage: 5.1,
          pnl: -85,
          status: "loss"
        }
      ]

      const totalAllocated = topPositions.reduce((sum, pos) => sum + pos.exposure, 0)
      const utilizationPercent = (totalAllocated / totalPortfolioCash) * 100
      const largestPosition = Math.max(...topPositions.map(p => p.percentage))
      
      return {
        totalExposure: totalAllocated,
        limit: totalPortfolioCash,
        utilizationPercent,
        status: utilizationPercent > 85 ? "critical" : utilizationPercent > 70 ? "warning" : "safe",
        largestPosition,
        topPositions,
        diversificationScore: 100 - largestPosition // Simple diversification metric
      }
    }

    setRiskData(generateRiskData())
  }, [])

  const getStatusColor = (status: ConcentrationRisk['status']) => {
    switch (status) {
      case 'critical':
        return "bg-red-500"
      case 'warning':
        return "bg-orange-500"
      case 'safe':
        return "bg-green-500"
    }
  }

  const getStatusIcon = (status: ConcentrationRisk['status']) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <Target className="h-5 w-5 text-orange-500" />
      case 'safe':
        return <TrendingUp className="h-5 w-5 text-green-500" />
    }
  }

  if (!isClient || !riskData) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Position Concentration Risk</h3>
          <Target className="h-4 w-4 text-muted-foreground" />
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
          <h3 className="text-sm font-semibold mb-1">Position Concentration Risk</h3>
          <p className="text-xs text-muted-foreground">Portfolio exposure analysis</p>
        </div>
        {getStatusIcon(riskData.status)}
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Cash Allocated</div>
          <div className="text-lg font-bold">{formatCurrency(riskData.totalExposure)}</div>
          <div className="text-xs text-muted-foreground">of {formatCurrency(riskData.limit)} total cash</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Largest Position</div>
          <div className="text-lg font-bold">{riskData.largestPosition.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Diversification: {riskData.diversificationScore.toFixed(0)}%</div>
        </div>
      </div>

      {/* Risk Utilization Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Cash Utilization</span>
          <span className="text-sm font-semibold">{riskData.utilizationPercent.toFixed(1)}%</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", getStatusColor(riskData.status))}
            style={{ width: `${Math.min(riskData.utilizationPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Top Positions */}
      <div className="flex-1">
        <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Top Positions</h4>
        <div className="space-y-2 overflow-y-auto">
          {riskData.topPositions.map((position, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{position.market}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(position.exposure)} allocated • {position.percentage.toFixed(1)}%
                </div>
              </div>
              <div className="text-right ml-2">
                <div className={cn(
                  "text-sm font-semibold",
                  position.status === "profit" ? "text-green-600" : "text-red-600"
                )}>
                  {position.status === "profit" ? "+" : ""}{formatCurrency(position.pnl)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
