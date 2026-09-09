import { supabase } from '@/lib/supabase/client';
import { ProfileDto, Profile } from '@/types/profiles';

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

};
