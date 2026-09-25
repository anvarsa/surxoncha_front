import type { ArticleStatus } from "@/types/content";

const CONFIG: Record<ArticleStatus, { label: string; className: string }> = {
  draft: { label: "Qoralama", className: "bg-border text-muted" },
  submitted: { label: "Yuborilgan", className: "bg-secondary/20 text-secondary" },
  in_review: { label: "Tekshirilmoqda", className: "bg-secondary/20 text-secondary" },
  revision_requested: { label: "Qayta ko'rib chiqish", className: "bg-breaking/10 text-breaking" },
  approved: { label: "Tasdiqlangan", className: "bg-primary/10 text-primary" },
  published: { label: "Nashr qilingan", className: "bg-primary text-white" },
  rejected: { label: "Rad etilgan", className: "bg-breaking/10 text-breaking" },
  archived: { label: "Arxivlangan", className: "bg-border text-muted" },
};

export function EditorialStatusBadge({ status }: { status: ArticleStatus }) {
  const config = CONFIG[status] ?? CONFIG.draft;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
