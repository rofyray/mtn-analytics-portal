import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admins - Fetch all active admins
export async function GET(request: NextRequest) {
  try {
    const admins = await prisma.admin.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ admins })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}
