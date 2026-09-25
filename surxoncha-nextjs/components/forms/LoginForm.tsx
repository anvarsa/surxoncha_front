"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "@/lib/validation/auth";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ identifier, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Ma'lumotlar noto'g'ri");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Email/username yoki parol noto'g'ri.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="rounded bg-breaking/10 border border-breaking/30 text-breaking text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium mb-1.5">
          Email yoki username
        </label>
        <input
          id="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-sm font-medium">
            Parol
          </label>
          <a href="/forgot-password" className="text-xs text-primary hover:underline">
            Parolni unutdingizmi?
          </a>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        Kirish
      </button>

      <p className="text-center text-sm text-muted">
        Hisobingiz yo'qmi?{" "}
        <a href="/register" className="text-primary font-medium hover:underline">
          Ro'yxatdan o'ting
        </a>
      </p>
    </form>
  );
}
