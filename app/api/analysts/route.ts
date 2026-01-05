import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/analysts - Fetch all active analysts
export async function GET(request: NextRequest) {
  try {
    const analysts = await prisma.analyst.findMany({
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

    return NextResponse.json({ analysts })
  } catch (error) {
    console.error("Error fetching analysts:", error)
    return NextResponse.json(
      { error: "Failed to fetch analysts" },
      { status: 500 }
    )
  }
}
