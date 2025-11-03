"use client"

import { cn, formatCurrency, formatPercent } from "@/lib/utils"
import type { PersonaView } from "@/lib/types"
import { motion } from "framer-motion"
import { useDashboardStore } from "@/lib/store"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PersonaTabsProps {
  activePersona: PersonaView
  onPersonaChange: (persona: PersonaView) => void
}

export function PersonaTabs({ activePersona, onPersonaChange }: PersonaTabsProps) {
  const portfolioStats = useDashboardStore((state) => state.portfolioStats)
  const currentPositions = useDashboardStore((state) => state.currentPositions)
  const availableCash = useDashboardStore((state) => state.availableCash)

  const personas: { value: PersonaView; label: string }[] = [
    { value: "example", label: "Example Tab" },
    { value: "market-investigation", label: "Market Deep Dive" },
    { value: "forecaster", label: "Performance Analytics" },
    { value: "institutional", label: "Portfolio Overview" },
    { value: "risk", label: "Risk Management" },
  ]

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6">
        <div className="flex items-center justify-between">
          {/* Left side - Tabs */}
          <div className="flex gap-6">
            {personas.map((persona) => (
              <button
                key={persona.value}
                onClick={() => onPersonaChange(persona.value)}
                className={cn(
                  "relative py-4 text-sm font-medium transition-colors",
                  activePersona === persona.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {persona.label}
                {activePersona === persona.value && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side - Portfolio Stats */}
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.15 }}
              className="text-center"
            >
              <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
              <div className="flex items-center gap-2">
                <motion.div
                  key={portfolioStats.value}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="text-lg font-semibold tabular-nums"
                >
                  {formatCurrency(portfolioStats.value)}
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    portfolioStats.change >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {portfolioStats.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {formatPercent(portfolioStats.changePercent)}
                </motion.div>
              </div>
            </motion.div>

            <div className="h-8 w-px bg-border" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="text-center"
            >
              <div className="text-xs text-muted-foreground mb-1">Current Positions</div>
              <div className="flex items-center gap-2">
                <motion.div
                  key={currentPositions.value}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="text-lg font-semibold tabular-nums"
                >
                  {formatCurrency(currentPositions.value)}
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    currentPositions.change >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {currentPositions.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercent(currentPositions.changePercent)}
                </motion.div>
              </div>
            </motion.div>

            <div className="h-8 w-px bg-border" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-xs text-muted-foreground mb-1">Available Cash</div>
              <div className="flex items-center gap-2">
                <motion.div
                  key={availableCash.value}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className="text-lg font-semibold tabular-nums"
                >
                  {formatCurrency(availableCash.value)}
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    availableCash.change >= 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {availableCash.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {formatPercent(availableCash.changePercent)}
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}
