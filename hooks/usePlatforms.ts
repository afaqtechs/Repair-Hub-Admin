import { Platform } from '@/types/platform';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { platformsApi } from '../api/platforms.api';

// Query Keys setup
export const PLATFORM_KEYS = {
  all: ['platforms'] as const,
  lists: () => [...PLATFORM_KEYS.all, 'list'] as const,
  details: () => [...PLATFORM_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PLATFORM_KEYS.details(), id] as const,

    part: () => [...PLATFORM_KEYS.all, "part"] as const,

    platformParts: (platformId: string) =>
    [...PLATFORM_KEYS.part(), platformId] as const,

  service: () => [...PLATFORM_KEYS.all, "service"] as const,

  platformServices: (platformId: string) =>
    [...PLATFORM_KEYS.service(), platformId] as const,

  request: () => [...PLATFORM_KEYS.all, "request"] as const,

  platformRequests: (platformId: string) =>
    [...PLATFORM_KEYS.request(), platformId] as const,
};

// 1. Fetch All platforms (Cached indefinitely or per staleTime)
export function usePlatforms() {
  return useQuery({
    queryKey: PLATFORM_KEYS.lists(),
    queryFn: () => platformsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

// 2. Fetch Single Platform Details
export function usePlatform(id: string) {
  return useQuery({
    queryKey: PLATFORM_KEYS.detail(id),
    queryFn: () => platformsApi.getSingle(id),
    enabled: Boolean(id),
  });
}

export function usePartsByPLatform(platformId: string) {
  return useQuery({
    queryKey: PLATFORM_KEYS.platformParts(platformId),
    queryFn: () => platformsApi.getPartsByPlatform(platformId),
    enabled: !!platformId,
    staleTime: 1000 * 60 * 3,
  });
}

// Services by category
export function useServicesByPlatform(platformId: string) {
  return useQuery({
    queryKey: PLATFORM_KEYS.platformServices(platformId),
    queryFn: () => platformsApi.getServicesByPlatform(platformId),
    enabled: !!platformId,
    staleTime: 1000 * 60 * 3,
  });
}

// Requests by category
export function useRequestsByPlatform(platformId: string) {
  return useQuery({
    queryKey: PLATFORM_KEYS.platformRequests(platformId),
    queryFn: () => platformsApi.getRequestsByPlatform(platformId),
    enabled: !!platformId,
    staleTime: 1000 * 60 * 3,
  });
}


// 3. Platform Mutations (Create, Update, Delete)
export function usePlatformMutations() {
  const queryClient = useQueryClient();

  const createPlatform = useMutation({
    mutationFn: (payload: Pick<Platform, 'name' | 'slug'>) =>
      platformsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLATFORM_KEYS.lists() });
    },
  });

  const updatePlatform = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Platform> }) =>
      platformsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PLATFORM_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PLATFORM_KEYS.detail(variables.id),
      });
    },
  });

  const deletePlatform = useMutation({
    mutationFn: (id: string) => platformsApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PLATFORM_KEYS.lists() });
      queryClient.removeQueries({ queryKey: PLATFORM_KEYS.detail(id) });
    },
  });

  return {
    createPlatform,
    updatePlatform,
    deletePlatform,
  };
}
