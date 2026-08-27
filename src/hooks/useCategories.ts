import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { categoriesApi } from "../api/categories.api";
import { Category } from "@/types/category";
import { supabase } from "@/lib/supabase/client";

// Query Keys
export const CATEGORY_KEYS = {
  all: ["categories"] as const,

  lists: () => [...CATEGORY_KEYS.all, "list"] as const,

  details: () => [...CATEGORY_KEYS.all, "detail"] as const,

  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,

  part: () => [...CATEGORY_KEYS.all, "part"] as const,

  categoryParts: (categoryId: string) =>
    [...CATEGORY_KEYS.part(), categoryId] as const,

  service: () => [...CATEGORY_KEYS.all, "service"] as const,

  categoryServices: (categoryId: string) =>
    [...CATEGORY_KEYS.service(), categoryId] as const,

  request: () => [...CATEGORY_KEYS.all, "request"] as const,

  categoryRequests: (categoryId: string) =>
    [...CATEGORY_KEYS.request(), categoryId] as const,
};

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch single category
export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoriesApi.getSingle(id),
    enabled: Boolean(id),
  });
}

// Parts by category
export function usePartsByCategory(categoryId: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.categoryParts(categoryId),
    queryFn: () => categoriesApi.getPartsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 3,
  });
}

// Services by category
export function useServicesByCategory(categoryId: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.categoryServices(categoryId),
    queryFn: () => categoriesApi.getServicesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 3,
  });
}

// Requests by category
export function useRequestsByCategory(categoryId: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.categoryRequests(categoryId),
    queryFn: () => categoriesApi.getRequestsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 3,
  });
}

// Category mutations
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  // CREATE CATEGORY
  const createCategory = useMutation({
    mutationFn: async ({
      name,
      icon_url,
    }: {
      name: string;
      icon_url: File;
    }) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        console.log("Category name is required.");
      }

      // Create slug
      const slug = trimmedName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Get file extension
      const fileExt =
        icon_url?.name.split(".").pop()?.toLowerCase() || "webp";

      // Unique file name
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from("category-icons")
        .upload(fileName, icon_url, {
          cacheControl: "3600",
          upsert: false,
          contentType: icon_url.type,
        });

      if (uploadError) {
        console.log(
          `Failed to upload category image: ${uploadError.message}`
        );
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("category-icons")
        .getPublicUrl(fileName);

      const iconUrl = publicUrlData.publicUrl;

      try {
        // Insert category
        const category = await categoriesApi.create({
          name: trimmedName,
          slug,
          icon_url: iconUrl,
        });

        return category;
      } catch (error) {
        // If database insert fails,
        // remove the uploaded image
        await supabase.storage
          .from("category-icons")
          .remove([fileName]);

        throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.lists(),
      });
    },
  });

  // UPDATE CATEGORY
  const updateCategory = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Category>;
    }) => categoriesApi.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.part(),
      });

      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.service(),
      });
    },
  });

  // DELETE CATEGORY
   const deleteCategory = useMutation({
        mutationFn: (id: string) => categoriesApi.remove(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: CATEGORY_KEYS.lists(),
            });

            queryClient.removeQueries({
                queryKey: CATEGORY_KEYS.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: CATEGORY_KEYS.part(),
            });

            queryClient.invalidateQueries({
                queryKey: CATEGORY_KEYS.service(),
            });
        },
    });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}