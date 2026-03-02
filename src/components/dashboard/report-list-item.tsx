import { StatusBadge } from '@/components/common/status-badge'
import { UrgencyBadge } from '@/components/common/urgency-badge'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
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
    <button
      type="button"
      className={cn(
        'w-full cursor-pointer rounded-lg border bg-card px-3 py-2 text-left transition-all hover:shadow-sm',
        isSelected && 'border-primary shadow-sm',
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug line-clamp-1">{report.title}</h4>
        <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(report.createdAt)}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <User className="h-3 w-3" />
        <span className="line-clamp-1">{report.reporter.name}</span>
        <span className="text-border">·</span>
        <span className="shrink-0">{report.category.name}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <StatusBadge status={report.status} />
        <UrgencyBadge urgency={report.urgency} />
      </div>
    </button>
  )
}
