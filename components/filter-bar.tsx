"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type FilterStatus = "all" | "pending" | "assigned" | "completed"

interface FilterBarProps {
  activeFilter: FilterStatus
  onFilterChange: (filter: FilterStatus) => void
  counts: {
    all: number
    pending: number
    assigned: number
    completed: number
  }
}

const filters: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "completed", label: "Completed" },
]

export function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-card border rounded-lg">
      <span className="text-sm font-medium text-muted-foreground mr-2">Filter:</span>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "relative",
            activeFilter === filter.value && "shadow-sm"
          )}
        >
          {filter.label}
          <Badge
            variant="secondary"
            className={cn(
              "ml-2 min-w-[1.5rem] justify-center",
              activeFilter === filter.value
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted"
            )}
          >
            {counts[filter.value]}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
