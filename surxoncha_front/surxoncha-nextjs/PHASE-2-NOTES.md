# 2-qism: Permissions, Seed va SEO — nima qo'shildi

## Strapi tomon (`strapi-schemas/`)

```
strapi-schemas/
├── docs/permissions-matrix.md          # 7 rol x 10 content-type to'liq jadval
├── src/
│   ├── index.js                        # Bootstrap: rollar + ruxsatlar + seed (idempotent)
│   ├── policies/is-owner-or-editor.js  # "faqat o'zinikini tahrirlash" guard
│   └── api/
│       ├── article/
│       │   ├── content-types/article/lifecycles.js   # State-machine, server-side, bypass qilib bo'lmaydi
│       │   ├── controllers/article.js                 # submit/approve/reject/publish/view actions
│       │   └── routes/
│       │       ├── article.js           # standart CRUD + ownership policy
│       │       └── custom-article.js    # /articles/:id/submit, /approve, /publish, /view ...
│       └── author-profile/controllers/author-profile.js  # email/phone sizib chiqmasligi kafolati
```

### O'rnatish

`src/index.js`, `src/policies/`, va `src/api/*/controllers|routes|content-types` fayllarini
1-qismdagidek Strapi loyihangizga nusxalang, so'ng:

```bash
npm run develop
```

Bootstrap birinchi ishga tushishda konsolda shuni ko'rasiz:

```
[bootstrap] Creating role: Contributor
[bootstrap] Creating role: Reporter
[bootstrap] Creating role: Moderator
[bootstrap] Creating role: Editor
[bootstrap] Seeding api::region.region: Termiz shahri
...
[bootstrap] Seeding api::category.category: Yangiliklar
...
[bootstrap] SURXONCHA.UZ: roles, permissions va seed ma'lumotlari tayyor.
```

Buni tekshiring: **Settings → Users & Permissions → Roles** — 4 ta yangi rol
(Contributor, Reporter, Moderator, Editor) paydo bo'lgan bo'lishi kerak, va
**Content Manager → Region/Category** — 14 tuman + 10 kategoriya tayyor.

Qayta ishga tushirsangiz ham xavfsiz — mavjud rol/yozuvlar qayta yaratilmaydi
(`ensureRole`/`seedCollection` funksiyalari avval tekshiradi).

## Workflow qanday ishlaydi endi (real, mock emas)

1. Contributor `POST /api/articles` — server majburan `status: draft` qiladi
   (client nima yuborishidan qat'i nazar — `lifecycles.js#beforeCreate`).
2. Contributor tayyor bo'lgach: `POST /api/articles/:id/submit` →
   `draft → submitted`. Faqat egasi chaqira oladi (`is-owner-or-editor`).
3. Editor: `POST /api/articles/:id/request-revision` (body: `{ note }`) →
   `submitted → revision_requested`, va `editorial-action` yozuvi log qilinadi.
4. Contributor tahrirlab, yana submit qiladi.
5. Editor: `POST /api/articles/:id/approve` → `submitted → approved`.
6. Editor: `POST /api/articles/:id/publish` → `approved → published`,
   `publishedAt` avtomatik o'rnatiladi.
7. Har bir qadam `editorial-action` jadvaliga yoziladi — o'chirib bo'lmaydi,
   Editor dashboard'da audit sifatida ko'rsatiladi (8-qism).

`ALLOWED_TRANSITIONS` state machine'i noto'g'ri sakrashni (masalan
`draft → published`) hatto Editor uchun ham bloklaydi — bu hodisa
70-test-stsenariysining 8–17 qadamlarini aynan shu tartibda ishlashini
kafolatlaydi.

## Next.js tomon

```
lib/
├── api/
│   ├── articles.ts   # YANGILANDI: createDraftArticle, submitArticle(id),
│   │                 #   requestRevision, approveArticle, rejectArticle, publishArticle
│   └── site.ts        # getSiteSettings(), getHomepageFeaturedContent()
└── seo/
    ├── metadata.ts         # buildArticleMetadata/RegionMetadata/CategoryMetadata/AuthorMetadata
    └── structured-data.ts  # organizationSchema, websiteSchema, breadcrumbSchema,
                             #   personSchema, newsArticleSchema, jsonLd()
```

Ishlatilishi (3-qismdan keyin sahifalarda haqiqiy misolda ko'rsatiladi):

```tsx
// app/(public)/news/[slug]/page.tsx (5-qismda to'liq yaratiladi)
export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  return buildArticleMetadata(article);
}
```

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(newsArticleSchema(article))} />
```

## Keyingi qism

**3-qism** — Auth: `/register`, `/login`, `/forgot-password`, NextAuth (Strapi
users-permissions provider bilan), session'da `role` va `authorProfileId`ni
saqlash, route middleware (`/dashboard`, `/submit` himoyalash).

Davom ettirish uchun: **"3-qismni boshla"**
