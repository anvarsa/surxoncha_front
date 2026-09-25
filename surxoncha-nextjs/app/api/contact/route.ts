import { NextResponse } from "next/server";
import { z } from "zod";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const contactSchema = z.object({
  name: z.string().min(2, "Ismni kiriting").max(100),
  email: z.string().email("Email noto'g'ri"),
  subject: z.enum(["editorial", "general", "partnership", "advertising", "volunteer"]),
  message: z.string().min(10, "Xabar kamida 10 belgi").max(3000),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const res = await fetch(`${STRAPI_URL}/api/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: { ...parsed.data, resolved: false } }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Xabar yuborishda xatolik yuz berdi." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
