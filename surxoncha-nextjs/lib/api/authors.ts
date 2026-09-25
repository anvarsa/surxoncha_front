import { strapiFetch, toQueryString } from "./client";
import type { AuthorProfile, Article, PaginatedResult } from "@/types/content";

export async function getAuthorByUsername(username: string) {
  const qs = toQueryString({
    filters: { username: { $eq: username } },
    populate: { avatar: true },
  });
  const result = await strapiFetch<PaginatedResult<AuthorProfile>>(`/author-profiles?${qs}`, {
    next: { revalidate: 300, tags: ["author-profiles"] },
  });
  return result.data[0] ?? null;
}

export async function getArticlesByAuthor(authorId: number, page = 1, pageSize = 12) {
  const qs = toQueryString({
    filters: { status: { $eq: "published" }, author: { id: { $eq: authorId } } },
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize },
    populate: { coverImage: true, category: true, region: true, author: true },
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: ["articles"] },
  });
}

export async function getAllAuthorsForSitemap() {
  const qs = toQueryString({
    fields: ["username", "displayName"],
    pagination: { pageSize: 200 },
  });
  return strapiFetch<PaginatedResult<AuthorProfile>>(`/author-profiles?${qs}`, {
    next: { revalidate: 3600, tags: ["author-profiles"] },
  });
}
