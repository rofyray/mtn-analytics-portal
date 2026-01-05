import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function RequestsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        <TableSkeleton rows={10} columns={6} />
      </Card>
    </div>
  )
}
