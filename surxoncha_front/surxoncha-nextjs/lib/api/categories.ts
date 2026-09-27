import { strapiFetch, toQueryString } from "./client";
import type { Category, PaginatedResult } from "@/types/content";

export async function getAllCategories() {
  const qs = toQueryString({
    sort: ["name:asc"],
    pagination: { pageSize: 20 },
    fields: ["name", "slug", "description"],
  });
  return strapiFetch<PaginatedResult<Category>>(`/categories?${qs}`, {
    next: { revalidate: 3600, tags: ["categories"] },
  });
}

export async function getCategoryBySlug(slug: string) {
  const qs = toQueryString({ filters: { slug: { $eq: slug } } });
  const result = await strapiFetch<PaginatedResult<Category>>(`/categories?${qs}`, {
    next: { revalidate: 3600, tags: ["categories"] },
  });
  return result.data[0] ?? null;
}
