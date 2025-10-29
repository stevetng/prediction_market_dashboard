"use client"

import { useState, useEffect } from "react"
import { InsiderView } from "./insider-view"
import { CategoryPerformance } from "./category-performance"
import { BrierScore } from "./brier-score"
import { CalibrationCurve } from "./calibration-curve"
import { DraggableWidget } from "../draggable-widget"

export function ForecasterView() {
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
  const availableWidth = isClient ? viewportWidth - 64 : 1440 // Increased to fill remaining gap
  
  const insiderWidth = isClient ? Math.floor(availableWidth * 0.32) : 461 // 32% of 1440px
  const categoryWidth = isClient ? Math.floor(availableWidth * 0.66) : 995 // Further increased to eliminate gap completely
  const categoryX = isClient ? insiderWidth + 16 : 477 // insider width + gap
  
  const bottomWidth = isClient ? Math.floor((availableWidth - 16) * 0.5) : 712 // Half of available minus gap
  const bottomRightX = isClient ? bottomWidth + 16 : 728 // bottom width + gap

  return (
    <div className="relative min-h-[800px]">
      <DraggableWidget
        widgetId="insider-view"
        viewId="forecaster"
        defaultWidth={461}
        defaultHeight={320}
        initialX={0}
        initialY={0}
        responsiveWidth={isClient ? insiderWidth : undefined}
      >
        <InsiderView />
      </DraggableWidget>

      <DraggableWidget
        widgetId="category-performance"
        viewId="forecaster"
        defaultWidth={995}
        defaultHeight={320}
        initialX={477}
        initialY={0}
        responsiveWidth={isClient ? categoryWidth : undefined}
        responsiveX={isClient ? categoryX : undefined}
      >
        <CategoryPerformance />
      </DraggableWidget>

      <DraggableWidget
        widgetId="brier-score"
        viewId="forecaster"
        defaultWidth={712}
        defaultHeight={380}
        initialX={0}
        initialY={340}
        responsiveWidth={isClient ? bottomWidth : undefined}
      >
        <BrierScore />
      </DraggableWidget>

      <DraggableWidget
        widgetId="calibration-curve"
        viewId="forecaster"
        defaultWidth={712}
        defaultHeight={380}
        initialX={728}
        initialY={340}
        responsiveWidth={isClient ? bottomWidth : undefined}
        responsiveX={isClient ? bottomRightX : undefined}
      >
        <CalibrationCurve />
      </DraggableWidget>
    </div>
  )
}
