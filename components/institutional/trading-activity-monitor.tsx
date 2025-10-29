"use client"

import { useState, useEffect } from "react"
import { Activity, TrendingUp, TrendingDown, Clock, Users, Zap, Target } from "lucide-react"
import { motion } from "framer-motion"
import { cn, formatCurrency } from "@/lib/utils"

interface ActivityMetric {
  label: string
  value: string
  change: number
  trend: "up" | "down" | "neutral"
  icon: any
  color: string
  description: string
}

interface RecentActivity {
  type: "buy" | "sell" | "resolve"
  market: string
  amount: number
  time: string
  profit?: number
}

export function TradingActivityMonitor() {
  const [isClient, setIsClient] = useState(false)
  const [metrics, setMetrics] = useState<ActivityMetric[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    setIsClient(true)
    
    // Generate trading activity metrics
    const activityMetrics: ActivityMetric[] = [
      {
        label: "Active Trades",
        value: Math.floor(Math.random() * 15 + 5).toString(),
        change: (Math.random() - 0.5) * 20,
        trend: Math.random() > 0.5 ? "up" : "down",
        icon: Activity,
        color: "text-blue-500",
        description: "Currently open positions"
      },
      {
        label: "Today's P&L",
        value: formatCurrency((Math.random() - 0.5) * 1000),
        change: (Math.random() - 0.5) * 15,
        trend: Math.random() > 0.5 ? "up" : "down",
        icon: TrendingUp,
        color: "text-green-500",
        description: "Profit/Loss for today"
      },
      {
        label: "Win Rate",
        value: (Math.random() * 30 + 60).toFixed(1) + "%",
        change: (Math.random() - 0.5) * 10,
        trend: Math.random() > 0.5 ? "up" : "down",
        icon: Target,
        color: "text-purple-500",
        description: "Success rate this week"
      },
      {
        label: "Avg Hold Time",
        value: Math.floor(Math.random() * 48 + 12) + "h",
        change: (Math.random() - 0.5) * 25,
        trend: Math.random() > 0.5 ? "up" : "down",
        icon: Clock,
        color: "text-orange-500",
        description: "Average position duration"
      }
    ]

    // Generate recent activity
    const activities: RecentActivity[] = [
      {
        type: "buy",
        market: "Trump 2024 Election",
        amount: Math.floor(Math.random() * 500 + 100),
        time: "2m ago"
      },
      {
        type: "sell",
        market: "Fed Rate Cut Dec",
        amount: Math.floor(Math.random() * 300 + 50),
        time: "5m ago",
        profit: Math.floor((Math.random() - 0.5) * 100)
      },
      {
        type: "resolve",
        market: "Inflation CPI Oct",
        amount: Math.floor(Math.random() * 400 + 200),
        time: "12m ago",
        profit: Math.floor(Math.random() * 150 + 50)
      },
      {
        type: "buy",
        market: "Bitcoin $100k EOY",
        amount: Math.floor(Math.random() * 600 + 150),
        time: "18m ago"
      }
    ]

    setMetrics(activityMetrics)
    setRecentActivity(activities)
  }, [])

  if (!isClient) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Trading Activity</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Loading activity...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="text-base font-medium">Trading Activity</h3>
          <p className="text-xs text-muted-foreground">Real-time trading insights</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.change >= 0
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-muted/20 rounded-lg p-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("h-4 w-4", metric.color)} />
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
                    isPositive 
                      ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30" 
                      : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5" />
                  )}
                  {Math.abs(metric.change).toFixed(1)}%
                </motion.div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-medium">
                  {metric.label}
                </div>
                <motion.div
                  key={metric.value}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-lg font-bold tabular-nums"
                >
                  {metric.value}
                </motion.div>
                <div className="text-xs text-muted-foreground opacity-75">
                  {metric.description}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity Feed */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Recent Activity</span>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between p-2 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.type === "buy" ? "bg-blue-500" :
                  activity.type === "sell" ? "bg-orange-500" : "bg-green-500"
                )} />
                <div>
                  <div className="text-sm font-medium">
                    {activity.type === "buy" ? "Bought" : 
                     activity.type === "sell" ? "Sold" : "Resolved"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.market}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium tabular-nums">
                  {formatCurrency(activity.amount)}
                </div>
                {activity.profit !== undefined && (
                  <div className={cn(
                    "text-xs font-medium tabular-nums",
                    activity.profit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {activity.profit >= 0 ? "+" : ""}{formatCurrency(activity.profit)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
