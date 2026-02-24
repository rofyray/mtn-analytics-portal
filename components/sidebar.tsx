"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const MANAGE_DASHBOARDS_EMAIL = "geoffery.okyere-forson@mtn.com"

interface SidebarProps {
  className?: string
}

const baseMenuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: FileText,
    label: "Requests",
    href: "/admin/requests",
  },
  {
    icon: BarChart3,
    label: "Reports",
    href: "/admin/reports",
  },
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const menuItems = useMemo(() => {
    const items = [...baseMenuItems]
    if (session?.user?.email === MANAGE_DASHBOARDS_EMAIL) {
      items.push({
        icon: Settings,
        label: "Manage Dashboards",
        href: "/admin/manage-dashboards",
      })
    }
    return items
  }, [session?.user?.email])

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "4rem" : "16rem",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "relative flex flex-col border-r bg-card h-full",
          className
        )}
      >
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-2 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.href}>{linkContent}</div>
            })}
          </nav>
        </div>

        {/* Collapse Toggle Button - Sticky at Bottom */}
        <div className="sticky bottom-0 border-t bg-card p-2 mt-auto">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Expand Sidebar</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full"
            >
              <div className="flex items-center gap-2 w-full justify-center">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Collapse</span>
              </div>
            </Button>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
