import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// DELETE /api/requests/[id] - Delete a request
export async function DELETE(
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

    // Check if request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    // Delete associated edit history first
    await prisma.editHistory.deleteMany({
      where: { requestId: id },
    })

    // Delete the request
    await prisma.request.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Request deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting request:", error)
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    )
  }
}
