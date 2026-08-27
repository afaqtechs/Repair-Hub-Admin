import { supabase } from '@/lib/supabase/client';
import { Request, UpdateRequestDto } from '@/types/requests';
import { deleteRequestImages } from './storage.api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface RequestsResponse {
    data: Request[];
    totalCount: number;
}

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);

    console.log(`[requestApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Request API
// ─────────────────────────────────────────────

export const requestApi = {
    // ==========================================
    // GET ALL REQUESTS
    // ==========================================

    async getAllRequests(): Promise<RequestsResponse> {
        try {
            const { data, count, error } = await supabase
                .from('requests')
                .select(
                    `
                    *,
                    technician:profiles!inner(*),
                    category:categories(*),
                    platform:platforms(*)
                    `,
                    {
                        count: 'exact',
                    }
                )
                .order('created_at', {
                    ascending: false,
                })
                .limit(100);

            if (error) {
                logApiError('getAllRequests', error);

                return {
                    data: [],
                    totalCount: 0,
                };
            }

            return {
                data: (data as Request[]) ?? [],
                totalCount: count ?? 0,
            };
        } catch (error) {
            logApiError('getAllRequests', error);

            return {
                data: [],
                totalCount: 0,
            };
        }
    },

    // ==========================================
    // GET SINGLE REQUEST
    // ==========================================

    async getSingleRequest(id: string): Promise<Request | null> {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select(
                    `
                    *,
                    technician:profiles(*),
                    category:categories(*),
                    platform:platforms(*)
                    `
                )
                .eq('id', id)
                .maybeSingle();

            if (error) {
                logApiError('getSingleRequest', error);

                return null;
            }

            return data as Request | null;
        } catch (error) {
            logApiError('getSingleRequest', error);

            return null;
        }
    },

    // ==========================================
    // GET REQUESTS BY TECHNICIAN
    // ==========================================

    async getRequestsByTechnician(technicianId: string): Promise<Request[]> {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select(
                    `
                    *,
                    technician:profiles!inner(*),
                    category:categories(*),
                    platform:platforms(*)
                    `
                )
                .eq('technician_id', technicianId)
                .order('created_at', {
                    ascending: false,
                });

            if (error) {
                logApiError('getRequestsByTechnician', error);

                return [];
            }

            return (data as Request[]) ?? [];
        } catch (error) {
            logApiError('getRequestsByTechnician', error);

            return [];
        }
    },

    // ==========================================
    // UPDATE REQUEST
    // ==========================================

    async update(id: string, payload: UpdateRequestDto): Promise<Request | null> {
        try {
            const { data, error } = await supabase
                .from('requests')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                logApiError('update', error);

                return null;
            }

            return data as Request;
        } catch (error) {
            logApiError('update', error);

            return null;
        }
    },

    // ==========================================
    // MARK ACTIVE / INACTIVE
    // ==========================================

    async markAsInactive(id: string, isActive: boolean): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('requests')
                .update({
                    is_active: isActive,
                })
                .eq('id', id);

            if (error) {
                logApiError('markAsInactive', error);

                return false;
            }

            return true;
        } catch (error) {
            logApiError('markAsInactive', error);

            return false;
        }
    },

    // ==========================================
    // DELETE REQUEST
    // ==========================================

    async remove(id: string): Promise<boolean> {
        try {
            // ==========================================
            // Get request images
            // ==========================================

            const { data: request, error: fetchError } = await supabase
                .from('requests')
                .select('images')
                .eq('id', id)
                .single();

            if (fetchError) {
                logApiError('remove', fetchError);

                return false;
            }

            const images = Array.isArray(request?.images) ? request.images : [];

            // ==========================================
            // Delete request
            // ==========================================

            const { error: deleteError } = await supabase
                .from('requests')
                .delete()
                .eq('id', id);

            if (deleteError) {
                logApiError('remove', deleteError);

                return false;
            }

            // ==========================================
            // Delete request images
            // ==========================================

            if (images.length > 0) {
                try {
                    await deleteRequestImages(images);
                } catch (storageError) {
                    logApiError('remove.images', storageError);
                }
            }

            return true;
        } catch (error) {
            logApiError('remove', error);

            return false;
        }
    },
};
