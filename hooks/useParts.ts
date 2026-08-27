import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { partApi } from "../api/parts.api";
import { UpdatePartDto } from "@/types/parts";

// ─────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────

export const PART_KEYS = {
    all: ["parts"] as const,

    lists: () =>
        [...PART_KEYS.all, "list"] as const,

    details: () =>
        [...PART_KEYS.all, "detail"] as const,

    detail: (id: string) =>
        [...PART_KEYS.details(), id] as const,

    technician: () =>
        [...PART_KEYS.all, "technician"] as const,

    technicianParts: (technicianId: string) =>
        [
            ...PART_KEYS.technician(),
            technicianId,
        ] as const,
};

// ─────────────────────────────────────────────
// GET ALL PARTS
// ─────────────────────────────────────────────

export function useParts() {
    return useQuery({
        queryKey: PART_KEYS.lists(),

        queryFn: () =>
            partApi.getAllParts(),

        staleTime: 1000 * 60 * 3,
    });
}

// ─────────────────────────────────────────────
// GET SINGLE PART
// ─────────────────────────────────────────────

export function usePart(id: string) {
    return useQuery({
        queryKey: PART_KEYS.detail(id),

        queryFn: () =>
            partApi.getSinglePart(id),

        enabled: Boolean(id),
    });
}

// ─────────────────────────────────────────────
// GET PARTS BY TECHNICIAN
// ─────────────────────────────────────────────

export function usePartByTechnician(
    technicianId: string
) {
    return useQuery({
        queryKey:
            PART_KEYS.technicianParts(
                technicianId
            ),

        queryFn: () =>
            partApi.getPartsByTechnician(
                technicianId
            ),

        enabled: Boolean(technicianId),

        staleTime: 1000 * 60 * 3,
    });
}

// ─────────────────────────────────────────────
// PART MUTATIONS
// ─────────────────────────────────────────────

export function usePartsMutations() {
    const queryClient =
        useQueryClient();

    // ==========================================
    // UPDATE PART
    // ==========================================

    const updatePart = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: Partial<UpdatePartDto>;
        }) =>
            partApi.update(
                id,
                payload
            ),

        onSuccess: (_, variables) => {
            // Refresh parts list
            queryClient.invalidateQueries({
                queryKey: PART_KEYS.lists(),
            });

            // Refresh technician parts
            queryClient.invalidateQueries({
                queryKey:
                    PART_KEYS.technician(),
            });

            // Refresh this part
            queryClient.invalidateQueries({
                queryKey: PART_KEYS.detail(
                    variables.id
                ),
            });
        },
    });

    // ==========================================
    // DELETE PART
    // ==========================================

    const deletePart = useMutation({
        mutationFn: (id: string) =>
            partApi.remove(id),

        onSuccess: (_, id) => {
            // Refresh parts list
            queryClient.invalidateQueries({
                queryKey:
                    PART_KEYS.lists(),
            });

            // Refresh technician parts
            queryClient.invalidateQueries({
                queryKey:
                    PART_KEYS.technician(),
            });

            // Remove cached detail
            queryClient.removeQueries({
                queryKey:
                    PART_KEYS.detail(id),
            });
        },
    });

    return {
        updatePart,
        deletePart,
    };
}