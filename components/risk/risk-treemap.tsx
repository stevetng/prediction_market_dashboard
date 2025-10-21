"use client"

import { useState, useEffect, useMemo } from "react"
import { generateRiskMetrics } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { LayoutGrid } from "lucide-react"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]

export function RiskTreemap() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    const metrics = generateRiskMetrics()
    setData(metrics.map((metric, index) => ({
      name: metric.category,
      size: metric.exposure,
      percentage: metric.percentage,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    })))
  }, [])

  const layout = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.size, 0)
    const width = 100
    const height = 100

    if (total === 0 || !isFinite(total) || data.length === 0) {
      return []
    }

    // Sort by size descending for better visual hierarchy
    const sortedData = [...data].sort((a, b) => b.size - a.size)

    const boxes: Array<{ x: number; y: number; width: number; height: number; data: (typeof data)[0] }> = []

    // Use squarified treemap algorithm for more compact, grid-like layout
    let currentX = 0
    let currentY = 0
    let remainingWidth = width
    let remainingHeight = height
    let remainingTotal = total

    sortedData.forEach((item, index) => {
      const itemRatio = item.size / remainingTotal
      const area = itemRatio * (remainingWidth * remainingHeight)

      // Calculate dimensions based on remaining space
      const isWiderThanTall = remainingWidth > remainingHeight

      let boxWidth: number
      let boxHeight: number

      if (isWiderThanTall) {
        // Fill vertically first
        boxWidth = Math.min(area / remainingHeight, remainingWidth)
        boxHeight = remainingHeight
      } else {
        // Fill horizontally first
        boxHeight = Math.min(area / remainingWidth, remainingHeight)
        boxWidth = remainingWidth
      }

      // Ensure valid dimensions
      if (!isFinite(boxWidth) || !isFinite(boxHeight) || boxWidth <= 0 || boxHeight <= 0) {
        return
      }

      boxes.push({
        x: currentX,
        y: currentY,
        width: boxWidth,
        height: boxHeight,
        data: item,
      })

      // Update position for next box
      if (isWiderThanTall) {
        currentX += boxWidth
        remainingWidth -= boxWidth
      } else {
        currentY += boxHeight
        remainingHeight -= boxHeight
      }

      remainingTotal -= item.size
    })

    return boxes
  }, [data])

  if (!isClient || layout.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Risk Concentration Tree Map</h3>
            <p className="text-xs text-muted-foreground">Portfolio exposure by event type</p>
          </div>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          {!isClient ? "Loading..." : "No data available"}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Risk Concentration Tree Map</h3>
          <p className="text-xs text-muted-foreground">Portfolio exposure by event type</p>
        </div>
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="h-[300px] relative bg-muted/20 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {layout.map((box, index) => (
            <g key={index}>
              <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill={box.data.fill}
                stroke="#ffffff"
                strokeWidth="0.3"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
              {box.width > 8 && box.height > 6 && (
                <>
                  <text
                    x={box.x + box.width / 2}
                    y={box.y + box.height / 2 - 2}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="3.2"
                    fontWeight="600"
                  >
                    {box.data.name}
                  </text>
                  <text
                    x={box.x + box.width / 2}
                    y={box.y + box.height / 2 + 1.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="3.8"
                    fontWeight="700"
                  >
                    {formatCurrency(box.data.size)}
                  </text>
                  <text
                    x={box.x + box.width / 2}
                    y={box.y + box.height / 2 + 4.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="2.8"
                    opacity="0.9"
                  >
                    {box.data.percentage}%
                  </text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
