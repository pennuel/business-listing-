"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserById,
  updateUserProfile,
} from "@/app/actions/profile/user-actions";
import { UpdateUserRequest } from "@think-id/types";
import { User } from "@/types/user";

// ─────────────────────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────────────────────
export const userQueryKeys = {
  all: ["user"] as const,
  byId: (id: string) => ["user", id] as const,
};

// ─────────────────────────────────────────────────────────────
// useUserQuery — fetch the full FusionAuth user profile
// ─────────────────────────────────────────────────────────────
export function useUserQuery(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? userQueryKeys.byId(userId) : userQueryKeys.all,
    queryFn: async () => {
      if (!userId) return null;
      const result = await fetchUserById(userId);
      // Return the API user or null — never throw so the UI can show fallback
      if (result.success && result.user) {
        return result.user as unknown as User;
      }
      return null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes — profile rarely changes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Fail fast; don't spam the API
    refetchOnWindowFocus: false,
  });
}

// ─────────────────────────────────────────────────────────────
// useUpdateUser — optimistically update the FusionAuth profile
// ─────────────────────────────────────────────────────────────
export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserProfile(userId, data),
    onSuccess: (result) => {
      if (result.success && result.user) {
        // Update TanStack cache immediately — no refetch needed
        queryClient.setQueryData(
          userQueryKeys.byId(userId),
          result.user as unknown as User,
        );
      }
    },
  });
}
