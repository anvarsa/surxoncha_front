import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Yangi parol | SURXONCHA.UZ",
  ...noIndexMetadata,
};

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Yangi parol o'rnatish</h1>
      <p className="text-sm text-muted mb-6">
        Email orqali kelgan havoladan shu sahifaga o'tdingiz.
      </p>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
