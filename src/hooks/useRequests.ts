
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { requestApi } from "../api/requests.api";
import { UpdateRequestDto } from "@/types/requests";

// ============================================================
// QUERY KEYS
// ============================================================

export const REQUEST_KEYS = {
  all: ["requests"] as const,

  lists: () => [...REQUEST_KEYS.all, "list"] as const,

  details: () => [...REQUEST_KEYS.all, "detail"] as const,

  detail: (id: string) =>
    [...REQUEST_KEYS.details(), id] as const,

  technician: () =>
    [...REQUEST_KEYS.all, "technician"] as const,

  technicianRequests: (technicianId: string) =>
    [...REQUEST_KEYS.technician(), technicianId] as const,
};

// ============================================================
// 1. GET ALL REQUESTS
// ============================================================

export function useRequests() {
  return useQuery({
    queryKey: REQUEST_KEYS.lists(),

    queryFn: () => requestApi.getAllRequests(),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 2. GET SINGLE REQUEST
// ============================================================

export function useRequest(id: string) {
  return useQuery({
    queryKey: REQUEST_KEYS.detail(id),

    queryFn: () =>
      requestApi.getSingleRequest(id),

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 3. GET REQUESTS BY TECHNICIAN
// ============================================================

export function useRequestsByTechnician(
  technicianId: string
) {
  return useQuery({
    queryKey:
      REQUEST_KEYS.technicianRequests(
        technicianId
      ),

    queryFn: () =>
      requestApi.getRequestsByTechnician(
        technicianId
      ),

    enabled: Boolean(technicianId),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 4. REQUEST MUTATIONS
// ============================================================

export function useRequestMutations() {
  const queryClient = useQueryClient();
  // ==========================================================
  // UPDATE
  // ==========================================================

  const updateRequest = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRequestDto;
    }) =>
      requestApi.update(id, payload),

    onSuccess: (
      updatedRequest,
      variables
    ) => {
      // Update detail cache immediately
      if (updatedRequest) {
        queryClient.setQueryData(
          REQUEST_KEYS.detail(
            variables.id
          ),
          updatedRequest
        );
      }

      // Refresh list
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      // Refresh technician requests
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });
    },
  });

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const updateRequestStatus = useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) =>
      requestApi.markAsInactive(
        id,
        isActive
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.detail(
          variables.id
        ),
      });
    },
  });

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteRequest = useMutation({
    mutationFn: (id: string) =>
      requestApi.remove(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });

      queryClient.removeQueries({
        queryKey: REQUEST_KEYS.detail(id),
      });
    },
  });

  return {
    updateRequest,
    updateRequestStatus,
    deleteRequest,
  };
}