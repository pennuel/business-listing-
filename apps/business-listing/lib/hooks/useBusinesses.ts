import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBusinessesByUserIdAction,
  getBusinessByIdAction,
  updateBusinessProfile,
  toggleStoreStatus,
} from "@/app/actions/business";
import {
  addService,
  deleteService,
  updateService,
} from "@/app/actions/services";
import { addBrandingImage, deleteBrandingImage } from "@/app/actions/branding";

// ─── Query keys ─────────────────────────────────────────────────────────────
export const businessKeys = {
  all: ["businesses"] as const,
  byUser: (userId: string) => ["businesses", userId] as const,
  byId: (id: string) => ["business", id] as const,
  services: (businessId: string) => ["services", businessId] as const,
};

// ─── Businesses by user ──────────────────────────────────────────────────────

/**
 * Fetch all businesses for a user. Used by the sidebar switcher and
 * dashboard header. Supports initialData for server-side prefetch.
 * Keeps data fresh for collaborative editing scenarios.
 */
export function useUserBusinesses(
  userId: string | null,
  options?: { initialData?: any[] },
) {
  return useQuery({
    queryKey: userId ? businessKeys.byUser(userId) : businessKeys.all,
    queryFn: async () => {
      console.log("Fetching businesses for userId:", userId);
      if (!userId) return [];
      const result = await getBusinessesByUserIdAction(userId);
      if (!result.success) throw new Error(result.error);
      return result.businesses || [];
    },
    initialData: options?.initialData,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 min - fresh for collaborative editing
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5 * 60 * 1000, // Background refresh every 5 min
  });
}

// ─── Single business by ID ───────────────────────────────────────────────────

/**
 * Fetch a single business by ID. Used by dashboard pages that receive a
 * businessId from the URL. Keeps the client in sync after mutations without
 * a full page reload.
 */
export function useBusinessById(
  businessId: string | null | undefined,
  options?: { initialData?: any },
) {
  return useQuery({
    queryKey: businessId ? businessKeys.byId(businessId) : ["business"],
    queryFn: async () => {
      if (!businessId) return null;
      const result = await getBusinessByIdAction(businessId);
      if (!result.success) throw new Error(result.error as string);
      return result.business ?? null;
    },
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...(options?.initialData !== undefined && {
      initialData: options.initialData,
    }),
  });
}

// ─── Services for a business ─────────────────────────────────────────────────

/**
 * Services are embedded in the business object. This hook derives them from
 * the already-cached business so there's no extra network request.
 */
export function useServices(
  businessId: string | null | undefined,
  options?: { initialData?: any },
) {
  const businessQuery = useBusinessById(businessId, options);
  return {
    ...businessQuery,
    data: (businessQuery.data as any)?.services ?? [],
  };
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Toggle store open/closed with optimistic update.
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
      await queryClient.cancelQueries({ queryKey: businessKeys.byId(id) });
      const prev = queryClient.getQueryData(businessKeys.byId(id));
      queryClient.setQueryData(businessKeys.byId(id), (old: any) =>
        old ? { ...old, isManuallyOpen: isOpen } : old,
      );
      return { prev };
    },
    onError: (_err, { id }, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(businessKeys.byId(id), context.prev);
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.byId(id) });
    },
  });
}

/**
 * Update a business profile with optimistic update.
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
      await queryClient.cancelQueries({ queryKey: businessKeys.byId(id) });
      await queryClient.cancelQueries({ queryKey: businessKeys.all });

      const prev = queryClient.getQueryData(businessKeys.byId(id));

      queryClient.setQueryData(businessKeys.byId(id), (old: any) =>
        old ? { ...old, ...data } : old,
      );

      // Optimistically update the sidebar's list of businesses
      queryClient.setQueriesData({ queryKey: businessKeys.all }, (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((b) => (b.id === id ? { ...b, ...data } : b));
      });

      return { prev };
    },
    onError: (_err, { id }, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(businessKeys.byId(id), context.prev);
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.byId(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
}

/**
 * Add a service to a business. Invalidates the business cache so
 * the services list re-renders immediately.
 */
export function useAddService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      businessId: string;
      name: string;
      price: number;
      currency: string;
      duration: number;
      description?: string;
    }) => {
      const result = await addService(data);
      if (!result.success) throw new Error(result.error);
      return result.service;
    },
    onSuccess: (_data, { businessId }) => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.byId(businessId),
      });
    },
  });
}

/**
 * Delete a service. Optimistically removes it from the business cache.
 */
export function useDeleteService(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const result = await deleteService(serviceId);
      if (!result.success) throw new Error(result.error);
      return serviceId;
    },
    onMutate: async (serviceId) => {
      await queryClient.cancelQueries({
        queryKey: businessKeys.byId(businessId),
      });
      const prev = queryClient.getQueryData(businessKeys.byId(businessId));
      queryClient.setQueryData(businessKeys.byId(businessId), (old: any) =>
        old
          ? {
              ...old,
              services: old.services?.filter((s: any) => s.id !== serviceId),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _serviceId, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(businessKeys.byId(businessId), context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.byId(businessId),
      });
    },
  });
}

/**
 * Update a service. Optimistically patches the service in the business cache.
 */
export function useUpdateService(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const result = await updateService(id, data);
      if (!result.success) throw new Error(result.error);
      return result.service;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: businessKeys.byId(businessId),
      });
      const prev = queryClient.getQueryData(businessKeys.byId(businessId));
      queryClient.setQueryData(businessKeys.byId(businessId), (old: any) =>
        old
          ? {
              ...old,
              services: old.services?.map((s: any) =>
                s.id === id ? { ...s, ...data } : s,
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(businessKeys.byId(businessId), context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.byId(businessId),
      });
    },
  });
}

/**
 * Manually refetch all business queries (useful for pull-to-refresh patterns).
 */
export function useRefreshBusinesses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: businessKeys.all });
}

/**
 * Add a gallery image to a business via the Branding table.
 * Optimistically appends to the branding array in the cache.
 */
export function useAddBrandingImage(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mediaUrl,
      link,
    }: {
      mediaUrl: string;
      link?: string;
    }) => {
      const result = await addBrandingImage(businessId, mediaUrl, link);
      if (!result.success) throw new Error(result.error);
      return result.image;
    },
    onMutate: async ({ mediaUrl, link }) => {
      await queryClient.cancelQueries({
        queryKey: businessKeys.byId(businessId),
      });
      const prev = queryClient.getQueryData(businessKeys.byId(businessId));
      queryClient.setQueryData(businessKeys.byId(businessId), (old: any) =>
        old
          ? {
              ...old,
              branding: [
                ...(old.branding ?? []),
                { brandId: Date.now(), mediaUrl, link: link ?? null },
              ],
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(businessKeys.byId(businessId), context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.byId(businessId),
      });
    },
  });
}

/**
 * Delete a gallery image from the Branding table.
 * Optimistically removes it from the cache.
 */
export function useDeleteBrandingImage(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandId: string) => {
      const result = await deleteBrandingImage(businessId, brandId);
      if (!result.success) throw new Error(result.error);
      return brandId;
    },
    onMutate: async (brandId) => {
      await queryClient.cancelQueries({
        queryKey: businessKeys.byId(businessId),
      });
      const prev = queryClient.getQueryData(businessKeys.byId(businessId));
      queryClient.setQueryData(businessKeys.byId(businessId), (old: any) =>
        old
          ? {
              ...old,
              branding: (old.branding ?? []).filter(
                (b: any) => String(b.brandId) !== String(brandId),
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.prev)
        queryClient.setQueryData(businessKeys.byId(businessId), context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.byId(businessId),
      });
    },
  });
}
