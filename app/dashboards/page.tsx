import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Home, Store, TrendingUp, Users, Globe, Briefcase, Smartphone, FileText } from "lucide-react"

const dashboardCategories = [
  {
    id: "daf",
    name: "DAF & WAR Room",
    description: "Digital Accountability Forum Dashboards and metrics",
    icon: BarChart3,
  },
  {
    id: "home",
    name: "Home",
    description: "Home and Fibre Services and product analytics",
    icon: Home,
  },
  {
    id: "mcs",
    name: "MCS",
    description: "MTN Community Shops dashboards",
    icon: Store,
  },
  {
    id: "predictive",
    name: "SAI & DS",
    description: "Sales Analytics, Intelligence & Decision Support dashboards analytics",
    icon: TrendingUp,
  },
  {
    id: "rex",
    name: "REx",
    description: "Retail Experience analytics",
    icon: Users,
  },
  {
    id: "regional",
    name: "Regional Sales",
    description: "Regional performance and sales metrics",
    icon: Globe,
  },
  {
    id: "sales-ops",
    name: "Sales Operations",
    description: "Sales operations and performance tracking",
    icon: Briefcase,
  },
  {
    id: "digital",
    name: "Digital",
    description: "Digital analytics and campaigns",
    icon: Smartphone,
  },
  {
    id: "reports",
    name: "Reports",
    description: "Custom reports and analytics",
    icon: FileText,
  },
]

export default function DashboardsPage() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-background">
      {/* Adinkra symbols background */}
      <div
        className="absolute inset-0 z-0 bg-[#014d6d] dark:bg-[#FFCA06] opacity-[0.025]"
        style={{
          maskImage: "url(/adinkra/adinkra_background.svg)",
          WebkitMaskImage: "url(/adinkra/adinkra_background.svg)",
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-12">
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
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-icon-momo mb-4 transition-transform group-hover:scale-110">
                    <Icon className="h-7 w-7 icon-momo-blue" />
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
    </div>
  )
}
