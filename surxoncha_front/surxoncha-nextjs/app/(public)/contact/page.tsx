import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Aloqa | SURXONCHA.UZ",
  description: "Tahririyat, hamkorlik, reklama yoki ko'ngillilik bo'yicha biz bilan bog'laning.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-lg py-12">
      <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-2">Aloqa</h1>
      <p className="text-muted mb-8">
        Tahririyat, hamkorlik, reklama yoki ko'ngillilik bo'yicha savolingiz
        bo'lsa, quyidagi forma orqali yozing.
      </p>
      <div className="bg-surface border border-border rounded-lg p-6">
        <ContactForm />
      </div>
    </div>
  );
}
