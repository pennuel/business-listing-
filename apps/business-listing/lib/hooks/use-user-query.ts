'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/app/actions/user';
import { User } from '@think-id/types';

interface UseUserQueryProps {
  userId?: string;
}

/**
 * Hook for fetching user data with TanStack Query
 * Handles caching, background refetching, and stale data management
 * 
 * @param userId - Optional user ID to fetch. If provided, will use direct userId-based fetch.
 *                 If not provided, will attempt to use session (legacy fallback).
 */
export function useUserQuery({ userId }: UseUserQueryProps = {}) {
  return useQuery({
    queryKey: userId ? ['user', userId] : ['user'],
    queryFn: async (): Promise<User | null> => {
      if (!userId) {
        throw new Error('userId is required for useUserQuery');
      }
      const result = await fetchUserById(userId);
      if (result.success && result.user) {
        return result.user;
      }
      throw new Error(result.error || 'Failed to fetch user');
    },
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    retry: 1,
    refetchOnWindowFocus: true,
  });
}
