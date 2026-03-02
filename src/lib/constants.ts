import type { ReportStatus, Urgency } from './types'

export const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Proceso',
  RESOLVED: 'Resuelto',
  DISMISSED: 'Descartado',
}

export const STATUS_COLORS: Record<ReportStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
  RESOLVED: 'bg-green-100 text-green-800 border-green-300',
  DISMISSED: 'bg-gray-100 text-gray-800 border-gray-300',
}

export const STATUS_MAP_COLORS: Record<ReportStatus, string> = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  RESOLVED: '#22c55e',
  DISMISSED: '#6b7280',
}

export const URGENCY_LABELS: Record<Urgency, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export const URGENCY_COLORS: Record<Urgency, string> = {
  LOW: 'bg-slate-100 text-slate-700 border-slate-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
}

export const MAP_DEFAULT_CENTER: [number, number] = [4.711, -74.0721]
export const MAP_DEFAULT_ZOOM = 13

export const ALL_STATUSES: ReportStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED']
export const ALL_URGENCIES: Urgency[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
