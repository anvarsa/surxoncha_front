"use client";

import { useState } from "react";
import type { ArticleComment } from "@/types/content";

export function CommentsSection({ articleId, comments }: { articleId: number; comments: ArticleComment[] }) {
  const [items, setItems] = useState(comments);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article: articleId, ...form }),
    });
    if (!response.ok) {
      setStatus("Izoh yuborilmadi. Maydonlarni tekshiring.");
      return;
    }
    setForm({ name: "", email: "", message: "" });
    setStatus("Izohingiz moderatsiyaga yuborildi.");
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-5 text-2xl font-extrabold">Izohlar ({items.length})</h2>
      {items.length > 0 && <div className="mb-8 space-y-4">{items.map((comment) => <article key={comment.id} className="rounded border border-border bg-bg p-4"><p className="font-bold">{comment.name}</p><p className="mt-1 text-sm text-text">{comment.message}</p></article>)}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ismingiz" className="rounded border border-border bg-surface px-3 py-2 text-sm" />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (ixtiyoriy)" className="rounded border border-border bg-surface px-3 py-2 text-sm" />
        </div>
        <textarea required minLength={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Izohingiz" rows={4} className="w-full rounded border border-border bg-surface px-3 py-2 text-sm" />
        <button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white">Izoh yuborish</button>
        {status && <p className="text-sm text-muted">{status}</p>}
      </form>
    </section>
  );
}