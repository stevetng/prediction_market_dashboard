"use client"

import { useState, useEffect } from "react"
import { OrderbookVisualization } from "./orderbook-visualization"
import { RecentTrades } from "./recent-trades"
import { MarketOverview } from "./market-overview"
import { MarketDetails } from "./market-details"
import { MarketSelector } from "./market-selector"
import { DraggableWidget } from "../draggable-widget"
import { MarketProvider } from "@/lib/market-context"

export function MarketInvestigationView() {
  const [isClient, setIsClient] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1400)

  useEffect(() => {
    // Delay setting isClient to avoid hydration mismatch
    const timer = setTimeout(() => {
      setIsClient(true)
      setViewportWidth(window.innerWidth)
    }, 0)

    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Use static dimensions during SSR, responsive after hydration
  // Account for padding (32px on each side = 64px total)
  const availableWidth = isClient ? viewportWidth - 64 : 1408 // MacBook Air optimized to match other tabs
  const widgetWidth = isClient ? Math.floor((availableWidth - 16) * 0.5) : 696 // Half of 1408px minus gap
  const rightColumnX = isClient ? widgetWidth + 16 : 712 // widget width + gap

  return (
    <MarketProvider>
      {/* Market Selector - Outside widgets container */}
      <div className="mb-6 flex justify-center relative z-50">
        <MarketSelector />
      </div>
      
      <div className="relative min-h-[800px]">
      {/* Market Overview - Top Left */}
      <DraggableWidget
        defaultWidth={696}
        defaultHeight={360}
        initialX={0}
        initialY={0}
        widgetId="market-overview"
        viewId="market-investigation"
        responsiveWidth={isClient ? widgetWidth : undefined}
      >
        <MarketOverview />
      </DraggableWidget>

      {/* Order Book - Top Right */}
      <DraggableWidget
        defaultWidth={696}
        defaultHeight={360}
        initialX={712}
        initialY={0}
        widgetId="orderbook"
        viewId="market-investigation"
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? rightColumnX : undefined}
      >
        <OrderbookVisualization />
      </DraggableWidget>

      {/* Recent Trades - Bottom Left */}
      <DraggableWidget
        defaultWidth={696}
        defaultHeight={360}
        initialX={0}
        initialY={380}
        widgetId="recent-trades"
        viewId="market-investigation"
        responsiveWidth={isClient ? widgetWidth : undefined}
      >
        <RecentTrades />
      </DraggableWidget>

      {/* Market Details - Bottom Right */}
      <DraggableWidget
        defaultWidth={696}
        defaultHeight={360}
        initialX={712}
        initialY={380}
        widgetId="market-details"
        viewId="market-investigation"
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? rightColumnX : undefined}
      >
        <MarketDetails />
      </DraggableWidget>
      </div>
    </MarketProvider>
  )
}
