"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const SUBJECTS = [
  { value: "editorial", label: "Tahririyat" },
  { value: "general", label: "Umumiy" },
  { value: "partnership", label: "Hamkorlik" },
  { value: "advertising", label: "Reklama" },
  { value: "volunteer", label: "Ko'ngillilik" },
] as const;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Xatolik yuz berdi.");
        return;
      }
      setSent(true);
    } catch {
      setError("Server bilan bog'lanishda xatolik.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded border border-border bg-surface px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary";

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-10">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <p className="font-semibold">Xabaringiz yuborildi</p>
        <p className="text-sm text-muted">Tez orada siz bilan bog'lanamiz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded bg-breaking/10 border border-breaking/30 text-breaking text-sm px-3 py-2">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Ismingiz</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Mavzu</label>
        <select
          className={inputClass}
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Xabar</label>
        <textarea
          className={inputClass}
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded bg-primary text-white font-semibold py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Yuborish
      </button>
    </form>
  );
}
