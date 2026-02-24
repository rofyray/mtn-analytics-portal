"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Dashboard = {
  id: string
  name: string
  url: string
}

type DashboardCategory = {
  name: string
  dashboards: Dashboard[]
}

type DashboardsConfig = Record<string, DashboardCategory>

export function ManageDashboardsClient() {
  const [config, setConfig] = useState<DashboardsConfig>({})
  const [loading, setLoading] = useState(true)

  // Add form state
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [newCategoryId, setNewCategoryId] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [dashboardName, setDashboardName] = useState("")
  const [dashboardUrl, setDashboardUrl] = useState("")
  const [adding, setAdding] = useState(false)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ categoryId: string; dashboardId: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboards")
      const data = await res.json()
      setConfig(data)
    } catch {
      toast.error("Failed to load dashboard config")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const generatedId = dashboardName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")

  const handleAdd = async () => {
    const categoryId = isNewCategory ? newCategoryId : selectedCategory
    const categoryName = isNewCategory ? newCategoryName : undefined

    if (!categoryId || !dashboardName || !dashboardUrl) {
      toast.error("Please fill in all required fields")
      return
    }

    if (isNewCategory && !categoryName) {
      toast.error("Please provide a category name")
      return
    }

    setAdding(true)
    try {
      const res = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, categoryName, dashboardName, dashboardUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to add dashboard")
        return
      }
      toast.success(`Dashboard "${dashboardName}" added successfully`)
      // Reset form
      setDashboardName("")
      setDashboardUrl("")
      setNewCategoryId("")
      setNewCategoryName("")
      setIsNewCategory(false)
      setSelectedCategory("")
      await fetchConfig()
    } catch {
      toast.error("Failed to add dashboard")
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const res = await fetch("/api/dashboards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: deleteTarget.categoryId,
          dashboardId: deleteTarget.dashboardId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to delete dashboard")
        return
      }
      toast.success(`Dashboard "${deleteTarget.name}" deleted`)
      await fetchConfig()
    } catch {
      toast.error("Failed to delete dashboard")
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const categoryEntries = Object.entries(config)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Dashboards</h1>
        <p className="text-muted-foreground mt-1">Add or remove Power BI dashboards</p>
      </div>

      {/* Add Dashboard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Dashboard
          </CardTitle>
          <CardDescription>Add a new dashboard to an existing or new category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Selection */}
          <div className="flex items-center gap-3">
            <Label htmlFor="new-category-toggle" className="text-sm">New category</Label>
            <Switch
              id="new-category-toggle"
              checked={isNewCategory}
              onCheckedChange={setIsNewCategory}
            />
          </div>

          {isNewCategory ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-id">Category ID</Label>
                <Input
                  id="category-id"
                  placeholder="e.g. finance"
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g. Finance & Accounting"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryEntries.map(([id, cat]) => (
                    <SelectItem key={id} value={id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dashboard Details */}
          <div className="space-y-2">
            <Label htmlFor="dashboard-name">Dashboard Name</Label>
            <Input
              id="dashboard-name"
              placeholder="e.g. Revenue Overview"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
            />
            {generatedId && (
              <p className="text-xs text-muted-foreground">
                ID: <span className="font-mono">{generatedId}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dashboard-url">Dashboard URL</Label>
            <Input
              id="dashboard-url"
              placeholder="https://app.powerbi.com/reportEmbed?..."
              value={dashboardUrl}
              onChange={(e) => setDashboardUrl(e.target.value)}
            />
          </div>

          <Button onClick={handleAdd} disabled={adding}>
            {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Add Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Existing Dashboards Section */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Dashboards</CardTitle>
          <CardDescription>Click the trash icon to remove a dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryEntries.length === 0 && (
            <p className="text-muted-foreground text-sm">No dashboards configured.</p>
          )}
          {categoryEntries.map(([catId, cat]) => (
            <div key={catId}>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {cat.name} <span className="text-xs font-normal">({catId})</span>
              </h3>
              <div className="space-y-1">
                {cat.dashboards.map((dashboard) => (
                  <div
                    key={dashboard.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{dashboard.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{dashboard.id}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setDeleteTarget({
                          categoryId: catId,
                          dashboardId: dashboard.id,
                          name: dashboard.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong> from the dashboards.
              {deleteTarget && config[deleteTarget.categoryId]?.dashboards.length === 1 && (
                <> The category will also be removed since this is the last dashboard in it.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
