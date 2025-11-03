"use client"

import { useState, useEffect } from "react"
import { RiskAlertsMonitor } from "./risk-alerts-monitor"
import { RiskGauge } from "./risk-gauge"
import { RiskTreemap } from "./risk-treemap"
import { ExposureBreakdown } from "./exposure-breakdown"
import { DraggableWidget } from "../draggable-widget"

export function RiskView() {
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
  const widgetWidth = isClient ? Math.floor((availableWidth - 16) * 0.5) : 640
  const rightColumnX = isClient ? widgetWidth + 16 : 660

  return (
    <div className="relative min-h-[800px]">
      <DraggableWidget
        defaultWidth={640}
        defaultHeight={380}
        initialX={0}
        initialY={0}
        widgetId="risk-alerts-monitor"
        viewId="risk"
        responsiveWidth={isClient ? widgetWidth : undefined}
      >
        <RiskAlertsMonitor />
      </DraggableWidget>

      <DraggableWidget
        defaultWidth={640}
        defaultHeight={380}
        initialX={660}
        initialY={0}
        widgetId="exposure-breakdown"
        viewId="risk"
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? rightColumnX : undefined}
      >
        <ExposureBreakdown />
      </DraggableWidget>

      <DraggableWidget
        defaultWidth={640}
        defaultHeight={380}
        initialX={0}
        initialY={400}
        widgetId="risk-gauge"
        viewId="risk"
        responsiveWidth={isClient ? widgetWidth : undefined}
      >
        <RiskGauge />
      </DraggableWidget>

      <DraggableWidget
        defaultWidth={640}
        defaultHeight={380}
        initialX={660}
        initialY={400}
        widgetId="risk-treemap"
        viewId="risk"
        responsiveWidth={isClient ? widgetWidth : undefined}
        responsiveX={isClient ? rightColumnX : undefined}
      >
        <RiskTreemap />
      </DraggableWidget>
    </div>
  )
}
