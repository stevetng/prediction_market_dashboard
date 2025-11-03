"use client"

import { useState, useEffect } from "react"
import { InsiderView } from "./insider-view"
import { CategoryPerformance } from "./category-performance"
import { BrierScore } from "./brier-score"
import { CalibrationCurveYes } from "./calibration-curve-yes"
import { CalibrationCurveNo } from "./calibration-curve-no"
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
  const availableWidth = isClient ? viewportWidth - 64 : 1408 // MacBook Air optimized
  
  // Top row: Insider view (30%) and Category Performance (68%)
  const insiderWidth = isClient ? Math.floor(availableWidth * 0.30) : 422 // 30% of 1408px
  const categoryWidth = isClient ? Math.floor(availableWidth * 0.68) : 958 // 68% of 1408px
  const categoryX = isClient ? insiderWidth + 16 : 438 // insider width + gap
  
  // Bottom row: 3 widgets - Brier Score, YES Calibration, NO Calibration
  const bottomWidth = isClient ? Math.floor((availableWidth - 32) / 3) : 459 // Three equal widgets with gaps
  const bottomMiddleX = isClient ? bottomWidth + 16 : 475 // first width + gap
  const bottomRightX = isClient ? (bottomWidth * 2) + 32 : 950 // two widths + two gaps

  return (
    <div className="relative min-h-[800px]">
      <DraggableWidget
        widgetId="insider-view"
        viewId="forecaster"
        defaultWidth={422}
        defaultHeight={280}
        initialX={0}
        initialY={0}
        responsiveWidth={isClient ? insiderWidth : undefined}
      >
        <InsiderView />
      </DraggableWidget>

      <DraggableWidget
        widgetId="category-performance"
        viewId="forecaster"
        defaultWidth={958}
        defaultHeight={280}
        initialX={438}
        initialY={0}
        responsiveWidth={isClient ? categoryWidth : undefined}
        responsiveX={isClient ? categoryX : undefined}
      >
        <CategoryPerformance />
      </DraggableWidget>

      <DraggableWidget
        widgetId="brier-score"
        viewId="forecaster"
        defaultWidth={459}
        defaultHeight={320}
        initialX={0}
        initialY={300}
        responsiveWidth={isClient ? bottomWidth : undefined}
      >
        <BrierScore />
      </DraggableWidget>

      <DraggableWidget
        widgetId="calibration-curve-yes"
        viewId="forecaster"
        defaultWidth={459}
        defaultHeight={320}
        initialX={475}
        initialY={300}
        responsiveWidth={isClient ? bottomWidth : undefined}
        responsiveX={isClient ? bottomMiddleX : undefined}
      >
        <CalibrationCurveYes />
      </DraggableWidget>

      <DraggableWidget
        widgetId="calibration-curve-no"
        viewId="forecaster"
        defaultWidth={459}
        defaultHeight={320}
        initialX={950}
        initialY={300}
        responsiveWidth={isClient ? bottomWidth : undefined}
        responsiveX={isClient ? bottomRightX : undefined}
      >
        <CalibrationCurveNo />
      </DraggableWidget>
    </div>
  )
}
