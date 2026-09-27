import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validation/auth";

const STRAPI_URL = process.env.STRAPI_URL;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email manzil noto'g'ri" }, { status: 400 });
  }

  // Strapi bu so'rovga har doim 200 qaytaradi (email mavjud/mavjud emasligini
  // oshkor qilmaslik uchun) — biz ham xuddi shunday xatti-tutamiz.
  await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: parsed.data.email }),
  }).catch(() => null);

  return NextResponse.json({
    message:
      "Agar bu email ro'yxatdan o'tgan bo'lsa, parolni tiklash havolasi yuborildi.",
  });
}
