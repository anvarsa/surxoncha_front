import "server-only";
import { strapiFetch, toQueryString } from "./client";
import type { ArticleComment, PaginatedResult } from "@/types/content";

export async function getArticleComments(articleId: number) {
  const qs = toQueryString({
    filters: { article: { id: { $eq: articleId } }, approved: { $eq: true } },
    sort: ["createdAt:desc"],
    pagination: { page: 1, pageSize: 50 },
  });
  return strapiFetch<PaginatedResult<ArticleComment>>(`/article-comments?${qs}`, {
    next: { revalidate: 30, tags: [`article-comments:${articleId}`] },
  });
}