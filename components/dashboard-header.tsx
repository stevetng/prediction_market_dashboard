"use client"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Kalshi Analytics</h1>
          <span className="text-sm text-muted-foreground">Advanced Trading Analysis</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Positions</button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Risk</button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Performance</button>
        </div>
      </div>
    </header>
  )
}
