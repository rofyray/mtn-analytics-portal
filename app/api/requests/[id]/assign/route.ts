import { NextRequest, NextResponse, after } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { sendAssignmentEmail } from "@/lib/email"

const assignSchema = z.object({
  analystId: z.string().min(1, "Analyst ID is required"),
  notes: z.string().optional(),
})

// POST /api/requests/[id]/assign - Assign request to analyst
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { analystId, notes } = assignSchema.parse(body)

    // Get the request
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    // Get the analyst
    const analyst = await prisma.analyst.findUnique({
      where: { id: analystId },
    })

    if (!analyst) {
      return NextResponse.json({ error: "Analyst not found" }, { status: 404 })
    }

    // Update the request
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        assignedToId: analystId,
        status: "assigned",
        assignedAt: new Date(),
      },
      include: {
        assignedTo: true,
      },
    })

    // Send assignment email after response is sent (serverless-safe)
    if (analyst.email) {
      after(async () => {
        try {
          await sendAssignmentEmail(updatedRequest, analyst, notes)
        } catch (err) {
          console.error("Failed to send assignment email:", err)
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Request assigned successfully",
      request: updatedRequest,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error assigning request:", error)
    return NextResponse.json(
      { error: "Failed to assign request" },
      { status: 500 }
    )
  }
}
