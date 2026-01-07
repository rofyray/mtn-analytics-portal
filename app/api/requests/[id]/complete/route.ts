import { NextRequest, NextResponse, after } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { sendCompletionEmail } from "@/lib/email"

// POST /api/requests/[id]/complete - Mark request as completed
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

    // Get the request
    const existingRequest = await prisma.request.findUnique({
      where: { id },
      include: {
        assignedTo: true,
      },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    // Update the request
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        completed: true,
        status: "completed",
        completedAt: new Date(),
      },
      include: {
        assignedTo: true,
      },
    })

    // Send completion email after response is sent (serverless-safe)
    after(async () => {
      try {
        await sendCompletionEmail(updatedRequest)
      } catch (err) {
        console.error("Failed to send completion email:", err)
      }
    })

    return NextResponse.json({
      success: true,
      message: "Request marked as completed",
      request: updatedRequest,
    })
  } catch (error) {
    console.error("Error completing request:", error)
    return NextResponse.json(
      { error: "Failed to complete request" },
      { status: 500 }
    )
  }
}
