import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportStatus } from '@/lib/types'

interface StatCardsProps {
  stats: Record<ReportStatus, number>
  activeFilter: ReportStatus | 'ALL'
  onFilterClick: (status: ReportStatus | 'ALL') => void
}

const cards: { status: ReportStatus; label: string; icon: typeof Clock; color: string; activeColor: string }[] = [
  { status: 'PENDING', label: 'Pendientes', icon: Clock, color: 'text-amber-600', activeColor: 'ring-amber-400' },
  { status: 'IN_PROGRESS', label: 'En Proceso', icon: Loader2, color: 'text-blue-600', activeColor: 'ring-blue-400' },
  { status: 'RESOLVED', label: 'Resueltos', icon: CheckCircle2, color: 'text-green-600', activeColor: 'ring-green-400' },
  { status: 'DISMISSED', label: 'Descartados', icon: XCircle, color: 'text-gray-600', activeColor: 'ring-gray-400' },
]

export function StatCards({ stats, activeFilter, onFilterClick }: StatCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map(({ status, label, icon: Icon, color, activeColor }) => (
        <button
          key={status}
          type="button"
          className={cn(
            'flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-left shadow-sm transition-all hover:shadow-md',
            activeFilter === status && `ring-2 ${activeColor}`,
          )}
          onClick={() => onFilterClick(activeFilter === status ? 'ALL' : status)}
        >
          <Icon className={cn('h-5 w-5 shrink-0', color)} />
          <div className="min-w-0">
            <div className={cn('text-xl font-bold leading-tight', color)}>{stats[status]}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
