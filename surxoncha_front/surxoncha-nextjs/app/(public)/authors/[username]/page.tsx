import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Camera, Send, Link2 } from "lucide-react";
import { getAuthorByUsername, getArticlesByAuthor } from "@/lib/api/authors";
import { buildAuthorMetadata, noIndexMetadata } from "@/lib/seo/metadata";
import { jsonLd, personSchema } from "@/lib/seo/structured-data";
import { mediaUrl, formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}

const ROLE_LABELS: Record<string, string> = {
  contributor: "Surxoncha muxbiri",
  reporter: "Surxoncha reportyori",
  editor: "Muharrir",
  administrator: "Administrator",
  moderator: "Moderator",
  registered_user: "A'zo",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const author = await getAuthorByUsername(username);
  if (!author) return { title: "Muallif topilmadi | SURXONCHA.UZ", ...noIndexMetadata };
  return buildAuthorMetadata(author);
}

export const revalidate = 300;

export default async function AuthorPage({ params, searchParams }: Props) {
  const [{ username }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const author = await getAuthorByUsername(username);
  if (!author) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { data: articles, pagination } = await getArticlesByAuthor(author.id, page, 12);

  return (
    <div className="container py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(personSchema(author))} />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-10 pb-8 border-b border-border">
        <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden bg-border">
          {author.avatar?.url && (
            <Image src={mediaUrl(author.avatar.url)} alt={author.displayName} fill className="object-cover" />
          )}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-extrabold">{author.displayName}</h1>
          <p className="text-sm text-primary font-medium mb-2">
            {ROLE_LABELS[author.role] ?? "A'zo"}
            {author.region ? ` — ${author.region.name}` : ""}
          </p>
          {author.bio && <p className="text-sm text-muted max-w-lg mb-3">{author.bio}</p>}
          <div className="flex items-center justify-center sm:justify-start gap-3 text-muted">
            {author.telegram && (
              <a href={`https://t.me/${author.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <Send className="h-4 w-4 hover:text-primary" />
              </a>
            )}
            {author.instagram && (
              <a href={`https://instagram.com/${author.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Camera className="h-4 w-4 hover:text-primary" />
              </a>
            )}
            {author.portfolioUrl && (
              <a href={author.portfolioUrl} target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
                <Link2 className="h-4 w-4 hover:text-primary" />
              </a>
            )}
          </div>
          <p className="text-xs text-muted mt-3">
            Surxoncha jamoasida {formatDate(author.joinedAt)} dan beri
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-5">Maqolalar</h2>
      {articles.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Pagination
            basePath={`/authors/${author.username}`}
            currentPage={pagination.page}
            pageCount={pagination.pageCount}
          />
        </>
      ) : (
        <EmptyState title="Bu muallifning hali e'lon qilingan maqolalari yo'q." />
      )}
    </div>
  );
}
