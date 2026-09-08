import { Category } from "./category";
import { Platform } from "./platform";
import { Profile } from "./profiles";

export type Condition = "used" | "new" ;
export interface Part {
  id: string;
  technician_id: string;
  platform_id?: string | null;
  category_id?: string | null;

  title?: string;
  description?: string | null;

  price?: number | null;
  quantity?: number | null;
  view_count?: number | null;
  condition?:Condition | null;

  images?: string[] | null;
  is_available?: boolean | null;
  is_negotiable?: boolean | null;
  is_approved?:boolean | null;
  created_at?: string | null;

  technician?: Profile | null;
  category?: Category | null;
  platform?: Platform | null;
}

export type UpdatePartDto = Partial<{
  title: string;
  category_id: string | null;
  platform_id: string | null;
  condition_id: string | null;
  description: string | null;
  price: number | null;
  is_negotiable: boolean | null;
  is_approved:boolean | null;
  images: string[] | null;
}>;