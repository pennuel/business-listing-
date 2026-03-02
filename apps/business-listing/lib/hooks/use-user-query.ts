"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/app/actions/user";
import { User } from "@think-id/types";

interface UseUserQueryProps {
  userId?: string;
}

/**
 * Fetches the full FusionAuth user profile via the Spring Boot API.
 * Returns null (rather than throwing) when the API is unavailable,
 * so the UI can gracefully fall back to next-auth session data.
 */
export function useUserQuery({ userId }: UseUserQueryProps = {}) {
  return useQuery({
    queryKey: userId ? ["user", userId] : ["user"],
    queryFn: async (): Promise<User | null> => {
      if (!userId) return null;
      try {
        const result = await fetchUserById(userId);
        if (result.success && result.user) {
          return result.user as User;
        }
        return null;
      } catch (err) {
        console.warn("[useUserQuery] Failed to fetch user from API:", err);
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry – fail fast and fall back to session
    refetchOnWindowFocus: false,
  });
}
