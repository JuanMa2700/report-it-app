import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Bell, RefreshCw, UserCheck, MessageSquare, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/types'

const TYPE_ICONS = {
  STATUS_CHANGED: RefreshCw,
  REPORT_ASSIGNED: UserCheck,
  NOTE_ADDED: MessageSquare,
} as const

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

function NotificationItem({
  notification,
  onSelect,
}: {
  notification: Notification
  onSelect: (n: Notification) => void
}) {
  const Icon = TYPE_ICONS[notification.type] || Bell
  return (
    <button
      onClick={() => onSelect(notification)}
      className={cn(
        'flex w-full cursor-pointer gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-accent',
        !notification.read && 'bg-violet-50',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          notification.read ? 'bg-muted' : 'bg-primary/10',
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4',
            notification.read ? 'text-muted-foreground' : 'text-primary',
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm leading-snug',
            notification.read ? 'text-muted-foreground' : 'font-semibold text-foreground',
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
          {notification.body}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          {formatRelative(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(1, 10)

  const handleSelect = (n: Notification) => {
    if (!n.read) markRead.mutate(n.id)
    setOpen(false)
    if (n.reportId) {
      navigate(`/dashboard?reportId=${n.reportId}`)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 cursor-pointer">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="z-[9999] w-96 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer px-2 py-1 text-xs text-primary hover:text-primary"
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Marcar todas
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[420px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center py-10">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Sin notificaciones</p>
            </div>
          ) : (
            <div className="p-1.5">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="border-t px-3 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="w-full cursor-pointer py-1.5 text-sm font-medium text-primary hover:text-primary"
              onClick={() => {
                setOpen(false)
                navigate('/notifications')
              }}
            >
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
