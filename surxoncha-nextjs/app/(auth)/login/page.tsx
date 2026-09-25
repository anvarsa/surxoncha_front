import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Kirish | SURXONCHA.UZ",
  ...noIndexMetadata,
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Tizimga kirish</h1>
      <p className="text-sm text-muted mb-6">
        Surxoncha jamoasiga xush kelibsiz.
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
