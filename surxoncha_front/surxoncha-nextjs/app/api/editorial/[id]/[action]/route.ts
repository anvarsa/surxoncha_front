import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

const STRAPI_URL = process.env.STRAPI_URL;

const ALLOWED_ACTIONS = new Set([
  "submit",
  "approve",
  "reject",
  "request-revision",
  "publish",
]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const { id, action } = await params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Tizimga kiring." }, { status: 401 });
  }

  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ error: "Noma'lum amal." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));

  // Haqiqiy ruxsat tekshiruvi Strapi tomonida: is-owner-or-editor policy
  // ("submit" uchun) va users-permissions role (qolganlari uchun,
  // faqat Editor/Administrator rolida yoqilgan — 2-qism, index.js).
  // Bu route faqat proxy — u yerda hech qanday "ishon" qaror yo'q.
  const res = await fetch(`${STRAPI_URL}/api/articles/${id}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.strapiJwt}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { error: json?.error?.message || "Amalni bajarishda xatolik yuz berdi." },
      { status: res.status }
    );
  }

  return NextResponse.json(json);
}
