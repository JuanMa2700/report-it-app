import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Report, ReportNote, ReportStatus, User } from '@/lib/types'

export function useReportDetail(reportId: string | null) {
  const [report, setReport] = useState<Report | null>(null)
  const [notes, setNotes] = useState<ReportNote[]>([])
  const [vigilants, setVigilants] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchReport = useCallback(async () => {
    if (!reportId) {
      setReport(null)
      setNotes([])
      return
    }
    setIsLoading(true)
    try {
      const [reportRes, notesRes, usersRes] = await Promise.all([
        api.get<Report>(`/reports/${reportId}`),
        api.get<ReportNote[]>(`/reports/${reportId}/notes`),
        api.get<User[]>('/users'),
      ])
      setReport(reportRes.data)
      setNotes(notesRes.data)
      setVigilants(usersRes.data.filter((u) => u.role === 'VIGILANT' || u.role === 'ADMIN'))
    } catch (err) {
      console.error('Failed to fetch report detail:', err)
    } finally {
      setIsLoading(false)
    }
  }, [reportId])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const updateStatus = useCallback(
    async (status: ReportStatus) => {
      if (!reportId) return
      const { data } = await api.patch<Report>(`/reports/${reportId}/status`, { status })
      setReport(data)
    },
    [reportId],
  )

  const assignVigilant = useCallback(
    async (assignedToId: string) => {
      if (!reportId) return
      const { data } = await api.patch<Report>(`/reports/${reportId}/assign`, { assignedToId })
      setReport(data)
    },
    [reportId],
  )

  const addNote = useCallback(
    async (content: string) => {
      if (!reportId) return
      const { data } = await api.post<ReportNote>(`/reports/${reportId}/notes`, { content })
      setNotes((prev) => [data, ...prev])
    },
    [reportId],
  )

  return { report, notes, vigilants, isLoading, updateStatus, assignVigilant, addNote, refetch: fetchReport }
}
