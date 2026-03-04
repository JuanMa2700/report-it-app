import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Notification, PaginatedResponse } from '@/lib/types'

export function useNotifications(page = 1, limit = 20) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Notification>>('/notifications', {
        params: { page, limit },
      })
      return data
    },
  })

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Notification>>('/notifications', {
        params: { read: 'false', limit: 1 },
      })
      return data.total
    },
    refetchInterval: 30_000,
  })

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllRead = useMutation({
    mutationFn: () => api.post('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  return {
    notifications: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    unreadCount: unreadQuery.data ?? 0,
    markRead,
    markAllRead,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  }
}
