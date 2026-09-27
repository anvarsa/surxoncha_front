import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { organizationSchema, websiteSchema, jsonLd } from "@/lib/seo/structured-data";
import { getSiteSettings } from "@/lib/api/site";
import { mediaUrl } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surxoncha.uz";

export async function generateMetadata(): Promise<Metadata> {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default:
        settings?.defaultSeo?.metaTitle ||
        "SURXONCHA.UZ — Surxondaryoni uning o'z yoshlari hikoya qiladi",
      template: "%s | SURXONCHA.UZ",
    },
    description:
      settings?.defaultSeo?.metaDescription ||
      "Surxondaryo viloyati bo'yicha yangiliklar, intervyular, reportajlar va yoshlar media hamjamiyati.",
    icons: settings?.favicon?.url ? { icon: mediaUrl(settings.favicon.url) } : undefined,
    verification: settings?.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
    alternates: {
      types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
    },
    openGraph: {
      type: "website",
      siteName: settings?.siteName || "SURXONCHA.UZ",
      locale: "uz_UZ",
      url: SITE_URL,
      images: settings?.defaultSeo?.ogImage?.url
        ? [{ url: mediaUrl(settings.defaultSeo.ogImage.url) }]
        : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  return (
    <html lang="uz">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            organizationSchema([settings?.telegramUrl, settings?.instagramUrl, settings?.youtubeUrl])
          )}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
