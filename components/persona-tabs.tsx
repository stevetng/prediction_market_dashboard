"use client"

import { cn } from "@/lib/utils"
import type { PersonaView } from "@/lib/types"
import { motion } from "framer-motion"

interface PersonaTabsProps {
  activePersona: PersonaView
  onPersonaChange: (persona: PersonaView) => void
}

export function PersonaTabs({ activePersona, onPersonaChange }: PersonaTabsProps) {
  const personas: { value: PersonaView; label: string }[] = [
    { value: "institutional", label: "Portfolio Overview" },
    { value: "market-investigation", label: "Market Deep Dive" },
    { value: "risk", label: "Risk Management" },
    { value: "forecaster", label: "Performance Analytics" },
  ]

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6">
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
      </div>
    </div>
  )
}
