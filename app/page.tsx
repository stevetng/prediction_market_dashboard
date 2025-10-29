"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { TrendingMarketsTicker } from "@/components/trending-markets-ticker"
import { PersonaTabs } from "@/components/persona-tabs"
import { ExampleView } from "@/components/example/example-view"
import { InstitutionalView } from "@/components/institutional/institutional-view"
import { RiskView } from "@/components/risk/risk-view"
import { ForecasterView } from "@/components/forecaster/forecaster-view"
import { MarketInvestigationView } from "@/components/market/market-investigation-view"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import type { PersonaView } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [activePersona, setActivePersona] = useState<PersonaView>("example")
  useRealtimeUpdates()

  return (
    <div className="min-h-screen bg-background">
      <TrendingMarketsTicker />
      <DashboardHeader />
      <PersonaTabs activePersona={activePersona} onPersonaChange={setActivePersona} />
      

      <main className="px-4 pt-2 pb-4 md:px-6 md:pt-3 lg:px-8 lg:pt-4 w-full">
        <AnimatePresence mode="wait">
            {activePersona === "example" && (
              <motion.div
                key="example"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <ExampleView />
              </motion.div>
            )}
            {activePersona === "institutional" && (
              <motion.div
                key="institutional"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <InstitutionalView />
              </motion.div>
            )}
            {activePersona === "risk" && (
              <motion.div
                key="risk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <RiskView />
              </motion.div>
            )}
            {activePersona === "forecaster" && (
              <motion.div
                key="forecaster"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <ForecasterView />
              </motion.div>
            )}
            {activePersona === "market-investigation" && (
              <motion.div
                key="market-investigation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <MarketInvestigationView />
              </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  )
}
