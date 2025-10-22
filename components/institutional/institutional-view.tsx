"use client"

import { useState, useEffect } from "react"
import { EventTimeline } from "./event-timeline"
import { PortfolioChart } from "./portfolio-chart"
import { PositionsTable } from "./positions-table"
import { PortfolioMetrics } from "./portfolio-metrics"
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
  const availableWidth = isClient ? viewportWidth - 64 : 1336
  
  const chartWidth = isClient ? Math.floor(availableWidth * 0.6) : 800 // Reduced from 70% to 60%
  const metricsWidth = isClient ? availableWidth - chartWidth - 16 : 520 // Fill remaining space
  const metricsX = isClient ? chartWidth + 16 : 816
  
  const bottomWidth = isClient ? Math.floor((availableWidth - 16) * 0.5) : 640
  const bottomRightX = isClient ? bottomWidth + 16 : 660

  return (
    <div className="relative min-h-[800px]">
      {/* Top left - Portfolio Chart */}
      <DraggableWidget
        widgetId="portfolio-chart"
        viewId="institutional"
        defaultWidth={800}
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
        defaultWidth={520}
        defaultHeight={400}
        initialX={816}
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
        defaultWidth={640}
        defaultHeight={380}
        initialX={0}
        initialY={420}
        responsiveWidth={isClient ? bottomWidth : undefined}
      >
        <EventTimeline />
      </DraggableWidget>

      {/* Bottom right - Portfolio Metrics */}
      <DraggableWidget
        widgetId="portfolio-metrics"
        viewId="institutional"
        defaultWidth={640}
        defaultHeight={380}
        initialX={660}
        initialY={420}
        responsiveWidth={isClient ? bottomWidth : undefined}
        responsiveX={isClient ? bottomRightX : undefined}
      >
        <PortfolioMetrics />
      </DraggableWidget>
    </div>
  )
}
