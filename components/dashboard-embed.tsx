"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Dashboard {
  id: string
  name: string
  url: string
}

interface DashboardEmbedProps {
  category: string
  dashboards: Dashboard[]
  defaultDashboardId?: string
}

export function DashboardEmbed({ category, dashboards, defaultDashboardId }: DashboardEmbedProps) {
  const [activeDashboardId, setActiveDashboardId] = useState(
    defaultDashboardId || dashboards[0]?.id || ""
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId)

  const handleDashboardChange = (dashboardId: string) => {
    setIsLoading(true)
    setActiveDashboardId(dashboardId)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <Card
        className={cn(
          "flex flex-col transition-all duration-300 rounded-none border-r",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-b">
          <Link
            href="/dashboards"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </div>

        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2">{category}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {dashboards.length} dashboard{dashboards.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto p-2">
          {dashboards.map((dashboard) => (
            <Button
              key={dashboard.id}
              variant={activeDashboardId === dashboard.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                activeDashboardId === dashboard.id && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => handleDashboardChange(dashboard.id)}
            >
              {dashboard.name}
            </Button>
          ))}
        </nav>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  !isSidebarOpen && "rotate-180"
                )}
              />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{activeDashboard?.name}</h1>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
          </div>
        </div>

        {/* Dashboard iframe */}
        <div className="flex-1 relative bg-muted/50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          )}
          {activeDashboard ? (
            <iframe
              src={activeDashboard.url}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              title={activeDashboard.name}
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No dashboard selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
