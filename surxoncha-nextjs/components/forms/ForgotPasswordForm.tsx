"use client";

import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Email noto'g'ri");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <MailCheck className="h-10 w-10 text-primary" />
        <p className="text-sm text-muted max-w-xs">
          Agar <strong>{email}</strong> ro'yxatdan o'tgan bo'lsa, parolni tiklash havolasi
          shu manzilga yuborildi.
        </p>
        <a href="/login" className="text-sm text-primary font-medium hover:underline">
          Kirish sahifasiga qaytish
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="rounded bg-breaking/10 border border-breaking/30 text-breaking text-sm px-3 py-2">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded bg-primary text-white font-semibold py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Tiklash havolasini yuborish
      </button>
    </form>
  );
}
