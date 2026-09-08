import { Category } from "./category";
import { Platform } from "./platform";
import { Profile } from "./profiles";

export interface Service {
  id: string;

  technician_id: string;

  platform_id?: string | null;
  category_id?: string | null;

  title: string;
  description?: string | null;

  price?: number | null;
  estimated_duration?: string | null;

  is_active: boolean;

  is_approved?:boolean | null;

  images?: string[] | null;

  is_negotiable?: boolean | null;

  created_at?: string | null;

  technician?: Profile | null;
  category?: Category | null;
  platform?: Platform | null;
}

export type UpdateServiceDto = Partial<{
  title: string;
  category_id: string | null;
  platform_id: string | null;
  description: string | null;
  price: number | null;
  is_negotiable: boolean | null;
    is_approved:boolean | null;
  estimated_duration: string | null;
  images: string[] | null;
}>;