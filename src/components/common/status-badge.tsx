import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import type { ReportStatus } from '@/lib/types'

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <Badge variant="outline" className={STATUS_COLORS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
