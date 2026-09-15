export type CategoryType = 'part' | 'service' | 'request';
export interface Category {
    id: string;
    name: string;
    slug:string;
    icon_url: string | null;
    description?: string | null;

    type?:CategoryType | null;
}