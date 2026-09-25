import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Parolni tiklash | SURXONCHA.UZ",
  ...noIndexMetadata,
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Parolni tiklash</h1>
      <p className="text-sm text-muted mb-6">
        Ro'yxatdan o'tgan email manzilingizni kiriting.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
