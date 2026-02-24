import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAIL = "geoffery.okyere-forson@mtn.com"

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

async function getDashboardConfig(): Promise<DashboardsConfig> {
  const record = await prisma.dashboardConfig.findUnique({
    where: { id: "main" },
  })
  return (record?.data ?? {}) as DashboardsConfig
}

export async function GET() {
  try {
    const data = await getDashboardConfig()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard config" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { categoryId, categoryName, dashboardName, dashboardUrl } = body

    if (!categoryId || !dashboardName || !dashboardUrl) {
      return NextResponse.json(
        { error: "categoryId, dashboardName, and dashboardUrl are required" },
        { status: 400 }
      )
    }

    const dashboardId = dashboardName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")

    const config = await getDashboardConfig()

    if (!config[categoryId]) {
      if (!categoryName) {
        return NextResponse.json(
          { error: "categoryName is required for new categories" },
          { status: 400 }
        )
      }
      config[categoryId] = {
        name: categoryName,
        dashboards: [],
      }
    }

    config[categoryId].dashboards.push({
      id: dashboardId,
      name: dashboardName,
      url: dashboardUrl,
    })

    await prisma.dashboardConfig.upsert({
      where: { id: "main" },
      update: { data: config },
      create: { id: "main", data: config },
    })

    return NextResponse.json({ success: true, dashboardId })
  } catch {
    return NextResponse.json(
      { error: "Failed to add dashboard" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { categoryId, dashboardId } = body

    if (!categoryId || !dashboardId) {
      return NextResponse.json(
        { error: "categoryId and dashboardId are required" },
        { status: 400 }
      )
    }

    const config = await getDashboardConfig()

    if (!config[categoryId]) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    config[categoryId].dashboards = config[categoryId].dashboards.filter(
      (d) => d.id !== dashboardId
    )

    // Remove empty categories
    if (config[categoryId].dashboards.length === 0) {
      delete config[categoryId]
    }

    await prisma.dashboardConfig.upsert({
      where: { id: "main" },
      update: { data: config },
      create: { id: "main", data: config },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete dashboard" },
      { status: 500 }
    )
  }
}
