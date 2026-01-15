import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Home, Store, TrendingUp, Users, Globe, Briefcase, Smartphone, FileText } from "lucide-react"

const dashboardCategories = [
  {
    id: "daf",
    name: "DAF & WAR Room",
    description: "Distribution and Field Analytics dashboards",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    id: "home",
    name: "Home",
    description: "Home services and product analytics",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    id: "mcs",
    name: "MCS",
    description: "Mobile Customer Services dashboards",
    icon: Store,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
  },
  {
    id: "predictive",
    name: "SAI & DS",
    description: "Sales AI & Data Science dashboards",
    icon: TrendingUp,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950",
  },
  {
    id: "rex",
    name: "REx",
    description: "Retail Experience analytics",
    icon: Users,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
  },
  {
    id: "regional",
    name: "Regional Sales",
    description: "Regional performance and sales metrics",
    icon: Globe,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
  },
  {
    id: "sales-ops",
    name: "Sales Operations",
    description: "Sales operations and performance tracking",
    icon: Briefcase,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  {
    id: "digital",
    name: "Digital",
    description: "Digital analytics and campaigns",
    icon: Smartphone,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    id: "reports",
    name: "Reports",
    description: "Custom reports and analytics",
    icon: FileText,
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950",
  },
]

export default function DashboardsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Power BI Dashboards</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive collection of analytics dashboards organized by category
        </p>
      </div>

      {/* Dashboard Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCategories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.id}
              href={`/dashboards/${category.id}`}
              className="group"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <CardHeader>
                  <div className={`flex items-center justify-center h-14 w-14 rounded-lg ${category.bgColor} mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-brand">
                    <span>View Dashboards</span>
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Help Section */}
      <div className="mt-16 text-center">
        <Card className="bg-background dark:bg-card">
          <CardHeader>
            <CardTitle>Need a New Dashboard?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Submit a request for a new dashboard or modifications to existing ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/submit-request">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Submit Request
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
