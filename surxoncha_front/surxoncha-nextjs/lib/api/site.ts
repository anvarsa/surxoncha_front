import { strapiFetch, toQueryString } from "./client";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo?: { url: string };
  favicon?: { url: string };
  contactEmail?: string;
  contactPhone?: string;
  telegramUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  xUrl?: string;
  footerText?: string;
  copyrightText?: string;
  googleSiteVerification?: string;
  analyticsId?: string;
  defaultSeo?: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: { url: string };
  };
}

/** Cached for 5 minutes — settings rarely change, no need to hit Strapi every request. */
export async function getSiteSettings() {
  const qs = toQueryString({
    populate: { logo: true, favicon: true, defaultSeo: { populate: ["ogImage"] } },
  });
  const result = await strapiFetch<{ data: SiteSettings }>(`/site-setting?${qs}`, {
    next: { revalidate: 300, tags: ["site-settings"] },
  });
  return result.data;
}

export async function getHomepageFeaturedContent() {
  const qs = toQueryString({
    populate: {
      heroArticle: {
        populate: ["coverImage", "category", "region", "author"],
      },
      editorsPicks: {
        populate: ["coverImage", "category", "author"],
      },
    },
  });
  return strapiFetch<{
    data: { heroArticle: unknown; editorsPicks: unknown[] };
  }>(`/site-setting?${qs}`, { next: { revalidate: 60 } });
}
