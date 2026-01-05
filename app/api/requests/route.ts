import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import {
  sendRequestNotification,
  sendConfirmation,
} from "@/lib/email"

// Schema for creating a new request
const createRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  requestType: z.string().min(1, "Request type is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime(),
})

// GET /api/requests - Fetch all requests (protected)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Build where clause
    const where = status ? { status } : {}

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

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }
}

// POST /api/requests - Create new request (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createRequestSchema.parse(body)

    // Create request in database
    const newRequest = await prisma.request.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        department: validatedData.department,
        requestType: validatedData.requestType,
        description: validatedData.description,
        dueDate: new Date(validatedData.dueDate),
        status: "pending",
      },
    })

    // Fetch all active admins for notifications
    const admins = await prisma.admin.findMany({
      where: { active: true },
      select: { email: true, name: true },
    })

    // Send notification emails to admins (async, don't wait)
    sendRequestNotification(newRequest, admins).catch((err) =>
      console.error("Failed to send admin notifications:", err)
    )

    // Send confirmation email to requester (async, don't wait)
    sendConfirmation(newRequest).catch((err) =>
      console.error("Failed to send confirmation email:", err)
    )

    return NextResponse.json(
      {
        success: true,
        message: "Request submitted successfully",
        request: newRequest,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating request:", error)
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    )
  }
}
