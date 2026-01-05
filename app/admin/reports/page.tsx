"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"
import { format, parse } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    // Validate dates
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates")
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      toast.error("Start date must be before end date")
      return
    }

    setIsExporting(true)

    try {
      // Build query params
      const params = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })

      // Fetch CSV
      const response = await fetch(`/api/requests/export?${params.toString()}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to export requests")
      }

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get("Content-Disposition")
      let filename = `requests-export-${start.toISOString().split("T")[0]}-to-${end.toISOString().split("T")[0]}.csv`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Download file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Report exported successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to export report")
    } finally {
      setIsExporting(false)
    }
  }

  // Set default dates (last 30 days)
  const handleSetLast30Days = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end.toISOString().split("T")[0])
  }

  // Set default dates (this month)
  const handleSetThisMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end.toISOString().split("T")[0])
  }

  // Set default dates (last month)
  const handleSetLastMonth = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end.toISOString().split("T")[0])
  }

  // Set default dates (last 7 days)
  const handleSetLast7Days = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 7)

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end.toISOString().split("T")[0])
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Export and analyze request data
        </p>
      </div>

      {/* Export Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Requests to CSV
          </CardTitle>
          <CardDescription>
            Download request data for a specific date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Quick Date Ranges
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetLast7Days}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetLast30Days}
              >
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetThisMonth}
              >
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetLastMonth}
              >
                Last Month
              </Button>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker
                id="start-date"
                value={startDate ? parse(startDate, "yyyy-MM-dd", new Date()) : undefined}
                onChange={(date) => {
                  if (date) {
                    setStartDate(format(date, "yyyy-MM-dd"))
                  }
                }}
                placeholder="Select start date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker
                id="end-date"
                value={endDate ? parse(endDate, "yyyy-MM-dd", new Date()) : undefined}
                onChange={(date) => {
                  if (date) {
                    setEndDate(format(date, "yyyy-MM-dd"))
                  }
                }}
                placeholder="Select end date"
              />
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isExporting || !startDate || !endDate}
            className="w-full md:w-auto"
          >
            {isExporting ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-pulse" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Export Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            The exported CSV file will include the following fields:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
            <li>Request ID</li>
            <li>Requester Name and Email</li>
            <li>Department and Request Type</li>
            <li>Description</li>
            <li>Status and Assigned Analyst</li>
            <li>Due Date, Created Date, Assigned Date, Completed Date</li>
            <li>Completion Status</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            Requests are filtered by their due date falling within the selected date range.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
