# 3-qism: Autentifikatsiya — nima qo'shildi

## Oqim (test stsenariysi 1-6 qadamlari, real ishlaydi)

1. `/register` — `RegisterForm` zod bilan client-side validatsiya qiladi,
   `POST /api/register` chaqiradi.
2. `app/api/register/route.ts`:
   - Strapi `POST /api/auth/local/register` → user + jwt.
   - Region slug → id (Strapi'dan).
   - Strapi `POST /api/author-profiles` (foydalanuvchining o'z jwt'i bilan) →
     `communityRole: "registered_user"` bilan public profil yaratiladi.
3. `/login` — `LoginForm` NextAuth `signIn("credentials", …)` chaqiradi.
4. `lib/auth/options.ts` — Strapi `POST /api/auth/local` orqali tekshiradi,
   so'ng foydalanuvchining `author-profile`sini topib, `role` va
   `authorProfileId`ni JWT/session ichiga yozadi.
5. `middleware.ts` — `/dashboard/*` va `/submit/*` ni himoyalaydi;
   `/dashboard/editor/*` faqat `editor`/`administrator` role'iga ochiq.
6. `/forgot-password` → `/api/forgot-password` → Strapi
   `/api/auth/forgot-password` (email orqali kod yuboradi).
7. `/reset-password?code=...` → `/api/reset-password` → Strapi
   `/api/auth/reset-password`.

## Fayllar

```
lib/
├── auth/
│   ├── options.ts     # NextAuth CredentialsProvider + Strapi integratsiya
│   └── session.ts      # getCurrentUser, requireUser, requireEditor, isEditor
├── validation/auth.ts   # zod: registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema
└── api/regions.ts        # getAllRegions (register formda hudud tanlash uchun)

types/next-auth.d.ts       # Session/JWT'ga role + authorProfileId qo'shildi

middleware.ts                # /dashboard, /submit himoyasi

app/
├── layout.tsx                          # AuthSessionProvider ulandi
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── register/route.ts               # user + author-profile birga yaratiladi
│   ├── forgot-password/route.ts
│   └── reset-password/route.ts
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
└── (community)/dashboard/page.tsx      # stub — to'liq versiya 8-qismda

components/
├── providers/SessionProvider.tsx
└── forms/
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    ├── ForgotPasswordForm.tsx
    └── ResetPasswordForm.tsx
```

## Sinash

```bash
npm run dev
```

1. `http://localhost:3000/register` — forma to'ldiring, hudud tanlang,
   kamida bitta media yo'nalish belgilang.
2. Strapi admin panelida **Content Manager → Author Profile**da yangi
   yozuv paydo bo'lishi kerak, `communityRole = registered_user`.
3. `/login` orqali kiring → `/dashboard`ga yo'naltiriladi, sessiya
   ma'lumotlari (username, rol, authorProfileId) ko'rinadi.
4. Sessiyasiz `/dashboard`ga kirishga urinib ko'ring — `/login`ga
   `callbackUrl` bilan qaytariladi.

## Xavfsizlik eslatmalari

- `STRAPI_API_TOKEN` (write-scoped) faqat `app/api/register/route.ts` kabi
  **server-side route handler**larda ishlatiladi — hech qachon client
  komponentga yoki `NEXT_PUBLIC_*` o'zgaruvchiga tushmaydi.
- Parol qoidalari: kamida 8 belgi, 1 katta harf, 1 raqam — `registerSchema`da
  ham, Strapi user-permissions plugin sozlamalarida ham (admin panelda
  **Settings → Advanced Settings**da minimal parol siyosatini yoqish tavsiya
  etiladi).
- `forgot-password` javobi email mavjud/mavjud emasligini oshkor qilmaydi —
  har doim bir xil xabar qaytadi (user enumeration'ning oldini olish).

## Keyingi qism

**4-qism** — Editorial workflow frontend: `/join` (contributor arizasi),
`/submit` (maqola yuborish formasi), va bu ikkisini 2-qismdagi backend
endpoint'lariga ulash.

Davom ettirish uchun: **"4-qismni boshla"**
