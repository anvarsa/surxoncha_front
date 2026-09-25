import type { Metadata } from "next";
import { JoinForm } from "@/components/forms/JoinForm";
import { getAllRegions } from "@/lib/api/regions";

export const metadata: Metadata = {
  title: "Jamoaga qo'shiling | SURXONCHA.UZ",
  description:
    "Surxondaryo bo'ylab yoshlar uchun ochiq media hamjamiyati — Surxoncha jamoasiga qo'shiling.",
};

export default async function JoinPage() {
  const { data: regions } = await getAllRegions();

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-primary text-white">
        <div className="container max-w-2xl py-14 text-center">
          <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-3">
            Surxoncha jamoasiga qo'shiling
          </h1>
          <p className="text-white/85 max-w-xl mx-auto">
            Biz Surxondaryo bo'ylab yoshlar uchun ochiq media hamjamiyati quryapmiz.
            Jurnalistika, fotografiya, videografiya, dizayn, SMM — qaysi
            yo'nalishda bo'lmasin, sizga o'rin bor.
          </p>
        </div>
      </div>

      <div className="container max-w-xl py-10">
        <div className="bg-surface border border-border rounded-lg p-6 sm:p-8">
          <JoinForm regions={regions} />
        </div>
      </div>
    </div>
  );
}
