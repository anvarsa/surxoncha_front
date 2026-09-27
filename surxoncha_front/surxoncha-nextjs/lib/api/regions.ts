import { strapiFetch, toQueryString } from "./client";
import type { Region, PaginatedResult } from "@/types/content";

export async function getAllRegions() {
  const qs = toQueryString({
    sort: ["name:asc"],
    pagination: { pageSize: 50 },
    fields: ["name", "slug", "description", "featured"],
    populate: { coverImage: true },
  });
  return strapiFetch<PaginatedResult<Region>>(`/regions?${qs}`, {
    next: { revalidate: 3600, tags: ["regions"] },
  });
}

export async function getRegionBySlug(slug: string) {
  const qs = toQueryString({
    filters: { slug: { $eq: slug } },
    populate: { coverImage: true, seo: { populate: ["ogImage"] } },
  });
  const result = await strapiFetch<PaginatedResult<Region>>(`/regions?${qs}`, {
    next: { revalidate: 3600, tags: ["regions"] },
  });
  return result.data[0] ?? null;
}
