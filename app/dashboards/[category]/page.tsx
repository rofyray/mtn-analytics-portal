"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  PanelLeft,
  X,
  Loader2,
  BarChart3,
  TrendingUp,
  Home,
  Smartphone,
  Brain,
  Users,
  MapPin,
  ShoppingCart,
  LayoutDashboard,
  FileText,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Icon mapping for dashboard categories
const categoryIcons: Record<string, LucideIcon> = {
  daf: BarChart3,
  digital: Smartphone,
  home: Home,
  mcs: Users,
  predictive: Brain,
  rex: TrendingUp,
  regional: MapPin,
  "sales-ops": ShoppingCart,
  reports: FileText,
}

// Function to get icon by dashboard name (fallback logic)
const getDashboardIcon = (name: string, categoryKey: string): LucideIcon => {
  // Try category icon first
  if (categoryIcons[categoryKey]) return categoryIcons[categoryKey]

  // Fallback based on name keywords
  const nameLower = name.toLowerCase()
  if (nameLower.includes("trend") || nameLower.includes("growth")) return TrendingUp
  if (nameLower.includes("user") || nameLower.includes("customer")) return Users
  if (nameLower.includes("home") || nameLower.includes("overview")) return Home
  if (nameLower.includes("digital") || nameLower.includes("mobile")) return Smartphone
  if (nameLower.includes("predict") || nameLower.includes("forecast")) return Brain
  if (nameLower.includes("region") || nameLower.includes("location")) return MapPin
  if (nameLower.includes("sales") || nameLower.includes("revenue")) return ShoppingCart

  // Default
  return LayoutDashboard
}

type Dashboard = {
  id: string
  name: string
  url: string
}

type DashboardCategory = {
  name: string
  dashboards: Dashboard[]
}

export default function DashboardCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string

  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const [categoryData, setCategoryData] = useState<DashboardCategory | null>(null)

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const res = await fetch("/api/dashboards")
        const data = await res.json() as Record<string, DashboardCategory>
        const catData = data[category]
        if (!catData) {
          router.push("/dashboards")
          return
        }
        setCategoryData(catData)
        if (catData.dashboards.length > 0) {
          setSelectedDashboard(catData.dashboards[0])
        }
      } catch {
        router.push("/dashboards")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboards()
  }, [category, router])

  if (!categoryData) {
    return null
  }

  const handleDashboardSelect = (dashboard: Dashboard) => {
    setIsLoading(true)
    setSelectedDashboard(dashboard)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSidebarOpen(false)
            }
          }}
        />
      )}

      {/* Sidebar - Icon-based Collapsed State */}
      <TooltipProvider>
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? "16rem" : "4rem",
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="hidden md:flex relative border-r bg-card flex-col"
          aria-label="Dashboard navigation"
        >
          {/* Top: Back to Dashboards */}
          <div className="border-b p-3">
            {sidebarOpen ? (
              <Link
                href="/dashboards"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2 shrink-0" />
                <span>Back to Dashboards</span>
              </Link>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboards"
                    className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors mx-auto"
                  >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Back to Dashboards</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Middle: Dashboard Navigation (Scrollable) */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {categoryData.dashboards.map((dashboard) => {
                const Icon = getDashboardIcon(dashboard.name, category)
                const isSelected = selectedDashboard?.id === dashboard.id

                return sidebarOpen ? (
                  // Expanded: Icon + Text
                  <button
                    key={dashboard.id}
                    onClick={() => handleDashboardSelect(dashboard)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors text-left
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {dashboard.name}
                    </span>
                  </button>
                ) : (
                  // Collapsed: Icon Only with Tooltip
                  <Tooltip key={dashboard.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleDashboardSelect(dashboard)}
                        className={`
                          w-full flex items-center justify-center
                          h-10 rounded-lg transition-colors
                          ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{dashboard.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>

          {/* Bottom: Collapse Toggle */}
          <div className="border-t p-3">
            {sidebarOpen ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="w-full justify-start"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="w-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand Sidebar</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <aside
          className={`
            fixed md:hidden inset-y-0 left-0 z-50 w-72 bg-card border-r
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          aria-label="Dashboard navigation (mobile)"
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <Link
                  href="/dashboards"
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Dashboards
                </Link>
                <h2 className="font-semibold text-lg">{categoryData.name}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Dashboard List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {categoryData.dashboards.map((dashboard) => {
                  const Icon = getDashboardIcon(dashboard.name, category)
                  const isSelected = selectedDashboard?.id === dashboard.id

                  return (
                    <button
                      key={dashboard.id}
                      onClick={() => handleDashboardSelect(dashboard)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors text-left
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="font-medium">{dashboard.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>
      </TooltipProvider>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Dashboard Title - Collapsible */}
        {!headerCollapsed && (
          <div className="border-b bg-card transition-all duration-300">
            <div className="container px-4 py-4 flex items-center justify-between">
              {/* Left: Dashboard Title */}
              <div>
                <h1 className="text-2xl font-bold">
                  {selectedDashboard?.name || categoryData.dashboards[0]?.name || "Dashboard"}
                </h1>
              </div>

              {/* Right: Collapse Button and Mobile Menu */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setHeaderCollapsed(true)}
                  title="Collapse header"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Iframe */}
        <div className="flex-1 relative bg-muted/50">
          {/* Floating Expand Button when header is collapsed */}
          {headerCollapsed && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setHeaderCollapsed(false)}
              className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
              title="Expand header"
            >
              <ChevronDown className="h-5 w-5 rotate-180 text-foreground" />
            </Button>
          )}
          {selectedDashboard ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                  </div>
                </div>
              )}
              <iframe
                src={selectedDashboard.url}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                title={selectedDashboard.name}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No dashboards available for this category
                </p>
                <Link href="/dashboards">
                  <Button className="mt-4" variant="outline">
                    Back to Dashboards
                  </Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
