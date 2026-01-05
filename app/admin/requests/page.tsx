"use client"

import { useState, useEffect } from "react"
import { RequestCard } from "@/components/request-card"
import { FilterBar } from "@/components/filter-bar"
import { AssignModal } from "@/components/assign-modal"
import { EditModal } from "@/components/edit-modal"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Request = {
  id: string
  name: string
  email: string
  department: string
  requestType: string
  description: string
  status: "pending" | "assigned" | "completed"
  dueDate: Date
  createdAt: Date
  assignedTo?: {
    id: string
    name: string
    email: string
  } | null
}

type Stats = {
  total: number
  pending: number
  assigned: number
  completed: number
}

type Analyst = {
  id: string
  name: string
  email: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [analysts, setAnalysts] = useState<Analyst[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
  })
  const [filter, setFilter] = useState<string>("all")
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch analysts
  useEffect(() => {
    const fetchAnalysts = async () => {
      try {
        const response = await fetch("/api/analysts")
        if (response.ok) {
          const data = await response.json()
          setAnalysts(data.analysts || [])
        }
      } catch (error) {
        console.error("Error fetching analysts:", error)
      }
    }
    fetchAnalysts()
  }, [])

  // Real-time updates with SSE
  useEffect(() => {
    const eventSource = new EventSource("/api/sse")

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // Convert string dates to Date objects
        const requestsWithDates = data.requests.map((req: any) => ({
          ...req,
          dueDate: new Date(req.dueDate),
          createdAt: new Date(req.createdAt),
        }))
        setRequests(requestsWithDates)
        setStats(data.stats)
        setIsLoading(false)
      } catch (error) {
        console.error("Error parsing SSE data:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error)
      eventSource.close()
      setIsLoading(false)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // Filter requests
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter)

  // Handle assign
  const handleAssign = (request: Request) => {
    setSelectedRequest(request)
    setAssignModalOpen(true)
  }

  const handleAssignSubmit = async (data: { analystId: string; notes?: string }) => {
    if (!selectedRequest) return

    try {
      const response = await fetch(
        `/api/requests/${selectedRequest.id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const responseData = await response.json()
        throw new Error(responseData.error || "Failed to assign request")
      }

      // No need for toast here, AssignModal handles it
    } catch (error) {
      // Re-throw error for AssignModal to handle
      throw error
    }
  }

  // Handle complete
  const handleComplete = (request: Request) => {
    setSelectedRequest(request)
    setCompleteDialogOpen(true)
  }

  const handleCompleteConfirm = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(
        `/api/requests/${selectedRequest.id}/complete`,
        {
          method: "POST",
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to complete request")
      }

      toast.success("Request marked as completed")
      setCompleteDialogOpen(false)
      setSelectedRequest(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete request")
    }
  }

  // Handle edit
  const handleEdit = (request: Request) => {
    setSelectedRequest(request)
    setEditModalOpen(true)
  }

  const handleEditSubmit = async (data: { newDueDate: string; reason: string }) => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/requests/${selectedRequest.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: data.newDueDate, reason: data.reason }),
      })

      if (!response.ok) {
        const responseData = await response.json()
        throw new Error(responseData.error || "Failed to update request")
      }

      // EditModal handles toast
    } catch (error) {
      // Re-throw for EditModal to handle
      throw error
    }
  }

  // Handle delete
  const handleDelete = (request: Request) => {
    setSelectedRequest(request)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/requests/${selectedRequest.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete request")
      }

      toast.success("Request deleted successfully")
      setDeleteDialogOpen(false)
      setSelectedRequest(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete request")
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
        <p className="text-muted-foreground">
          Manage and track all analytics requests
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        activeFilter={filter as "all" | "pending" | "assigned" | "completed"}
        onFilterChange={setFilter}
        counts={{
          all: stats.total,
          pending: stats.pending,
          assigned: stats.assigned,
          completed: stats.completed,
        }}
      />

      {/* Requests Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading requests...</div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">No requests found</p>
            {filter !== "all" && (
              <p className="text-sm text-muted-foreground mt-2">
                Try changing the filter
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAssign={() => handleAssign(request)}
              onComplete={() => handleComplete(request)}
              onEdit={() => handleEdit(request)}
              onDelete={() => handleDelete(request)}
            />
          ))}
        </div>
      )}

      {/* Modals and Dialogs */}
      {selectedRequest && (
        <>
          <AssignModal
            open={assignModalOpen}
            onOpenChange={setAssignModalOpen}
            analysts={analysts}
            requestId={selectedRequest.id}
            requestName={selectedRequest.name}
            onAssign={handleAssignSubmit}
          />

          <EditModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            requestId={selectedRequest.id}
            requestName={selectedRequest.name}
            currentDueDate={selectedRequest.dueDate}
            onEdit={handleEditSubmit}
          />
        </>
      )}

      <AlertDialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Completed</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this request as completed? This will
              send a notification email to the requester.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteConfirm}>
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this request? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
