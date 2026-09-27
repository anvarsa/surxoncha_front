import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { getAllRegions } from "@/lib/api/regions";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish | SURXONCHA.UZ",
  ...noIndexMetadata,
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const { data: regions } = await getAllRegions();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Ro'yxatdan o'tish</h1>
      <p className="text-sm text-muted mb-6">
        Surxoncha jamoasiga birinchi qadam — hisob yarating.
      </p>
      <RegisterForm regions={regions} />
    </div>
  );
}
