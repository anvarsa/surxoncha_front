"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X } from "lucide-react";
import type { ContributorApplication } from "@/types/content";
import { formatDate } from "@/lib/utils";
import { MEDIA_INTEREST_LABELS } from "@/lib/validation/auth";

export function ApplicationRow({ application }: { application: ContributorApplication }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(action: "approve" | "reject") {
    setError(null);
    setLoading(action);
    try {
      const res = await fetch(`/api/applications/${application.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Xatolik yuz berdi.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="border-b border-border last:border-0 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{application.fullName}</p>
          <p className="text-xs text-muted mt-0.5">
            {application.region?.name} · {formatDate(application.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handle("approve")}
            disabled={loading !== null}
            className="flex items-center gap-1.5 rounded bg-primary text-white px-2.5 py-1.5 text-xs font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading === "approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Tasdiqlash
          </button>
          <button
            onClick={() => handle("reject")}
            disabled={loading !== null}
            className="flex items-center gap-1.5 rounded border border-breaking/40 text-breaking px-2.5 py-1.5 text-xs font-semibold hover:bg-breaking/5 disabled:opacity-50"
          >
            {loading === "reject" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
            Rad etish
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {application.specialization?.map((s: string) => (
          <span key={s} className="text-xs rounded-full border border-border px-2 py-0.5 text-muted">
            {MEDIA_INTEREST_LABELS[s as keyof typeof MEDIA_INTEREST_LABELS] ?? s}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted mt-2 line-clamp-2">{application.motivation}</p>
      {error && <p className="text-xs text-breaking mt-1.5">{error}</p>}
    </div>
  );
}
