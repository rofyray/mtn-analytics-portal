import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET /api/sse - Server-Sent Events for real-time updates
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const encoder = new TextEncoder()

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      const sendUpdate = async () => {
        try {
          // Fetch all requests with relations
          const requests = await prisma.request.findMany({
            include: {
              assignedTo: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          })

          // Calculate stats
          const stats = {
            total: requests.length,
            pending: requests.filter((r) => r.status === "pending").length,
            assigned: requests.filter((r) => r.status === "assigned").length,
            completed: requests.filter((r) => r.status === "completed").length,
          }

          // Send data as SSE event
          const data = JSON.stringify({ requests, stats })
          const message = `data: ${data}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (error) {
          console.error("Error fetching data for SSE:", error)
        }
      }

      // Send initial update
      await sendUpdate()

      // Poll database every 10 seconds
      const interval = setInterval(async () => {
        await sendUpdate()
      }, 10000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  // Return SSE response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
