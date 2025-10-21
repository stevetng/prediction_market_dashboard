"use client"

import { useState, useEffect } from "react"
import { formatCurrency, cn } from "@/lib/utils"
import { Info, Calendar, Users, DollarSign, Clock, Target } from "lucide-react"

interface MarketInfo {
  title: string
  description: string
  category: string
  createdDate: Date
  resolutionDate: Date
  totalVolume: number
  totalTrades: number
  uniqueTraders: number
  openInterest: number
  liquidity: number
  status: "active" | "resolved" | "paused"
  resolutionCriteria: string
  tags: string[]
}

export function MarketDetails() {
  const [isClient, setIsClient] = useState(false)
  const [marketInfo, setMarketInfo] = useState<MarketInfo | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    const generateMarketInfo = (): MarketInfo => {
      const now = Date.now()
      const createdDate = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000) // Up to 30 days ago
      const resolutionDate = new Date(now + Math.random() * 60 * 24 * 60 * 60 * 1000) // Up to 60 days from now
      
      return {
        title: "Will Trump win the 2024 Presidential Election?",
        description: "This market will resolve to 'Yes' if Donald Trump wins the 2024 U.S. Presidential Election and becomes the 47th President of the United States. The market will resolve based on the official results certified by the Electoral College.",
        category: "Politics",
        createdDate,
        resolutionDate,
        totalVolume: Math.floor(Math.random() * 5000000) + 1000000, // $1M - $6M
        totalTrades: Math.floor(Math.random() * 50000) + 10000, // 10k - 60k trades
        uniqueTraders: Math.floor(Math.random() * 5000) + 1000, // 1k - 6k traders
        openInterest: Math.floor(Math.random() * 2000000) + 500000, // $500k - $2.5M
        liquidity: Math.random() * 0.3 + 0.7, // 70% - 100%
        status: "active",
        resolutionCriteria: "Market resolves to 'Yes' if Donald Trump is certified as the winner of the 2024 U.S. Presidential Election by the Electoral College. Market resolves to 'No' if any other candidate wins.",
        tags: ["Politics", "Presidential Election", "2024", "Trump", "High Volume"]
      }
    }

    setMarketInfo(generateMarketInfo())
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilResolution = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700"
      case "resolved": return "bg-blue-100 text-blue-700"
      case "paused": return "bg-yellow-100 text-yellow-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  if (!isClient || !marketInfo) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Market Details</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Loading market details...
        </div>
      </div>
    )
  }

  const daysUntilResolution = getDaysUntilResolution(marketInfo.resolutionDate)

  return (
    <div className="rounded-lg border border-border bg-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Info className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium">Market Details</h3>
      </div>

      <div className="flex-1 space-y-6">
        {/* Market Title */}
        <div>
          <h4 className="font-semibold text-lg leading-tight mb-2">{marketInfo.title}</h4>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(marketInfo.status)}`}>
            {marketInfo.status.toUpperCase()}
          </span>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Volume</div>
            <div className="text-xl font-bold">{formatCurrency(marketInfo.totalVolume)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Traders</div>
            <div className="text-xl font-bold">{marketInfo.uniqueTraders.toLocaleString()}</div>
          </div>
        </div>

        {/* Resolution Date */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Resolves {formatDate(marketInfo.resolutionDate)}</div>
              <div className={cn("text-xs", daysUntilResolution > 0 ? "text-muted-foreground" : "text-red-600")}>
                {daysUntilResolution > 0 ? `${daysUntilResolution} days remaining` : "Overdue"}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Trades</span>
            <span className="text-sm font-medium">{marketInfo.totalTrades.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Open Interest</span>
            <span className="text-sm font-medium">{formatCurrency(marketInfo.openInterest)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Category</span>
            <span className="text-sm font-medium">{marketInfo.category}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
