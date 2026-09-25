import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/+$/, "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.article || !body?.name || !body?.message) {
    return NextResponse.json({ error: "Maqola, ism va izoh majburiy." }, { status: 400 });
  }

  const response = await fetch(`${STRAPI_URL}/api/article-comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        article: Number(body.article),
        name: String(body.name).trim().slice(0, 80),
        email: body.email ? String(body.email).trim() : undefined,
        message: String(body.message).trim().slice(0, 1000),
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Izoh yuborilmadi." }, { status: 502 });
  }
  return NextResponse.json({ submitted: true }, { status: 201 });
}