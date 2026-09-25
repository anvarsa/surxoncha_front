"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, PartyPopper } from "lucide-react";
import {
  applicationSchema,
  type ApplicationInput,
} from "@/lib/validation/application";
import { MEDIA_INTERESTS, MEDIA_INTEREST_LABELS } from "@/lib/validation/auth";

interface RegionOption {
  id: number;
  name: string;
  slug: string;
}

const EMPTY: ApplicationInput = {
  fullName: "",
  regionSlug: "",
  experience: "",
  specialization: [],
  portfolioUrl: "",
  motivation: "",
};

export function JoinForm({ regions }: { regions: RegionOption[] }) {
  const router = useRouter();
  const [form, setForm] = useState<ApplicationInput>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleSpec(interest: (typeof MEDIA_INTERESTS)[number]) {
    setForm((f) => ({
      ...f,
      specialization: f.specialization.includes(interest)
        ? f.specialization.filter((i) => i !== interest)
        : [...f.specialization, interest],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/join");
        return;
      }

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Xatolik yuz berdi.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Server bilan bog'lanishda xatolik.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded border border-border bg-surface px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary";

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-10">
        <PartyPopper className="h-10 w-10 text-secondary" />
        <h2 className="text-lg font-bold">Arizangiz qabul qilindi!</h2>
        <p className="text-sm text-muted max-w-sm">
          Tahririyat arizangizni ko'rib chiqadi. Tasdiqlangach, sizga xabar beriladi
          va maqola yubora olasiz.
        </p>
        <a href="/dashboard" className="text-sm text-primary font-medium hover:underline">
          Dashboard'ga o'tish
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <div className="rounded bg-breaking/10 border border-breaking/30 text-breaking text-sm px-3 py-2">
          {serverError}
        </div>
      )}

      <Field label="To'liq ism" error={fieldErrors.fullName}>
        <input className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
      </Field>

      <Field label="Hudud" error={fieldErrors.regionSlug}>
        <select className={inputClass} value={form.regionSlug} onChange={(e) => update("regionSlug", e.target.value)}>
          <option value="">Tanlang...</option>
          {regions.map((r) => (
            <option key={r.slug} value={r.slug}>{r.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Yo'nalish" error={fieldErrors.specialization}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MEDIA_INTERESTS.map((interest) => {
            const active = form.specialization.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleSpec(interest)}
                className={`flex items-center gap-1.5 rounded border px-2.5 py-2 text-xs font-medium transition ${
                  active ? "border-primary bg-primary text-white" : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                {active && <Check className="h-3 w-3" />}
                {MEDIA_INTEREST_LABELS[interest]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Tajribangiz" error={fieldErrors.experience} hint="Qayerda, qancha vaqt, qanday ishlar bilan shug'ullangansiz">
        <textarea className={inputClass} rows={4} value={form.experience} onChange={(e) => update("experience", e.target.value)} />
      </Field>

      <Field label="Portfolio URL (ixtiyoriy)" error={fieldErrors.portfolioUrl}>
        <input className={inputClass} value={form.portfolioUrl} onChange={(e) => update("portfolioUrl", e.target.value)} />
      </Field>

      <Field label="Nega Surxoncha jamoasiga qo'shilmoqchisiz?" error={fieldErrors.motivation}>
        <textarea className={inputClass} rows={4} value={form.motivation} onChange={(e) => update("motivation", e.target.value)} />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded bg-primary text-white font-semibold py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Arizani yuborish
      </button>
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
