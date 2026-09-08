
import { extractFileNameFromUrl } from '@/lib/extractFileNameFromUrl';
import { supabase } from '@/lib/supabase/client';
import { ProfileDto, Profile } from '@/types/profiles';
import { deletePartImages, deleteRequestImages, deleteServiceImages } from './storage.api';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[profileApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Profile API
// ─────────────────────────────────────────────

export const profileApi = {
  // ─────────────────────────────────────────────
  // Get technicians
  // ─────────────────────────────────────────────

  async getTechnicians(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('first_name', {
          ascending: true,
        });

      if (error) {
        logApiError('getTechnicians', error);

        return [];
      }

      return (data as Profile[]) || [];
    } catch (error) {
      logApiError('getTechnicians', error);

      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Get single technician
  // ─────────────────────────────────────────────

  async getTechnician(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getTechnician', error);

        return null;
      }

      return data as Profile | null;
    } catch (error) {
      logApiError('getTechnician', error);

      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Update profile
  // ─────────────────────────────────────────────

  async update(
    id: string,
    payload: Partial<ProfileDto>
  ): Promise<Profile | null> {
    try {
      console.log("id",id);
      console.log("data",payload);
      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      logApiError('update', error);
      return null;
    }
  },

async deleteUser(userId: string) {

        if (!userId) {
            console.log("[authApi.deleteAccount] No authenticated user");
            return null;
        }

        // ─────────────────────────────────────────────
        // 2. Get profile storage URLs
        // ─────────────────────────────────────────────

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("profile_image_url, legal_document_url")
            .eq("id", userId)
            .single();

        if (profileError) {
            logApiError("deleteAccount.profile", profileError);
        }


        // ─────────────────────────────────────────────
        // 3. Delete profile image
        // ─────────────────────────────────────────────

        if (profile?.profile_image_url) {
            const fileName = extractFileNameFromUrl(
                profile.profile_image_url
            );

            if (fileName) {
                const folderPath = `${userId}/${fileName}`;

                const { error: deleteError } = await supabase.storage
                    .from("profile-images")
                    .remove([folderPath]);

                if (deleteError) {
                    logApiError(
                        "deleteAccount.profileImage",
                        deleteError
                    );
                }
            }
        }

        
        // ─────────────────────────────────────────────
        // 4. Delete legal document
        // ─────────────────────────────────────────────

        if (profile?.legal_document_url) {
            const fileName = extractFileNameFromUrl(
                profile.legal_document_url
            );

            if (fileName) {
                const folderPath = `${userId}/${fileName}`;

                const { error: deleteError } = await supabase.storage
                    .from("legal_documents")
                    .remove([folderPath]);

                if (deleteError) {
                    logApiError(
                        "deleteAccount.legalDocument",
                        deleteError
                    );
                }
            }
        }

        const [
            { data: parts, error: partsError },
            { data: services, error: servicesError },
            { data: requests, error: requestsError },
        ] = await Promise.all([
            supabase
                .from("parts")
                .select("images")
                .eq("technician_id", userId),

            supabase
                .from("services")
                .select("images")
                .eq("technician_id", userId),

            supabase
                .from("requests")
                .select("images")
                .eq("user_id", userId),
        ]);

                if (partsError) {
            logApiError("deleteAccount.parts", partsError);
        }

        if (servicesError) {
            logApiError("deleteAccount.services", servicesError);
        }

        if (requestsError) {
            logApiError("deleteAccount.requests", requestsError);
        }

        
        // ─────────────────────────────────────────────
        // 6. Delete part images
        // ─────────────────────────────────────────────

        const partImages =
            parts?.flatMap((part) =>
                Array.isArray(part.images) ? part.images : []
            ) ?? [];

            console.log("PART IMAGES:", partImages);
          
        if (partImages.length > 0) {
            const success = await deletePartImages(partImages);

            if (!success) {
                console.log(
                    "[authApi.deleteAccount] Failed to delete part images"
                );
            }
        }


        // ─────────────────────────────────────────────
        // 7. Delete service images
        // ─────────────────────────────────────────────

        const serviceImages =
            services?.flatMap((service) =>
                Array.isArray(service.images) ? service.images : []
            ) ?? [];

        if (serviceImages.length > 0) {
            const success = await deleteServiceImages(serviceImages);

            if (!success) {
                console.log(
                    "[authApi.deleteAccount] Failed to delete service images"
                );
            }
        }


        // ─────────────────────────────────────────────
        // 8. Delete request images
        // ─────────────────────────────────────────────

        const requestImages =
            requests?.flatMap((request) =>
                Array.isArray(request.images) ? request.images : []
            ) ?? [];

        if (requestImages.length > 0) {
            const success = await deleteRequestImages(requestImages);

            if (!success) {
                console.log(
                    "[authApi.deleteAccount] Failed to delete request images"
                );
            }
        }


    try {
        const { data, error } =
            await supabase.functions.invoke("delete-user", {
                body: { userId },
            });

        if (error) {
            console.log(
                "[deleteUser] error message:",
                error.message
            );

            console.log(
                "[deleteUser] error context:",
                error.context
            );

            throw error;
        }

        if (!data?.success) {
            throw new Error(
                data?.error ?? "Failed to delete user"
            );
        }

        return data;
    } catch (error) {
        logApiError("deleteUser", error);
        throw error;
    }
},
};
