import { StatsCard } from "@/components/stats-card"
import { BarChart3, FileText, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartCard, LineChartCard, BarChartCard } from "@/components/charts"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

// Server component - fetch data
async function getDashboardData() {
  // Fetch all requests
  const requests = await prisma.request.findMany({
    include: {
      assignedTo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    assigned: requests.filter((r) => r.status === "assigned").length,
    completed: requests.filter((r) => r.status === "completed").length,
  }

  // Group by department
  const byDepartment = requests.reduce((acc, req) => {
    acc[req.department] = (acc[req.department] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group by request type
  const byType = requests.reduce((acc, req) => {
    acc[req.requestType] = (acc[req.requestType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group by status for pie chart
  const statusData = [
    { name: "Pending", value: stats.pending, fill: "#fbbf24" },
    { name: "Assigned", value: stats.assigned, fill: "#3b82f6" },
    { name: "Completed", value: stats.completed, fill: "#10b981" },
  ]

  // Requests over time (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentRequests = requests.filter(
    (r) => new Date(r.createdAt) >= thirtyDaysAgo
  )

  // Group by date
  const byDate = recentRequests.reduce((acc, req) => {
    const date = format(new Date(req.createdAt), "dd/MM/yyyy")
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const timelineData = Object.entries(byDate)
    .map(([date, count]) => ({
      date,
      value: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return {
    stats,
    statusData,
    byDepartment: Object.entries(byDepartment).map(([name, value]) => ({
      name,
      value,
    })),
    byType: Object.entries(byType).map(([name, value]) => ({ name, value })),
    timelineData,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of analytics requests and system activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          value={data.stats.total}
          icon={FileText}
          description="All time"
          iconClassName="text-blue-600"
        />
        <StatsCard
          title="Pending"
          value={data.stats.pending}
          icon={Clock}
          description="Awaiting assignment"
          iconClassName="text-yellow-600"
        />
        <StatsCard
          title="Assigned"
          value={data.stats.assigned}
          icon={BarChart3}
          description="Currently in progress"
          iconClassName="text-blue-600"
        />
        <StatsCard
          title="Completed"
          value={data.stats.completed}
          icon={CheckCircle}
          description="Successfully delivered"
          iconClassName="text-green-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <PieChartCard
          title="Status Distribution"
          description="Breakdown by request status"
          data={data.statusData}
        />

        <BarChartCard
          title="Requests by Department"
          description="Distribution across departments"
          data={data.byDepartment}
          dataKey="value"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <LineChartCard
          title="Requests Over Time"
          description="Last 30 days trend"
          data={data.timelineData}
        />

        <BarChartCard
          title="Requests by Type"
          description="Distribution by request type"
          data={data.byType}
          dataKey="value"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Navigate to key areas of the admin portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/admin/requests"
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">Manage Requests</h4>
                <p className="text-sm text-muted-foreground">
                  View, assign, and track all analytics requests
                </p>
              </div>
            </a>

            <a
              href="/admin/reports"
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <BarChart3 className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">Generate Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Export and analyze request data
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
