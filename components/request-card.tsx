"use client"

import { format } from "date-fns"
import { Calendar, Mail, User, FileText, Building2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { MoreVertical } from "lucide-react"

interface RequestCardProps {
  request: {
    id: string
    name: string
    email: string
    department: string
    requestType: string
    description: string
    dueDate: Date
    status: "pending" | "assigned" | "completed"
    createdAt: Date
    assignedTo?: {
      name: string
      email: string
    } | null
  }
  onAssign?: (requestId: string) => void
  onComplete?: (requestId: string) => void
  onEdit?: (requestId: string) => void
  onDelete?: (requestId: string) => void
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  assigned: {
    label: "Assigned",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
}

export function RequestCard({ request, onAssign, onComplete, onEdit, onDelete }: RequestCardProps) {
  const statusInfo = statusConfig[request.status]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{request.name}</h3>
            </div>
            <Badge className={cn("font-medium", statusInfo.className)}>
              {statusInfo.label}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {request.status === "pending" && onAssign && (
                <DropdownMenuItem onClick={() => onAssign(request.id)}>
                  Assign to Analyst
                </DropdownMenuItem>
              )}
              {request.status === "assigned" && onComplete && (
                <DropdownMenuItem onClick={() => onComplete(request.id)}>
                  Mark as Complete
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(request.id)}>
                  Edit Due Date
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(request.id)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Request
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{request.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{request.department}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{request.requestType}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {request.description}
        </p>

        {request.assignedTo && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">
              Assigned to: {request.assignedTo.name}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Due: {format(new Date(request.dueDate), "dd/MM/yyyy")}</span>
          </div>
          <span>Created {format(new Date(request.createdAt), "dd/MM/yyyy")}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
