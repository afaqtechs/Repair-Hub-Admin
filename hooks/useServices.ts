import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { serviceApi } from "../api/services.api";
import { UpdateServiceDto } from "@/types/services";

// ============================================================
// QUERY KEYS
// ============================================================

export const SERVICE_KEYS = {
  all: ["services"] as const,

  lists: () =>
    [...SERVICE_KEYS.all, "list"] as const,

  details: () =>
    [...SERVICE_KEYS.all, "detail"] as const,

  detail: (id: string) =>
    [...SERVICE_KEYS.details(), id] as const,

  technician: () =>
    [...SERVICE_KEYS.all, "technician"] as const,

  technicianServices: (technicianId: string) =>
    [...SERVICE_KEYS.technician(), technicianId] as const,
};

// ============================================================
// 1. GET ALL SERVICES
// ============================================================

export function useServices() {
  return useQuery({
    queryKey: SERVICE_KEYS.lists(),

    queryFn: () =>
      serviceApi.getAllServices(),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 2. GET SINGLE SERVICE
// ============================================================

export function useService(id: string) {
  return useQuery({
    queryKey: SERVICE_KEYS.detail(id),

    queryFn: () =>
      serviceApi.getSingleService(id),

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 3. GET SERVICES BY TECHNICIAN
// ============================================================

export function useServicesByTechnician(
  technicianId: string
) {
  return useQuery({
    queryKey:
      SERVICE_KEYS.technicianServices(
        technicianId
      ),

    queryFn: () =>
      serviceApi.getServicesByTechnician(
        technicianId
      ),

    enabled: Boolean(technicianId),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 4. SERVICE MUTATIONS
// UPDATE / STATUS / DELETE
// ============================================================

export function useServiceMutations() {
  const queryClient = useQueryClient();

  // ==========================================================
  // UPDATE SERVICE
  // ==========================================================

  const updateService = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateServiceDto>;
    }) =>
      serviceApi.update(id, payload),

    onSuccess: (
      updatedService,
      variables
    ) => {
      // Update detail cache immediately
      if (updatedService) {
        queryClient.setQueryData(
          SERVICE_KEYS.detail(
            variables.id
          ),
          updatedService
        );
      }

      // Refresh services list
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.lists(),
      });

      // Refresh technician services
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.technician(),
      });
    },
  });

  // ==========================================================
  // UPDATE SERVICE STATUS
  // ==========================================================

  const updateServiceStatus = useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) =>
      serviceApi.markAsInactive(
        id,
        isActive
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.technician(),
      });

      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.detail(
          variables.id
        ),
      });
    },
  });

  // ==========================================================
  // DELETE SERVICE
  // ==========================================================

  const deleteService = useMutation({
    mutationFn: (id: string) =>
      serviceApi.remove(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.technician(),
      });

      queryClient.removeQueries({
        queryKey: SERVICE_KEYS.detail(id),
      });
    },
  });

  return {
    updateService,
    updateServiceStatus,
    deleteService,
  };
}