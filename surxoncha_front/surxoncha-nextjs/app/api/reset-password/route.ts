import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validation/auth";

const STRAPI_URL = process.env.STRAPI_URL;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ma'lumotlar noto'g'ri", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Havola muddati o'tgan yoki noto'g'ri. Qaytadan so'rang." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Parol muvaffaqiyatli yangilandi." });
}
