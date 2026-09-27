import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/auth";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // write-scoped, server-only

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    firstName,
    lastName,
    username,
    email,
    password,
    regionSlug,
    mediaInterests,
    bio,
    telegram,
    instagram,
    portfolioUrl,
  } = parsed.data;

  // 1. Strapi users-permissions'da foydalanuvchi yaratamiz.
  const registerRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!registerRes.ok) {
    const errBody = await registerRes.json().catch(() => null);
    const message =
      errBody?.error?.message === "Email or Username are already taken"
        ? "Bu email yoki username allaqachon band."
        : "Ro'yxatdan o'tishda xatolik yuz berdi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { jwt, user } = (await registerRes.json()) as {
    jwt: string;
    user: { id: number };
  };

  // 2. Hudud id'sini slug orqali topamiz.
  const regionRes = await fetch(
    `${STRAPI_URL}/api/regions?filters[slug][$eq]=${regionSlug}`,
    { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
  );
  const regionJson = await regionRes.json();
  const regionId = regionJson.data?.[0]?.id;

  // 3. Public AuthorProfile yaratamiz — communityRole doim "registered_user"dan boshlanadi,
  //    Contributor/Reporter huquqi faqat /join arizasi tasdiqlangach beriladi (4-qism).
  const profileRes = await fetch(`${STRAPI_URL}/api/author-profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        user: user.id,
        username,
        displayName: `${firstName} ${lastName}`,
        bio: bio || undefined,
        region: regionId,
        communityRole: "registered_user",
        mediaInterests,
        telegram: telegram || undefined,
        instagram: instagram || undefined,
        portfolioUrl: portfolioUrl || undefined,
        joinedAt: new Date().toISOString(),
      },
    }),
  });

  if (!profileRes.ok) {
    // Foydalanuvchi allaqachon yaratilgan — profil xatosi haqida aniq xabar beramiz,
    // lekin registratsiyani "muvaffaqiyatsiz" deb ko'rsatmaymiz, chunki login qila oladi.
    return NextResponse.json(
      {
        warning:
          "Hisob yaratildi, lekin profil to'liq sozlanmadi. Profilni /dashboard/profile'da to'ldiring.",
      },
      { status: 201 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
