import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Bell, RefreshCw, UserCheck, MessageSquare, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/types'

const TYPE_ICONS = {
  STATUS_CHANGED: RefreshCw,
  REPORT_ASSIGNED: UserCheck,
  NOTE_ADDED: MessageSquare,
} as const

const TYPE_LABELS: Record<string, string> = {
  STATUS_CHANGED: 'Cambio de estado',
  REPORT_ASSIGNED: 'Reporte asignado',
  NOTE_ADDED: 'Nueva nota',
}

const TYPE_COLORS: Record<string, string> = {
  STATUS_CHANGED: 'text-blue-600 bg-blue-50',
  REPORT_ASSIGNED: 'text-amber-600 bg-amber-50',
  NOTE_ADDED: 'text-green-600 bg-green-50',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function NotificationRow({
  notification,
  onSelect,
  onMarkRead,
}: {
  notification: Notification
  onSelect: (n: Notification) => void
  onMarkRead: (id: string) => void
}) {
  const Icon = TYPE_ICONS[notification.type] || Bell
  const colorClass = TYPE_COLORS[notification.type] || 'text-muted-foreground bg-muted'

  return (
    <button
      onClick={() => onSelect(notification)}
      className={cn(
        'flex w-full cursor-pointer items-start gap-4 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-accent',
        notification.read ? 'border-border bg-card' : 'border-violet-200 bg-violet-50/60',
      )}
    >
      <div className={cn('mt-0.5 rounded-md p-1.5', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className={cn('text-sm', notification.read ? 'text-muted-foreground' : 'font-semibold text-foreground')}>
              {notification.title}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{notification.body}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-muted-foreground/70">{formatDate(notification.createdAt)}</span>
            {!notification.read && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', colorClass)}>
            {TYPE_LABELS[notification.type] || notification.type}
          </span>
          {!notification.read && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead(notification.id)
              }}
              className="cursor-pointer text-xs text-primary hover:underline"
            >
              Marcar como leida
            </button>
          )}
        </div>
      </div>
    </button>
  )
}

export function NotificationsPage() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { notifications, total, totalPages, isLoading, unreadCount, markRead, markAllRead } =
    useNotifications(page, 20)

  const handleSelect = (n: Notification) => {
    if (!n.read) markRead.mutate(n.id)
    if (n.reportId) {
      navigate(`/dashboard?reportId=${n.reportId}`)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Notificaciones</h1>
          <p className="text-sm text-muted-foreground">
            {total} notificacion{total !== 1 ? 'es' : ''}{unreadCount > 0 && ` · ${unreadCount} sin leer`}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="mr-1.5 h-4 w-4" />
            Marcar todas como leidas
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Bell className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">Sin notificaciones</p>
            <p className="text-sm text-muted-foreground/70">Te avisaremos cuando haya novedades</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onSelect={handleSelect}
                onMarkRead={(id) => markRead.mutate(id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
