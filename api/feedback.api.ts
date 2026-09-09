import { supabase } from '@/lib/supabase/client';
import { Feedback } from '@/types/feedback';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
    const message =
        error instanceof Error ? error.message : String(error);

    console.log(`[feedbacksApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Feedbacks API
// ─────────────────────────────────────────────

export const feedbacksApi = {
    // ─────────────────────────────────────────────
    // Get all feedbacks
    // ─────────────────────────────────────────────

    async getAll(): Promise<Feedback[]> {
        try {
            const { data, error } = await supabase
                .from('technician_feedbacks')
                .select(`
                    *,
                    technician:profiles!inner(*)
                `)
                .order('created_at', {
                    ascending: false,
                });

            if (error) {
                logApiError('getAll', error);
                return [];
            }

            return data || [];
        } catch (error) {
            logApiError('getAll', error);
            return [];
        }
    },

    // ─────────────────────────────────────────────
    // Get feedbacks by technician
    // ─────────────────────────────────────────────

    async getFeedbacksByTechnician(
        technicianId: string
    ): Promise<Feedback[]> {
        try {
            const { data, error } = await supabase
                .from('technician_feedbacks')
                .select(`
                    *,
                    technician:profiles!inner(*)
                `)
                .eq('technician_id', technicianId)
                .order('created_at', {
                    ascending: false,
                });

            if (error) {
                logApiError(
                    'getFeedbacksByTechnician',
                    error
                );

                return [];
            }

            return data || [];
        } catch (error) {
            logApiError(
                'getFeedbacksByTechnician',
                error
            );

            return [];
        }
    },

    // ─────────────────────────────────────────────
    // Remove feedback
    // ─────────────────────────────────────────────

    async remove(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('technician_feedbacks')
                .delete()
                .eq('id', id);

            if (error) {
                logApiError('remove', error);
                return false;
            }

            return true;
        } catch (error) {
            logApiError('remove', error);
            return false;
        }
    },
};