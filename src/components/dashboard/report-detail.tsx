import { useState, type FormEvent } from 'react'
import { useReportDetail } from '@/hooks/use-report-detail'
import { StatusBadge } from '@/components/common/status-badge'
import { UrgencyBadge } from '@/components/common/urgency-badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STATUS_LABELS, URGENCY_LABELS, ALL_STATUSES } from '@/lib/constants'
import { ReportMediaGallery } from './report-media-gallery'
import { ArrowLeft, MapPin, User, Calendar, Tag, Send, AlertTriangle, MessageSquare, Loader2 } from 'lucide-react'
import type { ReportStatus } from '@/lib/types'

interface ReportDetailProps {
  reportId: string
  onBack: () => void
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ReportDetail({ reportId, onBack }: ReportDetailProps) {
  const {
    report, notes, vigilants, isLoading,
    updateStatus, isUpdatingStatus,
    assignVigilant, isAssigning,
    addNote, isSendingNote,
  } = useReportDetail(reportId)
  const [noteText, setNoteText] = useState('')
  const [actionError, setActionError] = useState('')

  async function handleStatusChange(status: string) {
    setActionError('')
    try {
      await updateStatus(status as ReportStatus)
    } catch {
      setActionError('Error al actualizar estado')
    }
  }

  async function handleAssign(userId: string) {
    if (userId === 'unassigned') return
    setActionError('')
    try {
      await assignVigilant(userId)
    } catch {
      setActionError('Error al asignar vigilante')
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault()
    if (!noteText.trim()) return
    try {
      await addNote(noteText.trim())
      setNoteText('')
    } catch {
      setActionError('Error al agregar nota')
    }
  }

  if (isLoading || !report) {
    return (
      <div className="flex h-full flex-col rounded-lg border bg-background">
        <div className="flex shrink-0 items-center gap-2 border-b p-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Cargando...</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col rounded-lg border bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b p-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Detalle del reporte</span>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {/* Title + badges */}
            <div>
              <h2 className="text-base font-semibold leading-tight">{report.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={report.status} />
                <UrgencyBadge urgency={report.urgency} />
              </div>
            </div>

            {/* Meta info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span>{report.category.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{report.reporter.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
              {(report.latitude || report.manualAddress) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{report.manualAddress ?? `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Descripción</h3>
              <p className="text-sm leading-relaxed">{report.description}</p>
            </div>

            {/* Media */}
            <ReportMediaGallery media={report.media} />

            {/* Actions */}
            <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  Estado
                  {isUpdatingStatus && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                </label>
                <Select value={report.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                  <SelectTrigger className="h-9 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer">{STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
                  Asignado a
                  {isAssigning && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                </label>
                <Select
                  value={report.assignedToId ?? 'unassigned'}
                  onValueChange={handleAssign}
                  disabled={isAssigning}
                >
                  <SelectTrigger className="h-9 cursor-pointer">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned" disabled>Sin asignar</SelectItem>
                    {vigilants.map((v) => (
                      <SelectItem key={v.id} value={v.id} className="cursor-pointer">{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {actionError && (
                <p className="text-xs text-destructive">{actionError}</p>
              )}
            </div>

            {/* Urgency info */}
            {(report.urgency === 'HIGH' || report.urgency === 'CRITICAL') && (
              <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Urgencia {URGENCY_LABELS[report.urgency].toLowerCase()} — requiere atención prioritaria</span>
              </div>
            )}

            {/* Notes */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  Notas ({notes.length})
                </h3>
              </div>

              <form onSubmit={handleAddNote} className="mb-3 flex gap-2">
                <Input
                  placeholder="Agregar nota..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="h-9 text-sm"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0 cursor-pointer" disabled={!noteText.trim() || isSendingNote}>
                  {isSendingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>

              {notes.length === 0 ? (
                <p className="py-2 text-center text-xs text-muted-foreground">Sin notas aún</p>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-md border bg-muted/30 p-2.5">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium">{note.author.name}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(note.createdAt)}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
