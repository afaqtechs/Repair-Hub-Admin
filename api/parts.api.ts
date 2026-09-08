import { supabase } from '@/lib/supabase/client';
import { Part, UpdatePartDto } from '@/types/parts';
import { deletePartImages } from './storage.api';
export interface PartsResponse {
    data: Part[];
    totalCount: number;
}
const logApiError = (method: string, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);

    console.log(`[partApi.${method}]`, message);
};

export const partApi = {
   
    async getAllParts(): Promise<PartsResponse> {
        try {
            const { data, count, error } = await supabase
                .from('parts')
                .select(
                    `
                    *,
                    technician:profiles(*),
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
                logApiError('getAllParts', error);

                return {
                    data: [],
                    totalCount: 0,
                };
            }

            return {
                data: (data as Part[]) ?? [],
                totalCount: count ?? 0,
            };
        } catch (error) {
            logApiError('getAllParts', error);

            return {
                data: [],
                totalCount: 0,
            };
        }
    },

    // ==========================================
    // GET SINGLE PART
    // ==========================================

    async getSinglePart(id: string): Promise<Part | null> {
        try {
            const { data, error } = await supabase
                .from('parts')
                .select(
                    `
                    *,
                    technician:profiles(*),
                    category:categories(*),
                    condition:conditions(*),
                    platform:platforms(*)
                    `
                )
                .eq('id', id)
                .maybeSingle();

            if (error) {
                logApiError('getSinglePart', error);

                return null;
            }

            return data as Part | null;
        } catch (error) {
            logApiError('getSinglePart', error);

            return null;
        }
    },

    // ==========================================
    // GET PARTS BY TECHNICIAN
    // ==========================================

    async getPartsByTechnician(technicianId: string): Promise<Part[]> {
        try {
            const { data, error } = await supabase
                .from('parts')
                .select(
                    `
                    *,
                    technician:profiles!inner(*),
                    category:categories(*),
                    condition:conditions(*),
                    platform:platforms(*)
                    `
                )
                .eq('technician_id', technicianId)
                .order('created_at', {
                    ascending: false,
                });

            if (error) {
                logApiError('getPartsByTechnician', error);

                return [];
            }

            return (data as Part[]) ?? [];
        } catch (error) {
            logApiError('getPartsByTechnician', error);

            return [];
        }
    },

    // ==========================================
    // UPDATE
    // ==========================================

    async update(id: string, payload: UpdatePartDto): Promise<Part | null> {
        try {
            const { data, error } = await supabase
                .from('parts')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                logApiError('update', error);

                return null;
            }

            return data as Part;
        } catch (error) {
            logApiError('update', error);

            return null;
        }
    },

    // ==========================================
    // DELETE
    // ==========================================

    async remove(id: string): Promise<boolean> {
        try {
            const { data: part, error: fetchError } = await supabase
                .from('parts')
                .select('images')
                .eq('id', id)
                .single();

            if (fetchError) {
                logApiError('remove', fetchError);

                return false;
            }

            const images = Array.isArray(part?.images) ? part.images : [];

            const { error: deleteError } = await supabase
                .from('parts')
                .delete()
                .eq('id', id);

            if (deleteError) {
                logApiError('remove', deleteError);

                return false;
            }

            // Image deletion failure should not
            // make the part deletion fail.
            if (images.length > 0) {
                try {
                    await deletePartImages(images);
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
