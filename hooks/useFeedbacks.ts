import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { feedbacksApi } from "@/api/feedback.api";

// ─────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────

export const FEEDBACK_KEYS = {
    all: ["feedbacks"] as const,

    lists: () =>
        [...FEEDBACK_KEYS.all, "list"] as const,

    technician: () =>
        [...FEEDBACK_KEYS.all, "technician"] as const,

    byTechnician: (technicianId: string) =>
        [...FEEDBACK_KEYS.technician(), technicianId] as const,
};

// ─────────────────────────────────────────────
// Fetch all feedbacks
// ─────────────────────────────────────────────

export function useFeedbacks() {
    return useQuery({
        queryKey: FEEDBACK_KEYS.lists(),
        queryFn: () => feedbacksApi.getAll(),
        staleTime: 1000 * 60 * 5,
    });
}

// ─────────────────────────────────────────────
// Fetch feedbacks by technician
// ─────────────────────────────────────────────

export function useFeedbacksByTechnician(
    technicianId: string
) {
    return useQuery({
        queryKey: FEEDBACK_KEYS.byTechnician(
            technicianId
        ),

        queryFn: () =>
            feedbacksApi.getFeedbacksByTechnician(
                technicianId
            ),

        enabled: Boolean(technicianId),

        staleTime: 1000 * 60 * 5,
    });
}

// ─────────────────────────────────────────────
// Feedback mutations
// ─────────────────────────────────────────────

export function useFeedbackMutations() {
    const queryClient = useQueryClient();

    // ─────────────────────────────────────────────
    // DELETE FEEDBACK
    // ─────────────────────────────────────────────

    const deleteFeedback = useMutation({
        mutationFn: (id: string) =>
            feedbacksApi.remove(id),

        onSuccess: () => {
            // Refresh all feedbacks
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_KEYS.lists(),
            });

            // Refresh technician feedbacks
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_KEYS.technician(),
            });
        },
    });

    return {
        deleteFeedback,
    };
}