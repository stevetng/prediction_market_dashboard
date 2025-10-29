"use client"

import { useState, useEffect } from "react"
import { EventTimeline } from "./event-timeline"
import { PortfolioChart } from "./portfolio-chart"
import { PositionsTable } from "./positions-table"
import { TradingActivityMonitor } from "./trading-activity-monitor"
import { DraggableWidget } from "../draggable-widget"

export function InstitutionalView() {
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
  const availableWidth = isClient ? viewportWidth - 64 : 1408 // Increased to better match actual MacBook Air full-screen
  
  // Top row: 60% chart, remaining space for positions (minus gap)
  const chartWidth = isClient ? Math.max(600, Math.floor(availableWidth * 0.6)) : 845 // 60% of 1408px
  const metricsWidth = isClient ? Math.max(300, availableWidth - chartWidth - 16) : 547 // Fill remaining
  const metricsX = isClient ? chartWidth + 16 : 861 // chart width + gap
  
  // Bottom row: Use same proportions as top row for consistency
  const bottomLeftWidth = isClient ? chartWidth : 845 // Match chart width
  const bottomRightWidth = isClient ? metricsWidth : 547 // Match metrics width  
  const bottomRightX = isClient ? chartWidth + 16 : 861 // Match metrics X position

  return (
    <div className="relative min-h-[800px]">
      {/* Top left - Portfolio Chart */}
      <DraggableWidget
        widgetId="portfolio-chart"
        viewId="institutional"
        defaultWidth={845}
        defaultHeight={400}
        initialX={0}
        initialY={0}
        responsiveWidth={isClient ? chartWidth : undefined}
        responsiveX={isClient ? 0 : undefined}
      >
        <PortfolioChart />
      </DraggableWidget>

      {/* Top right - Open Positions */}
      <DraggableWidget
        widgetId="positions-table"
        viewId="institutional"
        defaultWidth={547}
        defaultHeight={400}
        initialX={861}
        initialY={0}
        responsiveWidth={isClient ? metricsWidth : undefined}
        responsiveX={isClient ? metricsX : undefined}
      >
        <PositionsTable />
      </DraggableWidget>

      {/* Bottom left - Event Timeline */}
      <DraggableWidget
        widgetId="event-timeline"
        viewId="institutional"
        defaultWidth={845}
        defaultHeight={380}
        initialX={0}
        initialY={420}
        responsiveWidth={isClient ? bottomLeftWidth : undefined}
      >
        <EventTimeline />
      </DraggableWidget>

      {/* Bottom right - Trading Activity Monitor */}
      <DraggableWidget
        widgetId="trading-activity-monitor"
        viewId="institutional"
        defaultWidth={547}
        defaultHeight={380}
        initialX={861}
        initialY={420}
        responsiveWidth={isClient ? bottomRightWidth : undefined}
        responsiveX={isClient ? bottomRightX : undefined}
      >
        <TradingActivityMonitor />
      </DraggableWidget>
    </div>
  )
}
