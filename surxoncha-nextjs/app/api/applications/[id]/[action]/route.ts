import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

const STRAPI_URL = process.env.STRAPI_URL;
const ALLOWED_ACTIONS = new Set(["approve", "reject"]);

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

  const res = await fetch(`${STRAPI_URL}/api/contributor-applications/${id}/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.strapiJwt}`,
      },
      body: JSON.stringify(body),
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { error: json?.error?.message || "Amalni bajarishda xatolik yuz berdi." },
      { status: res.status }
    );
  }

  return NextResponse.json(json);
}
