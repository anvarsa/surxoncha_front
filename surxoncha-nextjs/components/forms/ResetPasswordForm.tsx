"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/lib/validation/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code) {
      setError("Havola yaroqsiz. Qaytadan so'rang.");
      return;
    }

    const parsed = resetPasswordSchema.safeParse({ code, password, passwordConfirmation });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Ma'lumotlar noto'g'ri");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Xatolik yuz berdi.");
        return;
      }
      router.push("/login?reset=1");
    } finally {
      setLoading(false);
    }
  }

  if (!code) {
    return (
      <p className="text-sm text-breaking">
        Havola yaroqsiz yoki muddati o'tgan.{" "}
        <a href="/forgot-password" className="underline">
          Qaytadan so'rang
        </a>
        .
      </p>
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
        <label className="block text-sm font-medium mb-1.5">Yangi parol</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Parolni tasdiqlang</label>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
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
        Parolni yangilash
      </button>
    </form>
  );
}
