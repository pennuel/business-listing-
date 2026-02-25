"use client";

import { useEffect } from "react";
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { fetchUserById } from "@/app/actions/user";

interface UseUserSyncProps {
  userId: string;
}

/**
 * Hook to initialize and manage user data in TanStack Query cache
 * - Fetch user data from server using `userId`
 * - Cache user under `['user', userId]` on mount
 * - Periodically sync user data with database
 */
export function useUserSync({ userId }: UseUserSyncProps) {
  const queryClient = useQueryClient();

  // Fetch and initialize user data on mount
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const result = await fetchUserById(userId);

        console.log("useUserSync - fetchUserData result:", result);

        if (result.success && result.user) {
          console.log("useUserSync - cached user:", result.user);
          // Cache user in QueryClient under ['user', userId]
          queryClient.setQueryData(['user', userId], result.user);
        } else {
          console.warn('useUserSync - failed to fetch user:', result.error);
          // Optionally set an error key
          queryClient.setQueryData(['user', userId, 'error'], result.error || 'Failed to fetch user');
        }
      } catch (error: any) {
        console.error("useUserSync - error:", error);
        queryClient.setQueryData(['user', userId, 'error'], error.message || 'Failed to fetch user');
      }
    };

    fetchUserData();
  }, [userId, queryClient]);

  // Periodic sync - refetch user data every 30 minutes
  useEffect(() => {
    if (!userId) return;

    const syncInterval = setInterval(
      async () => {
        try {
          const result = await fetchUserById(userId);

          if (result.success && result.user) {
            queryClient.setQueryData(['user', userId], result.user);
          } else {
            queryClient.setQueryData(['user', userId, 'error'], result.error || 'Failed to sync user');
          }
        } catch (error: any) {
          queryClient.setQueryData(['user', userId, 'error'], error.message || 'Failed to sync user');
        }
      },
      30 * 60 * 1000,
    ); // 30 minutes

    return () => clearInterval(syncInterval);
  }, [userId, queryClient]);
}

/**
 * Hook to manually refresh user data
 */
export async function manualSyncUserWithQuery(queryClient: QueryClient, userId: string) {
  const result = await fetchUserById(userId);
  if (result.success && result.user) {
    queryClient.setQueryData(['user', userId], result.user);
    return result;
  }
  queryClient.setQueryData(['user', userId, 'error'], result.error || 'Failed to sync user');
  return result;
}
