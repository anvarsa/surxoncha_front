"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Check, X, MessageSquareWarning, Send } from "lucide-react";
import type { Article } from "@/types/content";
import { mediaUrl, formatRelativeTime } from "@/lib/utils";
import { EditorialStatusBadge } from "./EditorialStatusBadge";

async function callEditorialAction(articleId: number, action: string, note?: string) {
  const res = await fetch(`/api/editorial/${articleId}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note ? { note } : {}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Amalni bajarishda xatolik yuz berdi.");
  return json;
}

export function EditorialQueueRow({ article }: { article: Article }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(action: string, note?: string) {
    setError(null);
    setLoading(action);
    try {
      await callEditorialAction(article.id, action, note);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(null);
    }
  }

  function handleRequestRevision() {
    const note = window.prompt("Qayta ko'rib chiqish sababini yozing:");
    if (!note) return;
    handle("request-revision", note);
  }

  function handleReject() {
    const note = window.prompt("Rad etish sababi (ixtiyoriy):") || undefined;
    handle("reject", note);
  }

  return (
    <div className="border-b border-border last:border-0 py-4">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-24 shrink-0 rounded overflow-hidden bg-border">
          <Image src={mediaUrl(article.coverImage?.url)} alt="" fill className="object-cover" sizes="96px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <EditorialStatusBadge status={article.status} />
            <span className="text-xs text-muted">{formatRelativeTime(article.updatedAt)}</span>
          </div>
          <p className="font-semibold leading-snug">{article.title}</p>
          <p className="text-xs text-muted mt-0.5">
            {article.author?.displayName} · {article.category?.name}
          </p>
        </div>
      </div>

      {error && <p className="text-xs text-breaking mt-2">{error}</p>}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Link
          href={`/dashboard/articles/${article.id}/edit`}
          className="text-xs font-medium text-muted hover:text-text border border-border rounded px-2.5 py-1.5"
        >
          Ko'rish / tahrirlash
        </Link>

        {article.status !== "approved" && (
          <ActionButton
            label="Tasdiqlash"
            icon={Check}
            loading={loading === "approve"}
            onClick={() => handle("approve")}
            variant="primary"
          />
        )}
        {article.status === "approved" && (
          <ActionButton
            label="Nashr qilish"
            icon={Send}
            loading={loading === "publish"}
            onClick={() => handle("publish")}
            variant="primary"
          />
        )}
        <ActionButton
          label="Qayta ko'rib chiqish"
          icon={MessageSquareWarning}
          loading={loading === "request-revision"}
          onClick={handleRequestRevision}
          variant="secondary"
        />
        <ActionButton
          label="Rad etish"
          icon={X}
          loading={loading === "reject"}
          onClick={handleReject}
          variant="danger"
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  loading,
  onClick,
  variant,
}: {
  label: string;
  icon: typeof Check;
  loading: boolean;
  onClick: () => void;
  variant: "primary" | "secondary" | "danger";
}) {
  const styles = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "border border-border text-text hover:border-primary",
    danger: "border border-breaking/40 text-breaking hover:bg-breaking/5",
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${styles}`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
