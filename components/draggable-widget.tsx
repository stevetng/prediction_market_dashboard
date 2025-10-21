"use client"

import type React from "react"
import { type ReactNode, useState, useRef, useEffect } from "react"

interface DraggableWidgetProps {
  children: ReactNode
  defaultWidth?: number
  defaultHeight?: number
  minWidth?: number
  minHeight?: number
  initialX?: number
  initialY?: number
  widgetId: string
  viewId: string
  responsiveWidth?: number
  responsiveX?: number
}

const GRID_SIZE = 20 // Snap to 20px grid

const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE

export function DraggableWidget({
  children,
  defaultWidth = 400,
  defaultHeight = 300,
  minWidth = 200,
  minHeight = 150,
  initialX = 0,
  initialY = 0,
  widgetId,
  viewId,
  responsiveWidth,
  responsiveX,
}: DraggableWidgetProps) {
  const [scale, setScale] = useState(1)

  const getStorageKey = () => `widget-${viewId}-${widgetId}`

  const loadSavedLayout = () => {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(getStorageKey())
    return saved ? JSON.parse(saved) : null
  }

  const savedLayout = loadSavedLayout()

  const [position, setPosition] = useState({
    x: savedLayout?.x ?? initialX,
    y: savedLayout?.y ?? initialY,
  })
  const [size, setSize] = useState({
    width: savedLayout?.width ?? defaultWidth,
    height: savedLayout?.height ?? defaultHeight,
  })
  
  const [viewportWidth, setViewportWidth] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(800) // Default height to prevent boundary issues

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>("")
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const layout = { x: position.x, y: position.y, width: size.width, height: size.height }
    localStorage.setItem(getStorageKey(), JSON.stringify(layout))
  }, [position, size, widgetId, viewId])

  useEffect(() => {
    const handleResize = () => {
      const currentViewportWidth = window.innerWidth
      const currentViewportHeight = window.innerHeight
      setViewportWidth(currentViewportWidth)
      setViewportHeight(currentViewportHeight)
      
      if (currentViewportWidth < 768) {
        setScale(0.7) // Mobile
      } else if (currentViewportWidth < 1024) {
        setScale(0.85) // Tablet
      } else {
        setScale(1) // Desktop
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Update dimensions when responsive props change
  useEffect(() => {
    if (responsiveWidth !== undefined) {
      setSize(prev => ({ ...prev, width: responsiveWidth }))
    }
  }, [responsiveWidth])

  useEffect(() => {
    if (responsiveX !== undefined) {
      setPosition(prev => ({ ...prev, x: responsiveX }))
    }
  }, [responsiveX])

  const handleDragStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const rect = widgetRef.current?.getBoundingClientRect()

    if (!rect) return

    // Only allow dragging from the top 48px (Card header area)
    const relativeY = e.clientY - rect.top
    if (relativeY <= 48 && !target.closest(".resize-handle")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Prevent text selection during drag/resize
      if (isDragging || isResizing) {
        e.preventDefault()
      }
      if (isDragging) {
        const newX = snapToGrid(e.clientX - dragStart.x)
        const newY = snapToGrid(e.clientY - dragStart.y)
        
        setPosition({ 
          x: Math.max(0, newX), 
          y: Math.max(0, newY)
        })
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = position.x
        let newY = position.y

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(minWidth, resizeStart.width + deltaX)
        }
        if (resizeDirection.includes("w")) {
          const proposedWidth = Math.max(minWidth, resizeStart.width - deltaX)
          const actualDelta = proposedWidth - resizeStart.width
          newWidth = proposedWidth
          newX = position.x - actualDelta
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(minHeight, resizeStart.height + deltaY)
        }
        if (resizeDirection.includes("n")) {
          const proposedHeight = Math.max(minHeight, resizeStart.height - deltaY)
          const actualDelta = proposedHeight - resizeStart.height
          newHeight = proposedHeight
          newY = position.y - actualDelta
        }

        setSize({
          width: snapToGrid(newWidth),
          height: snapToGrid(newHeight),
        })
        
        // Update position for west and north resizing
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setPosition({
            x: Math.max(0, snapToGrid(newX)),
            y: Math.max(0, snapToGrid(newY)),
          })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection("")
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, minWidth, minHeight])

  return (
    <div
      ref={widgetRef}
      className={`absolute rounded-lg border border-border bg-card shadow-sm transition-transform ${
        isDragging || isResizing ? "select-none" : ""
      }`}
      style={{
        left: position.x + "px",
        top: position.y + "px",
        width: size.width + "px",
        height: size.height + "px",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: isDragging || isResizing ? "none" : "auto",
      }}
      onMouseDown={handleDragStart}
    >
      <div className="h-full overflow-auto">{children}</div>

      {/* Resize handles */}
      <div
        className="resize-handle absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
        onMouseDown={(e) => handleResizeStart(e, "ne")}
      />
      <div
        className="resize-handle absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
        onMouseDown={(e) => handleResizeStart(e, "nw")}
      />
      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleResizeStart(e, "se")}
      />
      <div
        className="resize-handle absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
        onMouseDown={(e) => handleResizeStart(e, "sw")}
      />
      <div
        className="resize-handle absolute top-0 left-4 right-4 h-1 cursor-n-resize"
        onMouseDown={(e) => handleResizeStart(e, "n")}
      />
      <div
        className="resize-handle absolute bottom-0 left-4 right-4 h-1 cursor-s-resize"
        onMouseDown={(e) => handleResizeStart(e, "s")}
      />
      <div
        className="resize-handle absolute left-0 top-4 bottom-4 w-1 cursor-w-resize"
        onMouseDown={(e) => handleResizeStart(e, "w")}
      />
      <div
        className="resize-handle absolute right-0 top-4 bottom-4 w-1 cursor-e-resize"
        onMouseDown={(e) => handleResizeStart(e, "e")}
      />
    </div>
  )
}
