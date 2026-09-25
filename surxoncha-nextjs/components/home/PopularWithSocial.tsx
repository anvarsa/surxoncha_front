import Image from "next/image";
import Link from "next/link";
import { Telegram, Instagram, Youtube, Share2 } from "lucide-react-native";
import { Send, Camera, Video, Share2 as ShareIcon } from "lucide-react";
import type { Article } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { getSiteSettings } from "@/lib/api/site";
import { ArticleMeta } from "@/components/article/ArticleMeta";

function PopularArticleCircle({ article, index }: { article: Article; index: number }) {
  return (
    <Link href={`/news/${article.slug}`} className="group text-center transition">
      <div className="relative mb-4 inline-block">
        {/* Circular image */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-secondary/30 shadow-lg transition group-hover:border-secondary group-hover:shadow-xl">
          <Image
            src={mediaUrl(article.coverImage?.url)}
            alt={article.coverImage?.alternativeText || article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
        {/* Number badge */}
        <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white shadow-md">
          {index + 1}
        </span>
      </div>
      <h3 className="line-clamp-3 text-sm font-bold leading-snug text-text transition group-hover:text-primary">
        {article.title}
      </h3>
      <p className="mt-2 text-xs text-muted">{article.category?.name}</p>
    </Link>
  );
}

export async function PopularWithSocial({ articles }: { articles: Article[] }) {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  if (articles.length === 0) return null;

  const socialLinks = [
    { icon: Send, href: settings?.telegramUrl, label: "Telegram" },
    { icon: Camera, href: settings?.instagramUrl, label: "Instagram" },
    { icon: Video, href: settings?.youtubeUrl, label: "YouTube" },
    { icon: ShareIcon, href: settings?.xUrl, label: "X" },
  ].filter((link) => link.href);

  return (
    <section>
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-extrabold text-text">Eng ko'p ko'rilgan</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {articles.slice(0, 4).map((article, index) => (
            <PopularArticleCircle key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      {/* Social media section */}
      {socialLinks.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-secondary/5 to-primary/5 p-8 text-center">
          <p className="mb-4 text-sm font-semibold text-muted">Bizni kuzatib boring</p>
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
