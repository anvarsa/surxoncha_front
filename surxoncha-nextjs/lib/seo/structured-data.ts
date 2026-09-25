import type { Article, AuthorProfile } from "@/types/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surxoncha.uz";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Surxoncha.uz";

function mediaUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

/** Root layout'da bir marta chiqariladi (butun sayt uchun). */
export function organizationSchema(sameAs: (string | undefined)[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: sameAs.filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function personSchema(author: AuthorProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.displayName,
    url: `${SITE_URL}/authors/${author.username}`,
    image: mediaUrl(author.avatar?.url),
    description: author.bio,
  };
}

/** /news/[slug] sahifasida <script type="application/ld+json"> ichiga qo'yiladi. */
export function newsArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [mediaUrl(article.coverImage?.url)].filter(Boolean),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author?.displayName,
      url: `${SITE_URL}/authors/${article.author?.username}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/news/${article.slug}`,
    },
    articleSection: article.category?.name,
    keywords: article.tags?.map((t) => t.name).join(", "),
  };
}

/** Bir nechta JSON-LD blokni bitta <script> ichida xavfsiz serialize qilish. */
export function jsonLd(schema: Record<string, unknown>) {
  return {
    __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
  };
}
