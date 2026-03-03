import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  ALL_STATUSES,
  ALL_URGENCIES,
  STATUS_LABELS,
  STATUS_MAP_COLORS,
  URGENCY_LABELS,
  URGENCY_MAP_COLORS,
  ROLE_COLORS,
  ROLE_LABELS,
} from '@/lib/constants'
import type {
  Category,
  PaginatedResponse,
  Report,
  Role,
  Urgency,
  User,
} from '@/lib/types'

interface ReportStats {
  PENDING: number
  IN_PROGRESS: number
  RESOLVED: number
  DISMISSED: number
}

async function fetchStats(): Promise<ReportStats> {
  const results = await Promise.all(
    ALL_STATUSES.map((status) =>
      api.get<PaginatedResponse<Report>>('/reports', { params: { status, limit: 1 } }),
    ),
  )
  const stats: ReportStats = { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, DISMISSED: 0 }
  ALL_STATUSES.forEach((status, i) => {
    stats[status] = results[i].data.total
  })
  return stats
}

async function fetchUrgencyStats(): Promise<Record<Urgency, number>> {
  const results = await Promise.all(
    ALL_URGENCIES.map((urgency) =>
      api.get<PaginatedResponse<Report>>('/reports', { params: { urgency, limit: 1 } }),
    ),
  )
  const stats = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 } as Record<Urgency, number>
  ALL_URGENCIES.forEach((urgency, i) => {
    stats[urgency] = results[i].data.total
  })
  return stats
}

async function fetchAllReports(): Promise<Report[]> {
  const { data } = await api.get<PaginatedResponse<Report>>('/reports', {
    params: { limit: 100 },
  })
  return data.data
}

async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories')
  return data
}

async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users')
  return data
}

function generateTrendData() {
  const data: { date: string; reportes: number }[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const base = isWeekend ? 2 : 5
    const variance = Math.floor(Math.random() * 4)
    data.push({
      date: date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
      reportes: base + variance,
    })
  }
  return data
}

export function useAnalytics() {
  const statsQuery = useQuery({
    queryKey: ['reports', 'stats'],
    queryFn: fetchStats,
  })

  const urgencyQuery = useQuery({
    queryKey: ['analytics', 'urgency-stats'],
    queryFn: fetchUrgencyStats,
  })

  const reportsQuery = useQuery({
    queryKey: ['reports', 'list', { status: 'ALL', urgency: 'ALL' }],
    queryFn: fetchAllReports,
  })

  const categoriesQuery = useQuery({
    queryKey: ['analytics', 'categories'],
    queryFn: fetchCategories,
  })

  const usersQuery = useQuery({
    queryKey: ['analytics', 'users'],
    queryFn: fetchUsers,
  })

  const stats = statsQuery.data
  const urgencyStats = urgencyQuery.data
  const reports = reportsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const users = usersQuery.data ?? []

  const totalReports = useMemo(() => {
    if (!stats) return 0
    return stats.PENDING + stats.IN_PROGRESS + stats.RESOLVED + stats.DISMISSED
  }, [stats])

  const resolvedRate = useMemo(() => {
    if (!stats || totalReports === 0) return 0
    return Math.round((stats.RESOLVED / totalReports) * 100)
  }, [stats, totalReports])

  const avgResolutionHours = useMemo(() => {
    const resolved = reports.filter((r) => r.status === 'RESOLVED' && r.resolvedAt)
    if (resolved.length === 0) return 0
    const totalHours = resolved.reduce((sum, r) => {
      const created = new Date(r.createdAt).getTime()
      const resolvedAt = new Date(r.resolvedAt!).getTime()
      return sum + (resolvedAt - created) / (1000 * 60 * 60)
    }, 0)
    return Math.round(totalHours / resolved.length)
  }, [reports])

  const totalUsers = users.length

  const statusData = useMemo(() => {
    if (!stats) return []
    return ALL_STATUSES.map((status) => ({
      name: STATUS_LABELS[status],
      value: stats[status],
      fill: STATUS_MAP_COLORS[status],
    }))
  }, [stats])

  const urgencyData = useMemo(() => {
    if (!urgencyStats) return []
    return ALL_URGENCIES.map((urgency) => ({
      name: URGENCY_LABELS[urgency],
      value: urgencyStats[urgency],
      fill: URGENCY_MAP_COLORS[urgency],
    }))
  }, [urgencyStats])

  const categoryData = useMemo(() => {
    if (reports.length === 0) return []
    const catMap = new Map<string, { name: string; count: number }>()
    for (const r of reports) {
      const existing = catMap.get(r.categoryId)
      if (existing) {
        existing.count++
      } else {
        const cat = categories.find((c) => c.id === r.categoryId)
        catMap.set(r.categoryId, { name: cat?.name ?? r.category?.name ?? 'Sin categoría', count: 1 })
      }
    }
    return Array.from(catMap.values())
      .map((c) => ({ name: c.name, value: c.count, fill: '#8b5cf6' }))
      .sort((a, b) => b.value - a.value)
  }, [reports, categories])

  const roleData = useMemo(() => {
    if (users.length === 0) return []
    const roleMap = new Map<Role, number>()
    for (const u of users) {
      roleMap.set(u.role, (roleMap.get(u.role) ?? 0) + 1)
    }
    return Array.from(roleMap.entries()).map(([role, count]) => ({
      name: ROLE_LABELS[role],
      value: count,
      fill: ROLE_COLORS[role],
    }))
  }, [users])

  const trendData = useMemo(() => generateTrendData(), [])

  const isLoading =
    statsQuery.isLoading ||
    urgencyQuery.isLoading ||
    reportsQuery.isLoading ||
    categoriesQuery.isLoading ||
    usersQuery.isLoading

  return {
    isLoading,
    totalReports,
    resolvedRate,
    avgResolutionHours,
    totalUsers,
    statusData,
    urgencyData,
    categoryData,
    roleData,
    trendData,
  }
}
