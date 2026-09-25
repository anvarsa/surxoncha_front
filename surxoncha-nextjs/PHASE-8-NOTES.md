# 8-qism: Dashboard'lar — nima qo'shildi (YAKUNIY QISM)

## Xavfsizlik tuzatishi (eng muhimi)

Dashboard qurishdan oldin bitta bo'shliqni yopish kerak edi: `find`
ruxsati bilan Contributor boshqa birovning qoralamasini ko'ra olardi.
Ikkala controller'ga **ownership-scoping** qo'shildi:

- `article` controller: `find()` override — Editor/Administrator
  cheklovsiz; boshqa hamma faqat `status=published` YOKI o'ziniki
  bo'lgan maqolalarni ko'radi.
- `contributor-application` controller: `find()` override — Editor/
  Moderator/Administrator hammasini; boshqalar faqat o'z arizasini.
- `article` route: `findOne`ga ham `is-owner-or-editor` policy qo'shildi
  (tahrirlash sahifasi shundan foydalanadi).

## Yangi: maqolani tahrirlash (test-stsenariysi 13–15 qadamlari)

Avvalgi qismlarda yetishmayotgan halqa — endi to'liq:

- `SubmitArticleForm` endi `editMode` prop qabul qiladi — bir xil forma
  ham yangi maqola yaratish, ham mavjudini tahrirlash uchun ishlaydi.
- `/dashboard/articles/[id]/edit` — maqolani `getArticleForEdit()`
  (egalik tekshiruvi bilan) yuklaydi, formani to'ldiradi, muharrir
  izohini (agar `revision_requested` bo'lsa) ko'rsatadi.
- `PUT /api/edit-article/[id]` — kontentni yangilaydi (foydalanuvchining
  **o'z JWT'i** bilan, `STRAPI_API_TOKEN` emas — shu orqali
  `is-owner-or-editor` policy ishlaydi), ixtiyoriy `resubmit: true`
  bilan darhol qayta yuboradi (`revision_requested → submitted`).

## Contributor Dashboard (`/dashboard`)

- Rol `registered_user` bo'lsa: ariza holati ko'rsatiladi (yo'q/
  `pending`/`rejected`) va tegishli CTA.
- Rol `contributor`/`reporter` bo'lsa: statistika kartalari (jami,
  nashr qilingan, tekshiruvda, qayta ko'rib chiqish) + barcha
  maqolalari ro'yxati, har biriga holat belgisi va "Tahrirlash"/"Ko'rish"
  havolasi.

## Editor Dashboard

- **`/dashboard/editor`** — Editorial Queue: `submitted`+`in_review`
  maqolalar, eng uzoq kutgani birinchi. Har bir qatorda real tugmalar:
  **Tasdiqlash**, **Nashr qilish** (faqat `approved` holatda chiqadi),
  **Qayta ko'rib chiqish** (sababni so'raydi), **Rad etish**. Har bir
  bosilgan tugma `/api/editorial/:id/:action` → Strapi'ning 2-qismda
  yaratilgan endpoint'iga, foydalanuvchining o'z JWT'i bilan boradi —
  frontend hech qanday "ruxsat bor" qarorini o'zi qabul qilmaydi.
- **`/dashboard/editor/applications`** — kutilayotgan arizalar,
  **Tasdiqlash/Rad etish** tugmalari (4-qismdagi `approve`/`reject`
  endpoint'iga ulangan — tasdiqlash arizachini avtomatik Contributor
  qiladi).

## Fayllar

```
strapi-schemas/src/api/
├── article/controllers/article.js            # +find() ownership-scoping
├── article/routes/article.js                   # +findOne policy
└── contributor-application/controllers/…       # +find() ownership-scoping

lib/api/dashboard.ts   # getMyArticles, getEditorialQueue, getArticleCountsByStatus,
                         # getMyApplication, getPendingApplications, getArticleForEdit

app/api/
├── editorial/[id]/[action]/route.ts    # submit/approve/reject/request-revision/publish proxy
├── applications/[id]/[action]/route.ts  # approve/reject proxy
└── edit-article/[id]/route.ts            # tahrirlash + ixtiyoriy qayta yuborish

app/(community)/dashboard/
├── layout.tsx                    # umumiy header + tab navigatsiya (rolga qarab)
├── page.tsx                       # Contributor/Registered User ko'rinishi
├── articles/[id]/edit/page.tsx     # tahrirlash formasi
└── editor/
    ├── page.tsx                     # Editorial Queue
    └── applications/page.tsx         # Arizalar

components/dashboard/
├── EditorialStatusBadge.tsx
├── StatCard.tsx
├── DashboardArticleRow.tsx
├── EditorialQueueRow.tsx    # client — real tugmalar
└── ApplicationRow.tsx        # client — real tugmalar

components/forms/SubmitArticleForm.tsx   # YANGILANDI: editMode qo'llab-quvvatlaydi
```

---

# LOYIHA YAKUNI — 70-band Test Stsenariysi holati

| # | Qadam | Holat |
|---|---|---|
| 1–3 | Ro'yxatdan o'tish, profil | ✅ 3-qism |
| 4–6 | Ariza, Admin tasdiqlaydi, Contributor bo'ladi | ✅ 4 va 8-qism |
| 7–9 | Maqola yaratish, Draft, Submit | ✅ 4-qism |
| 10–13 | Editorial Queue, Review, Revision so'rash | ✅ 8-qism |
| 14–15 | Contributor tahrirlaydi, qayta yuboradi | ✅ 8-qism |
| 16–17 | Editor tasdiqlaydi, Published | ✅ 2 va 8-qism |
| 18 | Bosh sahifada ko'rinadi | ✅ 5-qism (+ 7-qism on-demand revalidation) |
| 19 | SEO metadata | ✅ 6-qism |
| 20 | Sitemap'da | ✅ 6-qism |
| 21 | Ijtimoiy tarmoqda ulashish | ✅ 5-qism (ShareButtons) |
| 22 | Muallif profilida ko'rinadi | ✅ 5-qism |
| 23 | O'xshash maqolalar | ✅ 5-qism |
| 24 | View count oshadi | ✅ 5-qism (ViewCounter) + 2-qism (backend) |

**Barcha 24 qadam real, ishlaydigan kod bilan yopilgan** — mock yoki
statik mockup emas.

## Nima qamrab olinmadi (spec'da bor, lekin bu formatda berilmagan)

Halol bo'lish uchun aniq aytib o'taman:

- **PHASE 8 (spec 68-band): avtomatlashtirilgan testlar** — unit/integration
  test fayllari (Jest/Playwright) yozilmadi. Bu alohida katta ish; loyiha
  strukturasi (`lib/api` xizmat qatlami, toza controller'lar) testlash
  uchun qulay qilib qurilgan, lekin test fayllarining o'zi yo'q.
- **57-band: Telegram avtomatik post** — spec buni "V1 uchun shart emas,
  lekin arxitektura kengaytiriladigan bo'lsin" deb belgilagan.
  `article.js#publish` ichida aniq izoh bilan joy qoldirilgan.
- **58-band: AI funksiyalar** — spec buni ham V1'dan chiqargan.
- **71-band: to'liq vizual dizayn maketlari** (barcha sahifalarning
  Figma-uslubidagi rasmlari) — buning o'rniga har bir sahifa to'g'ridan-
  to'g'ri ishlaydigan production-kod sifatida qurildi, brend ranglar va
  tipografika izchil qo'llanildi.
- **Kommentariylar tizimi** — spec 20-band "Comments can be added later"
  deb aniq V1'dan chiqargan, shu bo'yicha ishlanmadi.
- Deploy skriptlari (Docker/CI-CD) so'ralmagan edi — kerak bo'lsa alohida
  so'rang.

## Loyihani ishga tushirish (to'liq, boshidan oxirigacha)

```bash
# 1. Strapi
npx create-strapi-app@latest surxoncha-cms --quickstart --no-run
cd surxoncha-cms
cp -r ../surxoncha/strapi-schemas/src/* ./src/
# .env: DATABASE_CLIENT=postgres, DATABASE_URL, REVALIDATE_SECRET, NEXT_REVALIDATE_URL
npm run develop
# → admin hisob yarating, API token (read + full-access) oling

# 2. Next.js
cd ../surxoncha
npm install
cp .env.example .env.local
# .env.local: STRAPI_URL, STRAPI_API_TOKEN, AUTH_SECRET, REVALIDATE_SECRET (Strapi bilan bir xil)
npm run dev
```

So'ng `/register` → `/join` → (Strapi admin panelida arizani qo'lda
tasdiqlash **yoki** endi `/dashboard/editor/applications` orqali, agar
o'zingiz Editor rolini admin panelda o'zingizga bersangiz) → `/submit` →
`/dashboard/editor` → **Tasdiqlash** → **Nashr qilish** → bosh sahifada
ko'ring.

Loyiha to'liq. Savol yoki qo'shimcha qism (masalan, avtomatlashtirilgan
testlar yoki Docker konfiguratsiyasi) kerak bo'lsa — ayting.
