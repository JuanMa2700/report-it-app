import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/api'
import type { Report, ReportNote, ReportStatus, User } from '@/lib/types'

async function fetchReportAndNotes(reportId: string) {
  const [reportRes, notesRes] = await Promise.all([
    api.get<Report>(`/reports/${reportId}`),
    api.get<ReportNote[]>(`/reports/${reportId}/notes`),
  ])
  return { report: reportRes.data, notes: notesRes.data }
}

export function useReportDetail(reportId: string | null) {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => fetchReportAndNotes(reportId!),
    enabled: !!reportId,
  })

  const { data: vigilants = [] } = useQuery({
    queryKey: ['users', 'vigilants'],
    queryFn: async () => {
      const res = await api.get<User[]>('/users/vigilants')
      return res.data
    },
    enabled: user?.role === 'ADMIN' || user?.role === 'VIGILANT',
  })

  const statusMutation = useMutation({
    mutationFn: (status: ReportStatus) =>
      api.patch<Report>(`/reports/${reportId}/status`, { status }),
    onSuccess: (res) => {
      queryClient.setQueryData(['report', reportId], (old: typeof data) =>
        old ? { ...old, report: { ...old.report, ...res.data } } : old,
      )
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })

  const assignMutation = useMutation({
    mutationFn: (assignedToId: string) =>
      api.patch<Report>(`/reports/${reportId}/assign`, { assignedToId }),
    onSuccess: (res) => {
      queryClient.setQueryData(['report', reportId], (old: typeof data) =>
        old ? { ...old, report: { ...old.report, ...res.data } } : old,
      )
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })

  const noteMutation = useMutation({
    mutationFn: (content: string) =>
      api.post<ReportNote>(`/reports/${reportId}/notes`, { content }),
    onSuccess: (res) => {
      queryClient.setQueryData(['report', reportId], (old: typeof data) =>
        old ? { ...old, notes: [res.data, ...old.notes] } : old,
      )
    },
  })

  return {
    report: data?.report ?? null,
    notes: data?.notes ?? [],
    vigilants,
    isLoading,
    updateStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,
    assignVigilant: assignMutation.mutateAsync,
    isAssigning: assignMutation.isPending,
    addNote: noteMutation.mutateAsync,
    isSendingNote: noteMutation.isPending,
  }
}
