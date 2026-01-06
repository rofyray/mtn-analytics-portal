"use client"

import { Sidebar } from "@/components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              MTN Analytics Portal Management
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  )
}
