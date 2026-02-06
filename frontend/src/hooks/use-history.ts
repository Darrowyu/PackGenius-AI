import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { HistoryItem } from '@packgenius/shared';

const HISTORY_KEY = ['history'];

export function useHistory(limit = 20) {
  return useQuery({
    queryKey: [...HISTORY_KEY, limit],
    queryFn: () => api.get<HistoryItem[]>(`/history?limit=${limit}`),
  });
}

export function useDeleteHistoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/history/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete<{ success: boolean }>('/history'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}
