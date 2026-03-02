import { useState, useEffect, useCallback, useRef } from 'react'
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

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<ReportStats>({ PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, DISMISSED: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ status: 'ALL', urgency: 'ALL' })
  const statsLoaded = useRef(false)

  // Fetch stats only once on mount (and on explicit refetch)
  const fetchStats = useCallback(async () => {
    const results = await Promise.all(
      ALL_STATUSES.map((status) =>
        api.get<PaginatedResponse<Report>>('/reports', { params: { status, limit: 1 } }),
      ),
    )
    const newStats: ReportStats = { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, DISMISSED: 0 }
    ALL_STATUSES.forEach((status, i) => {
      newStats[status] = results[i].data.total
    })
    setStats(newStats)
  }, [])

  // Fetch filtered list
  const fetchList = useCallback(async () => {
    const { data } = await api.get<PaginatedResponse<Report>>('/reports', {
      params: {
        limit: 100,
        ...(filters.status !== 'ALL' && { status: filters.status }),
        ...(filters.urgency !== 'ALL' && { urgency: filters.urgency }),
      },
    })
    setReports(data.data)
  }, [filters])

  // On mount: load stats + list
  // On filter change: only reload list
  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      try {
        if (!statsLoaded.current) {
          await Promise.all([fetchStats(), fetchList()])
          statsLoaded.current = true
        } else {
          await fetchList()
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch reports:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [fetchStats, fetchList])

  // Explicit refetch reloads both stats and list
  const refetch = useCallback(async () => {
    try {
      await Promise.all([fetchStats(), fetchList()])
    } catch (err) {
      console.error('Failed to refetch reports:', err)
    }
  }, [fetchStats, fetchList])

  return { reports, stats, isLoading, filters, setFilters, refetch }
}
