"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Analyst {
  id: string
  name: string
  email: string
}

interface AssignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysts: Analyst[]
  requestId: string
  requestName: string
  onAssign?: (data: { analystId: string; notes?: string }) => Promise<void>
}

export function AssignModal({
  open,
  onOpenChange,
  analysts,
  requestId,
  requestName,
  onAssign,
}: AssignModalProps) {
  const [selectedAnalystId, setSelectedAnalystId] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  const handleAssign = async () => {
    if (!selectedAnalystId) {
      toast.error("Please select an analyst")
      return
    }

    try {
      setIsAssigning(true)
      if (onAssign) {
        await onAssign({ analystId: selectedAnalystId, notes })
      }
      toast.success("Request assigned successfully!")
      onOpenChange(false)
      setSelectedAnalystId("")
      setNotes("")
    } catch (error) {
      toast.error("Failed to assign request. Please try again.")
      console.error(error)
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Request</DialogTitle>
          <DialogDescription>
            Assign "{requestName}" to an analyst for processing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Analyst Selection */}
          <div className="space-y-2">
            <Label htmlFor="analyst">Select Analyst *</Label>
            <Select
              value={selectedAnalystId}
              onValueChange={setSelectedAnalystId}
              disabled={isAssigning}
            >
              <SelectTrigger id="analyst">
                <SelectValue placeholder="Choose an analyst" />
              </SelectTrigger>
              <SelectContent>
                {analysts.map((analyst) => (
                  <SelectItem key={analyst.id} value={analyst.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{analyst.name}</span>
                      <span className="text-xs text-muted-foreground">{analyst.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isAssigning}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isAssigning}>
            {isAssigning ? "Assigning..." : "Assign Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
