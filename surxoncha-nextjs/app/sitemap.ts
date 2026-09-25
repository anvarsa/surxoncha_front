import type { MetadataRoute } from "next";
import { getAllPublishedArticlesForSitemap } from "@/lib/api/articles";
import { getAllCategories } from "@/lib/api/categories";
import { getAllRegions } from "@/lib/api/regions";
import { getAllAuthorsForSitemap } from "@/lib/api/authors";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surxoncha.uz";

const STATIC_PAGES = [
  "",
  "/about",
  "/contact",
  "/editorial-policy",
  "/regions",
  "/join",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, regions, authors] = await Promise.all([
    getAllPublishedArticlesForSitemap().catch(() => []),
    getAllCategories().catch(() => ({ data: [] })),
    getAllRegions().catch(() => ({ data: [] })),
    getAllAuthorsForSitemap().catch(() => ({ data: [] })),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "hourly" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.data.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const regionEntries: MetadataRoute.Sitemap = regions.data.map((r) => ({
    url: `${SITE_URL}/regions/${r.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const authorEntries: MetadataRoute.Sitemap = authors.data.map((a) => ({
    url: `${SITE_URL}/authors/${a.username}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  // Draft, private, admin, submit, login, register kabi sahifalar bu yerga
  // hech qachon qo'shilmaydi — ular faqat mavjud emas, qasddan chiqarib
  // tashlangan (spec 28-band).
  return [...staticEntries, ...articleEntries, ...categoryEntries, ...regionEntries, ...authorEntries];
}
