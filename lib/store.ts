"use client"

import { create } from "zustand"
import type { PortfolioStats, Position, TrendingMarket } from "./types"
import { generatePortfolioStats, generatePositions, generateTrendingMarkets, updateValue } from "./mock-data"

interface DashboardState {
  portfolioStats: PortfolioStats
  currentPositions: PortfolioStats
  availableCash: PortfolioStats
  positions: Position[]
  trendingMarkets: TrendingMarket[]
  lastUpdate: number
  isInitialized: boolean
  initializeData: () => void
  updateData: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  portfolioStats: {
    value: 24546.61,
    change: 0,
    changePercent: 0,
  },
  currentPositions: {
    value: 18006.26,
    change: -23.45,
    changePercent: -0.13,
  },
  availableCash: {
    value: 6459.77,
    change: -18.12,
    changePercent: -0.28,
  },
  positions: [],
  trendingMarkets: [],
  lastUpdate: Date.now(),
  isInitialized: false,

  initializeData: () => {
    const state = get()
    if (state.isInitialized) return

    set({
      portfolioStats: generatePortfolioStats(),
      positions: generatePositions(),
      trendingMarkets: generateTrendingMarkets(),
      isInitialized: true,
    })
  },

  updateData: () => {
    const state = get()

    // Update portfolio stats with small variations
    const newPortfolioValue = updateValue(state.portfolioStats.value, 0.0005)
    const portfolioChange = newPortfolioValue - 24546.61
    const portfolioChangePercent = (portfolioChange / 24546.61) * 100

    const newPositionsValue = updateValue(state.currentPositions.value, 0.0008)
    const positionsChange = newPositionsValue - 18006.26
    const positionsChangePercent = (positionsChange / 18006.26) * 100

    const newCashValue = updateValue(state.availableCash.value, 0.0003)
    const cashChange = newCashValue - 6459.77
    const cashChangePercent = (cashChange / 6459.77) * 100

    // Update positions
    const updatedPositions = state.positions.map((pos) => {
      const newPrice = updateValue(pos.currentPrice, 0.002)
      const clampedPrice = Math.max(0.01, Math.min(0.99, newPrice))
      const newValue = pos.shares * clampedPrice
      const change = (clampedPrice - pos.avgPrice) * pos.shares
      const changePercent = ((clampedPrice - pos.avgPrice) / pos.avgPrice) * 100

      return {
        ...pos,
        currentPrice: clampedPrice,
        currentValue: newValue,
        change,
        changePercent,
      }
    })

    // Update trending markets
    const updatedMarkets = state.trendingMarkets.map((market) => {
      const newYesPrice = updateValue(market.yesPrice, 0.003)
      const clampedYesPrice = Math.max(0.01, Math.min(0.99, newYesPrice))

      return {
        ...market,
        yesPrice: clampedYesPrice,
        noPrice: 1 - clampedYesPrice,
      }
    })

    set({
      portfolioStats: {
        value: newPortfolioValue,
        change: portfolioChange,
        changePercent: portfolioChangePercent,
      },
      currentPositions: {
        value: newPositionsValue,
        change: positionsChange,
        changePercent: positionsChangePercent,
      },
      availableCash: {
        value: newCashValue,
        change: cashChange,
        changePercent: cashChangePercent,
      },
      positions: updatedPositions,
      trendingMarkets: updatedMarkets,
      lastUpdate: Date.now(),
    })
  },
}))
