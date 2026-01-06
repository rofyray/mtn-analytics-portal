import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET /api/requests/export - Export requests as CSV
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build where clause for date filtering
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Fetch requests with relations
    const requests = await prisma.request.findMany({
      where,
      include: {
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Generate CSV
    const headers = [
      "ID",
      "Name",
      "Email",
      "Department",
      "Request Type",
      "Description",
      "Status",
      "Assigned To",
      "Due Date",
      "Created At",
      "Assigned At",
      "Completed At",
      "Completed",
    ]

    const rows = requests.map((req: {
      id: string
      name: string
      email: string
      department: string
      requestType: string
      description: string
      status: string
      assignedTo?: { name: string } | null
      dueDate: Date
      createdAt: Date
      assignedAt?: Date | null
      completedAt?: Date | null
      completed: boolean
    }) => [
      req.id,
      req.name,
      req.email,
      req.department,
      req.requestType,
      `"${req.description.replace(/"/g, '""')}"`, // Escape quotes in description
      req.status,
      req.assignedTo?.name || "Not Assigned",
      req.dueDate.toISOString(),
      req.createdAt.toISOString(),
      req.assignedAt?.toISOString() || "",
      req.completedAt?.toISOString() || "",
      req.completed ? "Yes" : "No",
    ])

    // Build CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) => row.join(",")),
    ].join("\n")

    // Return CSV file
    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="requests-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting requests:", error)
    return NextResponse.json(
      { error: "Failed to export requests" },
      { status: 500 }
    )
  }
}
