import { supabase } from '@/lib/supabase/client';
import { Service, UpdateServiceDto } from '@/types/services';
import { deleteServiceImages } from './storage.api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ServicesResponse {
    data: Service[];
    totalCount: number;
}

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);

    console.log(`[serviceApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Service API
// ─────────────────────────────────────────────

export const serviceApi = {
    // ==========================================
    // GET ALL SERVICES
    // ==========================================

    async getAllServices(): Promise<ServicesResponse> {
        try {
            const { data, count, error } = await supabase
                .from('services')
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
                logApiError('getAllServices', error);

                return {
                    data: [],
                    totalCount: 0,
                };
            }

            return {
                data: (data as Service[]) ?? [],
                totalCount: count ?? 0,
            };
        } catch (error) {
            logApiError('getAllServices', error);

            return {
                data: [],
                totalCount: 0,
            };
        }
    },

    // ==========================================
    // GET SINGLE SERVICE
    // ==========================================

    async getSingleService(id: string): Promise<Service | null> {
        try {
            const { data, error } = await supabase
                .from('services')
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
                logApiError('getSingleService', error);

                return null;
            }

            return data as Service | null;
        } catch (error) {
            logApiError('getSingleService', error);

            return null;
        }
    },

    // ==========================================
    // GET SERVICES BY TECHNICIAN
    // ==========================================

    async getServicesByTechnician(technicianId: string): Promise<Service[]> {
        try {
            const { data, error } = await supabase
                .from('services')
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
                logApiError('getServicesByTechnician', error);

                return [];
            }

            return (data as Service[]) ?? [];
        } catch (error) {
            logApiError('getServicesByTechnician', error);

            return [];
        }
    },

    // ==========================================
    // UPDATE SERVICE
    // ==========================================

    async update(id: string, payload: UpdateServiceDto): Promise<Service | null> {
        try {
            const { data, error } = await supabase
                .from('services')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                logApiError('update', error);

                return null;
            }

            return data as Service;
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
                .from('services')
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
    // DELETE SERVICE
    // ==========================================

    async remove(id: string): Promise<boolean> {
        try {
            // ==========================================
            // Get service images
            // ==========================================

            const { data: service, error: fetchError } = await supabase
                .from('services')
                .select('images')
                .eq('id', id)
                .single();

            if (fetchError) {
                logApiError('remove', fetchError);

                return false;
            }

            const images = Array.isArray(service?.images) ? service.images : [];

            // ==========================================
            // Delete service
            // ==========================================

            const { error: deleteError } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (deleteError) {
                logApiError('remove', deleteError);

                return false;
            }

            // ==========================================
            // Delete service images
            // ==========================================

            if (images.length > 0) {
                try {
                    await deleteServiceImages(images);
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
