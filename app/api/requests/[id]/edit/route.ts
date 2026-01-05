import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { sendDateChangeEmail } from "@/lib/email"

const editSchema = z.object({
  dueDate: z.string().datetime(),
  reason: z.string().min(1, "Reason for change is required"),
})

// PATCH /api/requests/[id]/edit - Update request due date
export async function PATCH(
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
    const { dueDate, reason } = editSchema.parse(body)

    // Get the existing request
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

    const oldDate = existingRequest.dueDate
    const newDate = new Date(dueDate)

    // Update the request
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        dueDate: newDate,
        editedAt: new Date(),
      },
      include: {
        assignedTo: true,
      },
    })

    // Create edit history entry
    await prisma.editHistory.create({
      data: {
        requestId: id,
        editedBy: session.user.email,
        oldDate,
        newDate,
        reason,
      },
    })

    // Send date change email to requester (async, don't wait)
    sendDateChangeEmail(updatedRequest, oldDate, newDate, reason).catch((err) =>
      console.error("Failed to send date change email:", err)
    )

    return NextResponse.json({
      success: true,
      message: "Due date updated successfully",
      request: updatedRequest,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating request:", error)
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    )
  }
}
