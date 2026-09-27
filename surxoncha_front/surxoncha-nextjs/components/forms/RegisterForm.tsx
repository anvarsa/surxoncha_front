"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import {
  registerSchema,
  MEDIA_INTERESTS,
  MEDIA_INTEREST_LABELS,
  type RegisterInput,
} from "@/lib/validation/auth";

interface RegionOption {
  id: number;
  name: string;
  slug: string;
}

const EMPTY: RegisterInput = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  regionSlug: "",
  mediaInterests: [],
  bio: "",
  telegram: "",
  instagram: "",
  portfolioUrl: "",
};

export function RegisterForm({ regions }: { regions: RegionOption[] }) {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof RegisterInput>(key: K, value: RegisterInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInterest(interest: (typeof MEDIA_INTERESTS)[number]) {
    setForm((f) => ({
      ...f,
      mediaInterests: f.mediaInterests.includes(interest)
        ? f.mediaInterests.filter((i) => i !== interest)
        : [...f.mediaInterests, interest],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Xatolik yuz berdi.");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setServerError("Server bilan bog'lanishda xatolik. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded border border-border bg-surface px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <div className="rounded bg-breaking/10 border border-breaking/30 text-breaking text-sm px-3 py-2">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ism" error={fieldErrors.firstName}>
          <input className={inputClass} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
        </Field>
        <Field label="Familiya" error={fieldErrors.lastName}>
          <input className={inputClass} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
        </Field>
      </div>

      <Field label="Username" error={fieldErrors.username} hint="faqat kichik harf, raqam, _ ">
        <input
          className={inputClass}
          value={form.username}
          onChange={(e) => update("username", e.target.value.toLowerCase())}
        />
      </Field>

      <Field label="Email" error={fieldErrors.email}>
        <input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Parol" error={fieldErrors.password}>
          <input
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </Field>
        <Field label="Parolni tasdiqlang" error={fieldErrors.confirmPassword}>
          <input
            type="password"
            className={inputClass}
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Hudud" error={fieldErrors.regionSlug}>
        <select
          className={inputClass}
          value={form.regionSlug}
          onChange={(e) => update("regionSlug", e.target.value)}
        >
          <option value="">Tanlang...</option>
          {regions.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Media qiziqishlar" error={fieldErrors.mediaInterests}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MEDIA_INTERESTS.map((interest) => {
            const active = form.mediaInterests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`flex items-center gap-1.5 rounded border px-2.5 py-2 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-text hover:border-primary/50"
                }`}
              >
                {active && <Check className="h-3 w-3" />}
                {MEDIA_INTEREST_LABELS[interest]}
              </button>
            );
          })}
        </div>
      </Field>

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-muted">
          Qo'shimcha (ixtiyoriy)
        </summary>
        <div className="mt-3 space-y-3">
          <Field label="Bio">
            <textarea
              className={inputClass}
              rows={3}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Telegram">
              <input className={inputClass} value={form.telegram} onChange={(e) => update("telegram", e.target.value)} />
            </Field>
            <Field label="Instagram">
              <input className={inputClass} value={form.instagram} onChange={(e) => update("instagram", e.target.value)} />
            </Field>
          </div>
          <Field label="Portfolio URL" error={fieldErrors.portfolioUrl}>
            <input className={inputClass} value={form.portfolioUrl} onChange={(e) => update("portfolioUrl", e.target.value)} />
          </Field>
        </div>
      </details>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded bg-primary text-white font-semibold py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Ro'yxatdan o'tish
      </button>

      <p className="text-center text-sm text-muted">
        Hisobingiz bormi?{" "}
        <a href="/login" className="text-primary font-medium hover:underline">
          Kirish
        </a>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-breaking">{error}</p>}
    </div>
  );
}
