"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Footer() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="border-t bg-card">
      <div className="container px-4 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/MTN-Logo.png"
              alt="MTN Logo"
              className="h-6 w-auto"
              style={{
                filter: mounted && resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)'
              }}
            />
            <span className="text-lg font-bold">MTN Analytics Portal</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-secondary dark:hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/dashboards" className="hover:text-secondary dark:hover:text-primary transition-colors">
              Dashboards
            </Link>
            <Link href="/submit-request" className="hover:text-secondary dark:hover:text-primary transition-colors">
              Submit Request
            </Link>
            <Link href="/login" className="hover:text-secondary dark:hover:text-primary transition-colors">
              Admin
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-full max-w-md border-t" />

          {/* Copyright & Version */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2025 LynxCorp. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ♥︎ in Ghana
            </p>
            <p className="text-xs text-muted-foreground">
              Version 2.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
