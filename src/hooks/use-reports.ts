import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ALL_STATUSES } from '@/lib/constants'
import type { Report, ReportStatus, Urgency, PaginatedResponse } from '@/lib/types'

interface ReportStats {
  PENDING: number
  IN_PROGRESS: number
  RESOLVED: number
  DISMISSED: number
}

interface Filters {
  status: ReportStatus | 'ALL'
  urgency: Urgency | 'ALL'
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

async function fetchReports(filters: Filters): Promise<Report[]> {
  const { data } = await api.get<PaginatedResponse<Report>>('/reports', {
    params: {
      limit: 100,
      ...(filters.status !== 'ALL' && { status: filters.status }),
      ...(filters.urgency !== 'ALL' && { urgency: filters.urgency }),
    },
  })
  return data.data
}

export function useReports() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>({ status: 'ALL', urgency: 'ALL' })

  const statsQuery = useQuery({
    queryKey: ['reports', 'stats'],
    queryFn: fetchStats,
  })

  const reportsQuery = useQuery({
    queryKey: ['reports', 'list', filters],
    queryFn: () => fetchReports(filters),
  })

  const isLoading = statsQuery.isLoading || reportsQuery.isLoading

  function refetch() {
    queryClient.invalidateQueries({ queryKey: ['reports'] })
  }

  return {
    reports: reportsQuery.data ?? [],
    stats: statsQuery.data ?? { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, DISMISSED: 0 },
    isLoading,
    filters,
    setFilters,
    refetch,
  }
}
