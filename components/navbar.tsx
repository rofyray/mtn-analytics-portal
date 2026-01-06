"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Menu, X, LogOut, ChevronDown } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Escape key handler for accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboards", label: "Dashboards" },
    { href: "/submit-request", label: "Submit Request" },
    { href: "/login", label: "Admin" },
  ]

  return (
    <>
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-label="Main navigation">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" aria-label="MTN Analytics Portal home">
          <div className="flex items-center space-x-2">
            <img
              src="/MTN-Logo.png"
              alt="MTN Logo"
              className="h-8 w-auto"
              style={{
                filter: mounted && resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)'
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">MTN Analytics Portal</span>
              <span className="text-xs text-muted-foreground">Data-Driven Insights</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium" aria-label="Primary navigation">
            {/* Only show these when NOT logged in */}
            {status !== "authenticated" && (
              <>
                <Link href="/" className="transition-colors hover:text-secondary dark:hover:text-primary">
                  Home
                </Link>
                <Link href="/dashboards" className="transition-colors hover:text-secondary dark:hover:text-primary">
                  Dashboards
                </Link>
                <Link href="/submit-request" className="transition-colors hover:text-secondary dark:hover:text-primary">
                  Submit Request
                </Link>
                <Link href="/login" className="transition-colors hover:text-secondary dark:hover:text-primary">
                  Admin
                </Link>
              </>
            )}
          </nav>

          {/* Show profile dropdown when logged in */}
          {status === "authenticated" && session?.user && (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFCC08] text-black font-semibold hover:opacity-90 transition-opacity">
                      {getInitials(session.user.name)}
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Show loading skeleton */}
          {status === "loading" && (
            <div className="hidden md:block">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMobileMenuOpen(false)
            }
          }}
        />
      )}

      {/* Mobile Menu Drawer */}
      <aside
        className={`
          fixed md:hidden inset-y-0 left-0 z-50 w-72 bg-card border-r
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/MTN-Logo.png"
                alt="MTN Logo"
                className="h-6 w-auto"
                style={{
                  filter: mounted && resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)'
                }}
              />
              <span className="font-bold text-sm">MTN Analytics</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation links">
            <div className="space-y-2">
              {/* Only show these when NOT logged in */}
              {status !== "authenticated" && (
                <>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg font-medium
                      transition-colors text-left
                      ${
                        pathname === "/"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboards"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg font-medium
                      transition-colors text-left
                      ${
                        pathname === "/dashboards"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    Dashboards
                  </Link>
                  <Link
                    href="/submit-request"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg font-medium
                      transition-colors text-left
                      ${
                        pathname === "/submit-request"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    Submit Request
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg font-medium
                      transition-colors text-left
                      ${
                        pathname === "/login"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    Admin
                  </Link>
                </>
              )}

              {/* Show profile section when logged in */}
              {status === "authenticated" && session?.user && (
                <div className="flex flex-col gap-4 pt-4 border-t mt-4">
                  <div className="flex items-center gap-3 px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFCC08] text-black font-bold text-lg">
                      {getInitials(session.user.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{session.user.name}</span>
                      <span className="text-xs text-muted-foreground">{session.user.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full mx-0"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: "/login" })
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Footer: Theme Toggle */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mode</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
