"use client"

import React, { createContext, useContext, useState } from "react"

interface Market {
  id: string
  title: string
  description: string
  category: string
  icon: string
  iconColor: string
  currentPrice: number
  volume: number
  traders: number
}

interface MarketContextType {
  selectedMarket: Market
  setSelectedMarket: (market: Market) => void
  availableMarkets: Market[]
}

const defaultMarkets: Market[] = [
  {
    id: "trump-2024",
    title: "Will Trump win the 2024 Presidential Election?",
    description: "This market will resolve to 'Yes' if Donald Trump wins the 2024 U.S. Presidential Election.",
    category: "Politics",
    icon: "DT",
    iconColor: "from-red-500 to-red-700",
    currentPrice: 0.67,
    volume: 2840000,
    traders: 1247
  },
  {
    id: "fed-rate-cut",
    title: "Will the Fed cut rates in December 2024?",
    description: "This market resolves to 'Yes' if the Federal Reserve cuts interest rates in December 2024.",
    category: "Economics",
    icon: "FED",
    iconColor: "from-blue-500 to-blue-700",
    currentPrice: 0.82,
    volume: 1560000,
    traders: 892
  },
  {
    id: "bitcoin-100k",
    title: "Will Bitcoin reach $100k by end of 2024?",
    description: "This market resolves to 'Yes' if Bitcoin reaches $100,000 USD by December 31, 2024.",
    category: "Crypto",
    icon: "₿",
    iconColor: "from-orange-500 to-orange-700",
    currentPrice: 0.45,
    volume: 3200000,
    traders: 2156
  },
  {
    id: "ai-breakthrough",
    title: "Will there be a major AI breakthrough in 2024?",
    description: "This market resolves to 'Yes' if a significant AI breakthrough is announced by a major tech company.",
    category: "Technology",
    icon: "AI",
    iconColor: "from-purple-500 to-purple-700",
    currentPrice: 0.73,
    volume: 980000,
    traders: 654
  },
  {
    id: "climate-target",
    title: "Will global emissions decrease by 5% in 2024?",
    description: "This market resolves to 'Yes' if global CO2 emissions decrease by at least 5% compared to 2023.",
    category: "Climate",
    icon: "🌍",
    iconColor: "from-green-500 to-green-700",
    currentPrice: 0.28,
    volume: 720000,
    traders: 445
  }
]

const MarketContext = createContext<MarketContextType | null>(null)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [selectedMarket, setSelectedMarket] = useState<Market>(defaultMarkets[0])

  return (
    <MarketContext.Provider value={{ 
      selectedMarket, 
      setSelectedMarket, 
      availableMarkets: defaultMarkets 
    }}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarketContext() {
  const context = useContext(MarketContext)
  if (!context) {
    throw new Error('useMarketContext must be used within a MarketProvider')
  }
  return context
}
