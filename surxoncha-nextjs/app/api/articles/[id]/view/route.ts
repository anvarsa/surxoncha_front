import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${STRAPI_URL}/api/articles/${id}/view`, {
      method: "POST",
    });
    if (!res.ok) return NextResponse.json({ ok: false }, { status: 200 });
    const json = await res.json();
    return NextResponse.json({ ok: true, viewCount: json.data?.viewCount });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
