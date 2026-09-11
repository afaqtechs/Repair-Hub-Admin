import { Announcement } from '@/types/announcement';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '../api/announcements.api';

// Query Keys setup
export const ANNOUNCEMENT_KEYS = {
  all: ['announcements'] as const,
  lists: () => [...ANNOUNCEMENT_KEYS.all, 'list'] as const,
  details: () => [...ANNOUNCEMENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ANNOUNCEMENT_KEYS.details(), id] as const,

    part: () => [...ANNOUNCEMENT_KEYS.all, "part"] as const,

    announcementParts: (announcementId: string) =>
    [...ANNOUNCEMENT_KEYS.part(), announcementId] as const,

  service: () => [...ANNOUNCEMENT_KEYS.all, "service"] as const,

  announcementServices: (announcementId: string) =>
    [...ANNOUNCEMENT_KEYS.service(), announcementId] as const,

  request: () => [...ANNOUNCEMENT_KEYS.all, "request"] as const,

  announcementRequests: (announcementId: string) =>
    [...ANNOUNCEMENT_KEYS.request(), announcementId] as const,
};

// 1. Fetch All announcements (Cached indefinitely or per staleTime)
export function useAnnouncements() {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.lists(),
    queryFn: () => announcementsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

// 2. Fetch Single announcement Details
export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.detail(id),
    queryFn: () => announcementsApi.getSingle(id),
    enabled: Boolean(id),
  });
}

// 3. announcement Mutations (Create, Update, Delete)
export function useAnnouncementMutations() {
  const queryClient = useQueryClient();

  const createAnnouncement = useMutation({
    mutationFn: (payload: Pick<Announcement, 'subject' | 'message'>) =>
      announcementsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.lists() });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Announcement> }) =>
      announcementsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.detail(variables.id),
      });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: (id: string) => announcementsApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.lists() });
      queryClient.removeQueries({ queryKey: ANNOUNCEMENT_KEYS.detail(id) });
    },
  });

  return {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
}
