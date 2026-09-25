import Image from "next/image";
import Link from "next/link";
import { Send, Camera, Video, Share2 } from "lucide-react";
import type { Article } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { getSiteSettings } from "@/lib/api/site";

function PopularArticleCircle({ article, index }: { article: Article; index: number }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block text-center transition">
      <div className="relative mx-auto mb-4 inline-block">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-secondary/30 shadow-md transition group-hover:border-secondary group-hover:shadow-xl sm:h-32 sm:w-32">
          <Image
            src={mediaUrl(article.coverImage?.url)}
            alt={article.coverImage?.alternativeText || article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white shadow-md sm:h-8 sm:w-8">
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

  if (!articles.length) return null;

  const socialLinks = [
    { label: "Telegram", href: settings?.telegramUrl, icon: Send },
    { label: "Instagram", href: settings?.instagramUrl, icon: Camera },
    { label: "YouTube", href: settings?.youtubeUrl, icon: Video },
    { label: "X", href: settings?.xUrl, icon: Share2 },
  ].filter(
    (item): item is { label: string; href: string; icon: typeof Send } => !!item.href
  );

  return (
    <section className="space-y-8">
      <div>
        <h2 className="mb-6 text-2xl font-extrabold text-text">Eng ko&apos;p ko&apos;rilgan</h2>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {articles.slice(0, 4).map((article, index) => (
            <PopularArticleCircle key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-secondary/5 to-primary/5 p-6 text-center">
          <p className="mb-4 text-sm font-semibold text-muted">Bizni kuzatib boring</p>

          <div className="flex items-center justify-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-white text-primary transition hover:border-primary hover:bg-primary hover:text-white"
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
