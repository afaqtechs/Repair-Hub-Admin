import { supabase } from '@/lib/supabase/client';
import { Announcement } from '@/types/announcement';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[announcementsApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// announcements API
// ─────────────────────────────────────────────

export const announcementsApi = {
  // ─────────────────────────────────────────────
  // Get all announcements
  // ─────────────────────────────────────────────

  async getAll(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

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
  // Get single announcement
  // ─────────────────────────────────────────────

  async getSingle(id: string): Promise<Announcement | null> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getSingle', error);
        return null;
      }

      return data as Announcement | null;
    } catch (error) {
      logApiError('getSingle', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Create announcement
  // ─────────────────────────────────────────────

  async create(
    payload: Pick<Announcement, 'subject' | 'message'>
  ): Promise<Announcement | null> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert(payload)
        .select()
        .single();

      if (error) {
        logApiError('create', error);
        return null;
      }

      return data;
    } catch (error) {
      logApiError('create', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Update announcement
  // ─────────────────────────────────────────────

  async update(
    id: string,
    payload: Partial<Announcement>
  ): Promise<Announcement | null> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);
        return null;
      }

      return data;
    } catch (error) {
      logApiError('update', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Remove announcement
  // ─────────────────────────────────────────────

  async remove(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);

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
