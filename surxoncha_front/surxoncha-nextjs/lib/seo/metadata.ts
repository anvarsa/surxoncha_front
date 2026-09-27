import type { Metadata } from "next";
import type { Article, AuthorProfile, Category, Region } from "@/types/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surxoncha.uz";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Surxoncha.uz";
const DEFAULT_OG_WIDTH = 1200;
const DEFAULT_OG_HEIGHT = 630;

function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mediaUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : absoluteUrl(url);
}

/** /news/[slug] uchun to'liq metadata: title, description, canonical, OG, Twitter/X, robots. */
export function buildArticleMetadata(article: Article): Metadata {
  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;
  const canonical = article.seo?.canonicalUrl || absoluteUrl(`/news/${article.slug}`);
  const ogImageUrl =
    mediaUrl(article.seo?.ogImage?.url) || mediaUrl(article.coverImage?.url);

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical },
    robots: article.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    authors: [{ name: article.author?.displayName }],
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "uz_UZ",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author.displayName] : undefined,
      section: article.category?.name,
      tags: article.tags?.map((t) => t.name),
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: DEFAULT_OG_WIDTH, height: DEFAULT_OG_HEIGHT, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export function buildRegionMetadata(region: Region): Metadata {
  const title = region.seo?.metaTitle || `${region.name} — yangiliklar`;
  const description =
    region.seo?.metaDescription || region.description || `${region.name} tumani bo'yicha so'nggi yangiliklar.`;
  const canonical = absoluteUrl(`/regions/${region.slug}`);
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: region.coverImage?.url ? [{ url: mediaUrl(region.coverImage.url)! }] : undefined,
    },
  };
}

export function buildCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} — so'nggi yangiliklar`;
  const description = category.description || `${category.name} bo'limidagi barcha maqolalar.`;
  const canonical = absoluteUrl(`/category/${category.slug}`);
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical },
  };
}

export function buildAuthorMetadata(author: AuthorProfile): Metadata {
  const title = `${author.displayName} — muallif profili`;
  const description = author.bio || `${author.displayName}ning Surxoncha.uz'dagi maqolalari.`;
  const canonical = absoluteUrl(`/authors/${author.username}`);
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      title,
      description,
      url: canonical,
      images: author.avatar?.url ? [{ url: mediaUrl(author.avatar.url)! }] : undefined,
    },
  };
}

/** robots/private route'lar uchun — hech qachon indekslanmaydi */
export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false },
};
