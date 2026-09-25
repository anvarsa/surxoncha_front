import Link from "next/link";
import Image from "next/image";
import type { AuthorProfile } from "@/types/content";
import { mediaUrl } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  contributor: "Surxoncha muxbiri",
  reporter: "Surxoncha reportyori",
  editor: "Muharrir",
  administrator: "Administrator",
  moderator: "Moderator",
  registered_user: "A'zo",
};

export function AuthorCard({ author }: { author: AuthorProfile }) {
  return (
    <Link
      href={`/authors/${author.username}`}
      className="flex items-center gap-3 rounded border border-border p-4 hover:border-primary transition"
    >
      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-border">
        {author.avatar?.url && (
          <Image src={mediaUrl(author.avatar.url)} alt={author.displayName} fill className="object-cover" />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold truncate">{author.displayName}</p>
        <p className="text-xs text-muted truncate">
          {ROLE_LABELS[author.role] ?? "A'zo"}
          {author.region ? ` — ${author.region.name}` : ""}
        </p>
      </div>
    </Link>
  );
}
