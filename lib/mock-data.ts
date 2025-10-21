import type {
  PortfolioStats,
  Position,
  TrendingMarket,
  Event,
  ChartDataPoint,
  RiskMetric,
  CalibrationPoint,
  CategoryPerformance,
} from "./types"

const CATEGORIES = ["Politics", "Economics", "Sports", "Technology", "Climate"]
const MARKET_NAMES = [
  "Will Biden win 2024?",
  "Fed rate cut in March?",
  "Lakers make playoffs?",
  "Apple hits $200?",
  "Record heat this summer?",
  "Trump indicted again?",
  "Recession by Q2?",
  "Warriors win championship?",
  "Tesla above $300?",
  "Hurricane season active?",
]

export function generatePortfolioStats(): PortfolioStats {
  const baseValue = 24546.61
  const variance = (Math.random() - 0.5) * 50
  const value = baseValue + variance
  const change = variance
  const changePercent = (change / baseValue) * 100

  return { value, change, changePercent }
}

export function generatePositions(count = 8): Position[] {
  return Array.from({ length: count }, (_, i) => {
    const shares = Math.floor(Math.random() * 500) + 50
    const avgPrice = Math.random() * 0.8 + 0.1
    const currentPrice = avgPrice + (Math.random() - 0.5) * 0.2
    const currentValue = shares * currentPrice
    const change = (currentPrice - avgPrice) * shares
    const changePercent = ((currentPrice - avgPrice) / avgPrice) * 100

    return {
      id: `pos-${i}`,
      marketName: MARKET_NAMES[i % MARKET_NAMES.length],
      shares,
      avgPrice,
      currentPrice: Math.max(0.01, Math.min(0.99, currentPrice)),
      currentValue,
      change,
      changePercent,
      side: Math.random() > 0.5 ? "YES" : "NO",
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    }
  })
}

export function generateTrendingMarkets(count = 10): TrendingMarket[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `market-${i}`,
    name: MARKET_NAMES[i % MARKET_NAMES.length],
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    volume: Math.floor(Math.random() * 1000000) + 100000,
    yesPrice: Math.random() * 0.6 + 0.2,
    noPrice: Math.random() * 0.6 + 0.2,
    change24h: (Math.random() - 0.5) * 20,
  }))
}

export function generateEvents(count = 6): Event[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i}`,
    name: MARKET_NAMES[i % MARKET_NAMES.length],
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    resolutionDate: new Date(now + Math.random() * 30 * 24 * 60 * 60 * 1000),
    exposure: Math.floor(Math.random() * 5000) + 500,
    probability: Math.random() * 0.6 + 0.2,
  }))
}

export function generateChartData(points = 50, baseValue = 24000): ChartDataPoint[] {
  const now = Date.now()
  const interval = (12 * 60 * 60 * 1000) / points
  let value = baseValue

  return Array.from({ length: points }, (_, i) => {
    value += (Math.random() - 0.48) * 200
    return {
      timestamp: now - (points - i) * interval,
      value: Math.max(value, baseValue * 0.8),
    }
  })
}

export function generateRiskMetrics(): RiskMetric[] {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]
  const total = 100
  let remaining = total

  return CATEGORIES.map((category, i) => {
    const isLast = i === CATEGORIES.length - 1
    const percentage = isLast ? remaining : Math.floor(Math.random() * (remaining / 2))
    remaining -= percentage
    const exposure = (percentage / 100) * 18000

    return {
      category,
      exposure,
      percentage,
      color: colors[i],
    }
  })
}

export function generateCalibrationData(): CalibrationPoint[] {
  return Array.from({ length: 10 }, (_, i) => {
    const predicted = (i + 1) * 10
    const actual = predicted + (Math.random() - 0.5) * 15
    return {
      predicted,
      actual: Math.max(0, Math.min(100, actual)),
      count: Math.floor(Math.random() * 50) + 10,
    }
  })
}

export function generateCategoryPerformance(): CategoryPerformance[] {
  return CATEGORIES.map((category) => ({
    category,
    winRate: Math.random() * 40 + 40,
    trades: Math.floor(Math.random() * 100) + 20,
    pnl: (Math.random() - 0.4) * 5000,
  }))
}

export function updateValue(current: number, volatility = 0.001): number {
  const change = (Math.random() - 0.48) * current * volatility
  return current + change
}
