export interface PortfolioStats {
  value: number
  change: number
  changePercent: number
}

export interface Position {
  id: string
  marketName: string
  shares: number
  avgPrice: number
  currentPrice: number
  currentValue: number
  change: number
  changePercent: number
  side: "YES" | "NO"
  category: string
}

export interface TrendingMarket {
  id: string
  name: string
  category: string
  volume: number
  yesPrice: number
  noPrice: number
  change24h: number
}

export interface Event {
  id: string
  name: string
  category: string
  resolutionDate: Date
  exposure: number
  probability: number
}

export interface ChartDataPoint {
  timestamp: number
  value: number
}

export interface PerformanceData {
  timestamp: number
  value: number
  pnl: number
}

export interface RiskMetric {
  category: string
  exposure: number
  percentage: number
  color: string
}

export interface CalibrationPoint {
  predicted: number
  actual: number
  count: number
}

export interface CategoryPerformance {
  category: string
  winRate: number
  trades: number
  pnl: number
}

export type PersonaView = "example" | "institutional" | "risk" | "forecaster" | "market-investigation"
