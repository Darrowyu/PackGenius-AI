import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BoxItem } from '@packgenius/shared';

const INVENTORY_KEY = ['inventory'];

export function useInventory() {
  return useQuery({
    queryKey: INVENTORY_KEY,
    queryFn: () => api.get<BoxItem[]>('/inventory'),
  });
}

export function useAddInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: Omit<BoxItem, 'created_at'> | Omit<BoxItem, 'created_at'>[]) =>
      api.post<{ success: boolean; count?: number }>('/inventory', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEY });
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEY });
    },
  });
}
