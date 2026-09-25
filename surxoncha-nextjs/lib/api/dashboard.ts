import "server-only";
import { strapiFetch, toQueryString } from "./client";
import type { Article, ContributorApplication, PaginatedResult } from "@/types/content";

const DASHBOARD_ARTICLE_POPULATE = {
  populate: { coverImage: true, category: true, region: true, author: { populate: ["avatar"] } },
};

/** Joriy foydalanuvchining o'z maqolalari — istalgan statusda (dashboard uchun). */
export async function getMyArticles(jwt: string, userId: number) {
  const qs = toQueryString({
    filters: { author: { user: { id: { $eq: userId } } } },
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 50 },
    ...DASHBOARD_ARTICLE_POPULATE,
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    next: { revalidate: 0 },
  });
}

/** Editorial Queue — Editor/Administrator uchun, tekshiruv kutayotgan barcha maqolalar. */
export async function getEditorialQueue(jwt: string) {
  const qs = toQueryString({
    filters: { status: { $in: ["submitted", "in_review"] } },
    sort: ["updatedAt:asc"], // eng uzoq kutayotgani birinchi
    pagination: { pageSize: 50 },
    ...DASHBOARD_ARTICLE_POPULATE,
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    next: { revalidate: 0 },
  });
}

/** Editor dashboard statistikasi uchun — barcha statusdagi maqolalar soni. */
export async function getArticleCountsByStatus(jwt: string) {
  const statuses = [
    "draft",
    "submitted",
    "in_review",
    "revision_requested",
    "approved",
    "published",
    "rejected",
  ] as const;

  const counts = await Promise.all(
    statuses.map(async (status) => {
      const qs = toQueryString({
        filters: { status: { $eq: status } },
        pagination: { pageSize: 1 },
        fields: ["id"],
      });
      const result = await strapiFetch<PaginatedResult<Pick<Article, "id">>>(
        `/articles?${qs}`,
        { headers: { Authorization: `Bearer ${jwt}` }, next: { revalidate: 0 } }
      );
      return [status, result.pagination.total] as const;
    })
  );

  return Object.fromEntries(counts) as Record<(typeof statuses)[number], number>;
}

/** Joriy foydalanuvchining o'z contributor arizasi (bo'lsa). */
export async function getMyApplication(jwt: string) {
  const qs = toQueryString({
    sort: ["createdAt:desc"],
    pagination: { pageSize: 1 },
  });
  const result = await strapiFetch<PaginatedResult<ContributorApplication>>(
    `/contributor-applications?${qs}`,
    { headers: { Authorization: `Bearer ${jwt}` }, next: { revalidate: 0 } }
  );
  return result.data[0] ?? null;
}

/** Dashboard'dagi "Tahrirlash" sahifasi uchun — is-owner-or-editor policy
 *  himoyasida, faqat egasi yoki Editor ko'ra oladi. */
export async function getArticleForEdit(jwt: string, id: number) {
  return strapiFetch<{ data: Article }>(`/articles/${id}?populate[coverImage]=true&populate[category]=true&populate[region]=true&populate[tags]=true`, {
    headers: { Authorization: `Bearer ${jwt}` },
    next: { revalidate: 0 },
  });
}
export async function getPendingApplications(jwt: string) {
  const qs = toQueryString({
    filters: { status: { $eq: "pending" } },
    sort: ["createdAt:asc"],
    pagination: { pageSize: 50 },
    populate: { region: true, applicant: true },
  });
  return strapiFetch<PaginatedResult<ContributorApplication>>(
    `/contributor-applications?${qs}`,
    { headers: { Authorization: `Bearer ${jwt}` }, next: { revalidate: 0 } }
  );
}
