import type { Metadata } from "next";
import { requireUser, canSubmitArticles } from "@/lib/auth/session";
import { SubmitArticleForm } from "@/components/forms/SubmitArticleForm";
import { getAllCategories } from "@/lib/api/categories";
import { getAllRegions } from "@/lib/api/regions";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = { title: "Maqola yuborish | SURXONCHA.UZ", ...noIndexMetadata };

export default async function SubmitPage() {
  const user = await requireUser(); // middleware ham himoyalaydi — bu ikkinchi qatlam

  if (!canSubmitArticles(user.role)) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <h1 className="text-xl font-bold mb-3">Bu bo'lim faqat Contributor'lar uchun</h1>
        <p className="text-sm text-muted mb-6">
          Maqola yuborish uchun avval jamoaga qo'shilish arizasini topshiring.
          Tahririyat tasdiqlagach, shu yerdan maqola yubora olasiz.
        </p>
        <a
          href="/join"
          className="inline-block rounded bg-primary text-white font-semibold px-5 py-2.5 text-sm hover:opacity-90"
        >
          Jamoaga qo'shilish arizasi
        </a>
      </div>
    );
  }

  const [{ data: categories }, { data: regions }] = await Promise.all([
    getAllCategories(),
    getAllRegions(),
  ]);

  return (
    <div className="min-h-screen bg-bg py-10">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Yangi maqola</h1>
        <p className="text-sm text-muted mb-6">
          Tayyor bo'lgach, "Tahririyatga yuborish" tugmasini bosing — maqolangiz
          Editorial Queue'ga tushadi.
        </p>
        <div className="bg-surface border border-border rounded-lg p-6 sm:p-8">
          <SubmitArticleForm categories={categories} regions={regions} />
        </div>
      </div>
    </div>
  );
}
