import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { applicationSchema } from "@/lib/validation/application";
import { createContributorApplication } from "@/lib/api/contributor-applications";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Tizimga kiring." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { regionSlug, ...rest } = parsed.data;

  const regionRes = await fetch(
    `${STRAPI_URL}/api/regions?filters[slug][$eq]=${regionSlug}`,
    { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
  );
  const regionJson = await regionRes.json();
  const regionId = regionJson.data?.[0]?.id;
  if (!regionId) {
    return NextResponse.json({ error: "Hudud topilmadi." }, { status: 400 });
  }

  try {
    await createContributorApplication(session.strapiJwt, {
      applicantUserId: session.user.id,
      regionId,
      fullName: rest.fullName,
      experience: rest.experience,
      specialization: rest.specialization,
      portfolioUrl: rest.portfolioUrl,
      motivation: rest.motivation,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
