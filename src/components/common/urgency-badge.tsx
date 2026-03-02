import { Badge } from '@/components/ui/badge'
import { URGENCY_LABELS, URGENCY_COLORS } from '@/lib/constants'
import type { Urgency } from '@/lib/types'

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <Badge variant="outline" className={URGENCY_COLORS[urgency]}>
      {URGENCY_LABELS[urgency]}
    </Badge>
  )
}
