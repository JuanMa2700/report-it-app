import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Report, ReportNote, ReportStatus, User } from '@/lib/types'

async function fetchReportDetail(reportId: string) {
  const [reportRes, notesRes, usersRes] = await Promise.all([
    api.get<Report>(`/reports/${reportId}`),
    api.get<ReportNote[]>(`/reports/${reportId}/notes`),
    api.get<User[]>('/users'),
  ])
  return {
    report: reportRes.data,
    notes: notesRes.data,
    vigilants: usersRes.data.filter((u) => u.role === 'VIGILANT' || u.role === 'ADMIN'),
  }
}

export function useReportDetail(reportId: string | null) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => fetchReportDetail(reportId!),
    enabled: !!reportId,
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
    vigilants: data?.vigilants ?? [],
    isLoading,
    updateStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,
    assignVigilant: assignMutation.mutateAsync,
    isAssigning: assignMutation.isPending,
    addNote: noteMutation.mutateAsync,
    isSendingNote: noteMutation.isPending,
  }
}
