import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBusinessesByUserIdAction, updateBusinessProfile, toggleStoreStatus } from '@/app/actions/business';
import { BusinessInfo } from '@think-id/types';

const BUSINESSES_QUERY_KEY = ['businesses'];

/**
 * Fetch user's businesses with smart caching
 * - Cache for 5 minutes
 * - Refetches in background when stale
 * - Automatic refetch on window focus
 */
export function useUserBusinesses(userId: string | null) {
  return useQuery({
    queryKey: [...BUSINESSES_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return [];
      const result = await getBusinessesByUserIdAction(userId);
      if (!result.success) throw new Error(result.error);
      console.log('useUserBusinesses - fetched businesses:', result.businesses);
      return result.businesses || [];
    },
    enabled: !!userId, // Only fetch if userId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: 'stale', // Refetch only if stale when window regains focus
    refetchOnReconnect: 'stale',
  });
}

/**
 * Update a business with optimistic updates
 */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const result = await updateBusinessProfile(id, data);
      if (!result.success) throw new Error(result.error);
      return result.business;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: BUSINESSES_QUERY_KEY });

      const previousBusinesses = queryClient.getQueryData<BusinessInfo[]>(BUSINESSES_QUERY_KEY);

      if (previousBusinesses) {
        queryClient.setQueryData(
          BUSINESSES_QUERY_KEY,
          previousBusinesses.map((b) => (b.id === id ? { ...b, ...data } : b))
        );
      }

      return { previousBusinesses };
    },
    onError: (err, variables, context: any) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        queryClient.setQueryData(BUSINESSES_QUERY_KEY, context.previousBusinesses);
      }
    },
    onSuccess: () => {
      // Refetch to ensure server and client are in sync
      queryClient.invalidateQueries({ queryKey: BUSINESSES_QUERY_KEY });
    },
  });
}

/**
 * Toggle store status with optimistic updates
 */
export function useToggleStoreStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isOpen }: { id: string; isOpen: boolean }) => {
      const result = await toggleStoreStatus(id, isOpen);
      if (!result.success) throw new Error(result.error);
      return result.business;
    },
    onMutate: async ({ id, isOpen }) => {
      await queryClient.cancelQueries({ queryKey: BUSINESSES_QUERY_KEY });
      const previousBusinesses = queryClient.getQueryData<BusinessInfo[]>(BUSINESSES_QUERY_KEY);

      if (previousBusinesses) {
        queryClient.setQueryData(
          BUSINESSES_QUERY_KEY,
          previousBusinesses.map((b) => (b.id === id ? { ...b, isManuallyOpen: isOpen } : b))
        );
      }

      return { previousBusinesses };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousBusinesses) {
        queryClient.setQueryData(BUSINESSES_QUERY_KEY, context.previousBusinesses);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESSES_QUERY_KEY });
    },
  });
}

/**
 * Manually refetch businesses (useful for manual refresh buttons)
 */
export function useRefreshBusinesses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: BUSINESSES_QUERY_KEY });
}
