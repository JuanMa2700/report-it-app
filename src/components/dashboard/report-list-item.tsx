import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { UrgencyBadge } from '@/components/common/urgency-badge'
import { cn } from '@/lib/utils'
import type { Report } from '@/lib/types'

interface ReportListItemProps {
  report: Report
  isSelected: boolean
  onClick: () => void
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'hace un momento'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

export function ReportListItem({ report, isSelected, onClick }: ReportListItemProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'border-primary shadow-md',
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-1">{report.title}</h4>
          <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(report.createdAt)}</span>
        </div>
        <p className="mb-2 text-xs text-muted-foreground">{report.category.name}</p>
        <div className="flex items-center gap-2">
          <StatusBadge status={report.status} />
          <UrgencyBadge urgency={report.urgency} />
        </div>
      </CardContent>
    </Card>
  )
}
