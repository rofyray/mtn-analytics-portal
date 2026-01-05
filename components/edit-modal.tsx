"use client"

import { useState, useEffect } from "react"
import { format, parse } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"

interface EditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string
  requestName: string
  currentDueDate: Date
  onEdit?: (data: { newDueDate: string; reason: string }) => Promise<void>
}

export function EditModal({
  open,
  onOpenChange,
  requestId,
  requestName,
  currentDueDate,
  onEdit,
}: EditModalProps) {
  const [newDueDate, setNewDueDate] = useState("")
  const [reason, setReason] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (open) {
      // Set initial date when modal opens
      setNewDueDate(format(new Date(currentDueDate), "yyyy-MM-dd"))
      setReason("")
    }
  }, [open, currentDueDate])

  const handleEdit = async () => {
    if (!newDueDate) {
      toast.error("Please select a new due date")
      return
    }

    if (!reason || reason.trim().length < 5) {
      toast.error("Please provide a reason (at least 5 characters)")
      return
    }

    const selectedDate = new Date(newDueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast.error("Due date cannot be in the past")
      return
    }

    try {
      setIsEditing(true)
      if (onEdit) {
        await onEdit({ newDueDate, reason })
      }
      toast.success("Due date updated successfully!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update due date. Please try again.")
      console.error(error)
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Due Date</DialogTitle>
          <DialogDescription>
            Update the due date for "{requestName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Due Date Display */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Due Date:</p>
            <p className="font-medium">
              {format(new Date(currentDueDate), "dd/MM/yyyy")}
            </p>
          </div>

          {/* New Due Date */}
          <div className="space-y-2">
            <Label htmlFor="newDueDate">New Due Date *</Label>
            <DatePicker
              id="newDueDate"
              value={newDueDate ? parse(newDueDate, "yyyy-MM-dd", new Date()) : undefined}
              onChange={(date) => {
                if (date) {
                  setNewDueDate(format(date, "yyyy-MM-dd"))
                }
              }}
              minDate={new Date()}
              disabled={isEditing}
              placeholder="Select new due date"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change *</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why the due date needs to be changed..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isEditing}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This reason will be logged and sent to the requester.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isEditing}
          >
            Cancel
          </Button>
          <Button onClick={handleEdit} disabled={isEditing}>
            {isEditing ? "Updating..." : "Update Due Date"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
