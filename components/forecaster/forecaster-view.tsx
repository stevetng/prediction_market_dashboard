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
  const availableWidth = isClient ? viewportWidth - 64 : 1336
  
  const insiderWidth = isClient ? Math.floor(availableWidth * 0.32) : 420
  const categoryWidth = isClient ? Math.floor(availableWidth * 0.66) : 860
  const categoryX = isClient ? insiderWidth + 16 : 440
  
  const bottomWidth = isClient ? Math.floor((availableWidth - 16) * 0.5) : 640
  const bottomRightX = isClient ? bottomWidth + 16 : 660

  return (
    <div className="relative min-h-[800px]">
      <DraggableWidget
        widgetId="insider-view"
        viewId="forecaster"
        defaultWidth={420}
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
        defaultWidth={860}
        defaultHeight={320}
        initialX={440}
        initialY={0}
        responsiveWidth={isClient ? categoryWidth : undefined}
        responsiveX={isClient ? categoryX : undefined}
      >
        <CategoryPerformance />
      </DraggableWidget>

      <DraggableWidget
        widgetId="brier-score"
        viewId="forecaster"
        defaultWidth={640}
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
        defaultWidth={640}
        defaultHeight={380}
        initialX={660}
        initialY={340}
        responsiveWidth={isClient ? bottomWidth : undefined}
        responsiveX={isClient ? bottomRightX : undefined}
      >
        <CalibrationCurve />
      </DraggableWidget>
    </div>
  )
}
