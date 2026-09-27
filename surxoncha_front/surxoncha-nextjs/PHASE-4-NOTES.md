# 4-qism: Contributor arizasi va Maqola yuborish — nima qo'shildi

## Test stsenariysi 4–10 qadamlari endi real ishlaydi

4. `/join` — `JoinForm` → `POST /api/applications` → sessiya tekshiriladi →
   Strapi `contributor-application` yozuvi yaratiladi (`status: pending`).
5. Admin/Editor tasdiqlaydi: `POST /contributor-applications/:id/approve`
   (Strapi custom controller) — bu ikkita ishni birga qiladi:
   - `contributor-application.status = approved`
   - arizachining **AuthorProfile.communityRole**ni `contributor`ga o'zgartiradi
6. Foydalanuvchi endi Contributor — keyingi login/session yangilanishida
   `session.user.role === "contributor"` bo'ladi, `/submit`ga kira oladi.
7–9. `/submit` — `SubmitArticleForm`:
   - Muqova rasm: `POST /api/upload` → **magic-byte** orqali haqiqiy MIME
     tekshiriladi (fayl kengaytmasi emas — spec 47-band), 8MB limit,
     so'ng Strapi Media Library'ga yuklanadi.
   - Sarlavhadan slug avtomatik generatsiya qilinadi (qo'lda ham
     o'zgartirsa bo'ladi).
   - Teglar (vergul bilan) → `resolveTagIds()` mavjudlarini topadi,
     yangi tag'larni yaratadi.
   - `POST /api/submit-article` → `createDraftArticle()` (2-qismdagi
     lifecycles.js har doim `status: draft` qiladi) → **darhol**
     `submitArticle(id)` chaqiriladi → `draft → submitted`.
10. Status = "submitted" — Editorial Queue'da ko'rinadi (8-qismda UI).

## Fayllar

```
lib/
├── validation/application.ts   # applicationSchema, articleSubmissionSchema
├── api/
│   ├── categories.ts
│   ├── contributor-applications.ts
│   ├── media.ts                 # client-side uploadImage()
│   └── tags.ts                  # server-only: resolveTagIds, resolveIdBySlug
│
app/
├── api/
│   ├── applications/route.ts     # /join backend
│   ├── upload/route.ts           # magic-byte MIME tekshiruvi + Strapi upload proxy
│   ├── tags-resolve/route.ts     # (standalone, ixtiyoriy foydalanish uchun)
│   └── submit-article/route.ts   # /submit backend — create + submit ikki bosqich
├── (public)/join/page.tsx
└── (community)/submit/page.tsx    # role-gate: faqat contributor/reporter/editor/admin

strapi-schemas/src/api/contributor-application/
├── controllers/contributor-application.js   # approve()/reject() — role promotion shu yerda
└── routes/
    ├── contributor-application.js
    └── custom-contributor-application.js
```

`strapi-schemas/src/index.js` yangilandi: `moderator` va `editor` rollariga
`.approve`/`.reject` permission qo'shildi.

## Xavfsizlik eslatmalari

- Rasm yuklashda fayl **kengaytmasiga emas**, balki fayl boshidagi
  magic-byte imzosiga (`\xFF\xD8\xFF` = JPEG, `\x89PNG` va h.k.) qaraladi —
  kimdir `.jpg` deb nomlangan zararli faylni yuklay olmaydi.
- `/submit` uchun uch qatlam himoya: middleware (auth bor/yo'qligi) →
  page-level `canSubmitArticles()` tekshiruvi (foydalanuvchiga tushunarli
  xabar) → route handler'dagi qat'iy tekshiruv (haqiqiy ruxsat manbai).
- Tag yaratish uchun write-token faqat server-side route handler ichida
  ishlatiladi, contributor'ning o'z tokeni bilan emas — shu orqali
  spam-tag yaratish cheklanadi (10 tadan ko'p tag qabul qilinmaydi).

## Keyingi qism

**5-qism** — Public frontend sahifalar: bosh sahifa (hero, latest news,
regional, breaking bar), `/news/[slug]`, `/category/[slug]`,
`/regions/[slug]`, `/authors/[username]`, `/search`. Shu qismdan boshlab
sayt birinchi marta **ko'rinadigan** bo'ladi.

Davom ettirish uchun: **"5-qismni boshla"**
