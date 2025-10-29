"use client"

import { useState, useEffect } from "react"
import { DraggableWidget } from "../draggable-widget"
import { PortfolioChart } from "../institutional/portfolio-chart"
import { CalibrationCurve } from "../forecaster/calibration-curve"
import { BrierScore } from "../forecaster/brier-score"
import { PositionsTable } from "../institutional/positions-table"

export function ExampleView() {
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
  const availableWidth = isClient ? viewportWidth - 64 : 1408 // MacBook Air optimized
  
  // Balanced 2x2 grid: Split everything equally (50%/50%)
  const widgetWidth = isClient ? Math.floor((availableWidth - 16) * 0.5) : 696 // 50% minus gap
  const rightColumnX = isClient ? widgetWidth + 16 : 712 // left width + gap

  return (
    <div className="relative min-h-[800px]">
      {/* Top left - Portfolio Performance */}
      <DraggableWidget
        widgetId="portfolio-performance"
        viewId="example"
        defaultWidth={696}
        defaultHeight={380}
        initialX={0}
        initialY={0}
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? 0 : undefined}
      >
        <PortfolioChart />
      </DraggableWidget>

      {/* Top right - Open Positions */}
      <DraggableWidget
        widgetId="open-positions"
        viewId="example"
        defaultWidth={696}
        defaultHeight={380}
        initialX={712}
        initialY={0}
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? rightColumnX : undefined}
      >
        <PositionsTable />
      </DraggableWidget>

      {/* Bottom left - Calibration Curve */}
      <DraggableWidget
        widgetId="calibration-curve"
        viewId="example"
        defaultWidth={696}
        defaultHeight={380}
        initialX={0}
        initialY={400}
        responsiveWidth={isClient ? widgetWidth : undefined}
      >
        <CalibrationCurve />
      </DraggableWidget>

      {/* Bottom right - Brier Score */}
      <DraggableWidget
        widgetId="brier-score"
        viewId="example"
        defaultWidth={696}
        defaultHeight={380}
        initialX={712}
        initialY={400}
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? rightColumnX : undefined}
      >
        <BrierScore />
      </DraggableWidget>
    </div>
  )
}
