"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, UploadCloud, X } from "lucide-react";
import {
  articleSubmissionSchema,
  CONTENT_TYPES,
  CONTENT_TYPE_LABELS,
  type ArticleSubmissionInput,
} from "@/lib/validation/application";
import { uploadImage } from "@/lib/api/media";
import { mediaUrl } from "@/lib/utils";

interface Option {
  name: string;
  slug: string;
}

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/['"‘’“”]/g, "")
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const EMPTY: Omit<ArticleSubmissionInput, "coverImageId"> & { coverImageId: number | null } = {
  contentType: "news",
  title: "",
  slug: "",
  categorySlug: "",
  regionSlug: "",
  excerpt: "",
  content: "",
  coverImageId: null,
  videoUrl: "",
  source: "",
  tags: "",
  authorNotes: "",
};

interface EditModeProps {
  articleId: number;
  initialValues: Omit<ArticleSubmissionInput, "coverImageId"> & {
    coverImageId: number | null;
    coverImageUrl?: string;
  };
  /** true bo'lsa "Saqlash va qayta yuborish", aks holda faqat "Saqlash" */
  canResubmit?: boolean;
}

export function SubmitArticleForm({
  categories,
  regions,
  editMode,
}: {
  categories: Option[];
  regions: Option[];
  editMode?: EditModeProps;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(editMode?.initialValues ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(!!editMode); // edit rejimida slug qo'lda o'zgartirilmaguncha o'zgarmasin
  const [coverPreview, setCoverPreview] = useState<string | null>(
    editMode?.initialValues.coverImageUrl ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }


  function handleTitleChange(value: string) {
    update("title", value);
    if (!slugTouched) update("slug", slugifyTitle(value));
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setServerError(null);
    try {
      const asset = await uploadImage(file);
      update("coverImageId", asset.id);
      setCoverPreview(mediaUrl(asset.url));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Rasm yuklashda xatolik.");
    } finally {
      setUploading(false);
    }
  }

  function removeCover() {
    update("coverImageId", null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent, resubmit = false) {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const parsed = articleSubmissionSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = editMode
        ? await fetch(`/api/edit-article/${editMode.articleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...parsed.data, resubmit }),
          })
        : await fetch("/api/submit-article", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
          });
      const json = await res.json();

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${editMode ? `/dashboard/articles/${editMode.articleId}/edit` : "/submit"}`);
        return;
      }
      if (res.status === 403) {
        setServerError(json.error);
        return;
      }
      if (!res.ok && res.status !== 207) {
        setServerError(json.error ?? "Xatolik yuz berdi.");
        return;
      }

      router.push("/dashboard?submitted=1");
      router.refresh();
    } catch {
      setServerError("Server bilan bog'lanishda xatolik.");
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

      <Field label="Material turi">
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => update("contentType", type)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                form.contentType === type
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface hover:border-primary/50"
              }`}
            >
              {CONTENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Sarlavha" error={fieldErrors.title}>
        <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
      </Field>

      <Field label="Slug (URL)" error={fieldErrors.slug} hint="surxoncha.uz/news/[shu-qism]">
        <input
          className={inputClass}
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kategoriya" error={fieldErrors.categorySlug}>
          <select className={inputClass} value={form.categorySlug} onChange={(e) => update("categorySlug", e.target.value)}>
            <option value="">Tanlang...</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Hudud (ixtiyoriy)">
          <select className={inputClass} value={form.regionSlug} onChange={(e) => update("regionSlug", e.target.value)}>
            <option value="">—</option>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Muqova rasm" error={fieldErrors.coverImageId}>
        {coverPreview ? (
          <div className="relative w-full aspect-[16/9] rounded overflow-hidden border border-border">
            <Image src={coverPreview} alt="Muqova" fill className="object-cover" />
            <button
              type="button"
              onClick={removeCover}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-8 cursor-pointer hover:border-primary/50 transition">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            ) : (
              <UploadCloud className="h-6 w-6 text-muted" />
            )}
            <span className="text-sm text-muted">
              {uploading ? "Yuklanmoqda..." : "Rasm tanlash uchun bosing (JPEG/PNG/WebP, 8MB gacha)"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleCoverChange}
              disabled={uploading}
            />
          </label>
        )}
      </Field>

      <Field label="Qisqacha mazmun (excerpt)" error={fieldErrors.excerpt}>
        <textarea className={inputClass} rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
      </Field>

      <Field label="Maqola matni" error={fieldErrors.content}>
        <textarea className={inputClass} rows={12} value={form.content} onChange={(e) => update("content", e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Video URL (ixtiyoriy)" error={fieldErrors.videoUrl}>
          <input className={inputClass} value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} />
        </Field>
        <Field label="Manba (ixtiyoriy)">
          <input className={inputClass} value={form.source} onChange={(e) => update("source", e.target.value)} />
        </Field>
      </div>

      <Field label="Teglar (vergul bilan ajrating)">
        <input
          className={inputClass}
          placeholder="Termiz, yoshlar, texnologiya"
          value={form.tags}
          onChange={(e) => update("tags", e.target.value)}
        />
      </Field>

      <Field label="Muharrirlar uchun izoh (ixtiyoriy)">
        <textarea className={inputClass} rows={2} value={form.authorNotes} onChange={(e) => update("authorNotes", e.target.value)} />
      </Field>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full flex items-center justify-center gap-2 rounded bg-primary text-white font-bold py-3 text-sm uppercase tracking-wide hover:opacity-90 transition disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {editMode ? (editMode.canResubmit ? "Saqlash (qayta yubormasdan)" : "Saqlash") : "Tahririyatga yuborish"}
      </button>

      {editMode?.canResubmit && (
        <button
          type="button"
          disabled={loading || uploading}
          onClick={(e) => handleSubmit(e, true)}
          className="w-full flex items-center justify-center gap-2 rounded border-2 border-primary text-primary font-bold py-3 text-sm uppercase tracking-wide hover:bg-primary/5 transition disabled:opacity-60"
        >
          Saqlash va qayta yuborish
        </button>
      )}
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
