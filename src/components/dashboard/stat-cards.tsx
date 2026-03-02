import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="grid grid-cols-4 gap-4 p-4 pb-0">
      {cards.map(({ status, label, icon: Icon, color, activeColor }) => (
        <Card
          key={status}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            activeFilter === status && `ring-2 ${activeColor}`,
          )}
          onClick={() => onFilterClick(activeFilter === status ? 'ALL' : status)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className={cn('h-5 w-5', color)} />
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-bold', color)}>{stats[status]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
