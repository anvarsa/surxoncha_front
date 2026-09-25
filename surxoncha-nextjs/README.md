# SURXONCHA.UZ — 1-qism: Foundation

Bu qism loyihaning skeletini o'z ichiga oladi: Next.js/TS/Tailwind konfiguratsiyasi,
brend design token'lari va Strapi content-type schema'lari.

## Papka strukturasi (shu qismda yaratilgan)

```
surxoncha/
├── app/
│   └── globals.css          # Brand ranglar (CSS variables), light/dark, typography
├── lib/
│   └── api/
│       ├── client.ts        # Strapi fetch wrapper (barcha so'rovlar shu orqali)
│       └── articles.ts      # Article uchun real API funksiyalar
├── types/
│   └── content.ts           # Article/Author/Category/Region/... TypeScript tiplari
├── strapi-schemas/
│   └── src/
│       ├── api/              # 9 ta content-type: article, category, region, tag,
│       │                     # author-profile, contributor-application,
│       │                     # editorial-action, contact-message, site-setting
│       └── components/
│           ├── shared/seo.json
│           └── article/gallery-image.json, correction-note.json
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
└── .env.example
```

## O'rnatish (local development)

### 1. Strapi CMS

```bash
npx create-strapi-app@latest surxoncha-cms --quickstart --no-run
cd surxoncha-cms
```

`strapi-schemas/src/` ichidagi `api/` va `components/` papkalarini
yaratilgan Strapi loyihasidagi `src/api/` va `src/components/` ustiga nusxalang:

```bash
cp -r ../surxoncha/strapi-schemas/src/components ./src/
cp -r ../surxoncha/strapi-schemas/src/api ./src/
```

So'ng:

```bash
npm run develop
```

Strapi admin panelida (`http://localhost:1337/admin`):
1. Birinchi administrator hisobini yarating.
2. **Settings → Roles → Public**: `article`, `category`, `region`, `tag`,
   `author-profile` uchun faqat `find`/`findOne` ruxsatlarini yoqing
   (write ruxsatlari YO'Q — bu ruxsatlar faqat autentifikatsiyalangan
   `Contributor`/`Editor` role'lariga beriladi, 3-qismda sozlanadi).
3. **Content-Type Builder** orqali `Region` collection'iga 14 ta tumanni
   (Termiz shahri, Angor, Bandixon, Boysun, Denov, Jarqo'rg'on, Muzrabot,
   Oltinsoy, Qiziriq, Qumqo'rg'on, Sariosiyo, Sherobod, Sho'rchi, Uzun)
   va `Category` collection'iga 10 ta bo'limni (Yangiliklar, Jamiyat,
   Ta'lim, Biznes, Yoshlar, Texnologiya, Madaniyat, Sport, Intervyu,
   Reportaj) qo'lda kiriting yoki seed skript orqali import qiling
   (seed skript 2-qismda beriladi).
4. **Settings → API Tokens**: `STRAPI_API_TOKEN` uchun "Read-only" token
   yarating (frontend uchun) va alohida "Full access" token editorial
   yozish amallari uchun (faqat server-side ishlatiladi, hech qachon
   client kodga chiqmaydi).

### 2. PostgreSQL

```bash
createdb surxoncha
```

Strapi `.env` faylida `DATABASE_CLIENT=postgres` va `DATABASE_URL`ni sozlang.

### 3. Next.js frontend

```bash
cd surxoncha
npm install
cp .env.example .env.local
# .env.local ichida STRAPI_URL va STRAPI_API_TOKEN ni to'ldiring
npm run dev
```

Sayt: `http://localhost:3000`

## Muhim arxitektura qoidalari (keyingi qismlarda ham amal qiladi)

- **Hech qachon** komponent ichida to'g'ridan-to'g'ri `fetch()` chaqirilmaydi —
  faqat `/lib/api/*.ts` orqali.
- `status` maydoni Strapi'ning o'zining draft/publish tizimidan MUSTAQIL —
  bizning 8 bosqichli editorial workflow shu enum orqali boshqariladi
  (`draftAndPublish: false` shuning uchun o'rnatilgan).
- Author profilida email/telefon/tug'ilgan sana **hech qachon** public API
  orqali qaytarilmaydi — bu maydonlar faqat `plugin::users-permissions.user`da
  saqlanadi, `author-profile`da esa faqat public-safe maydonlar bor.
- Har bir editorial qaror (`approve`/`reject`/`request_revision`/`publish`)
  `editorial-action` orqali logga yoziladi — o'chirib bo'lmaydi.

## Keyingi qismlar

| Qism | Mazmun |
|---|---|
| 2 | Strapi permissions matrix (role bo'yicha), seed skript (regions+categories), SEO service layer |
| 3 | Auth: register/login/forgot-password, NextAuth config, role middleware |
| 4 | Editorial workflow: submit → review → approve → publish route handlers |
| 5 | Frontend sahifalar: bosh sahifa, /news/[slug], /regions/[slug], /authors/[username], /search |
| 6 | SEO: metadata generatorlar, sitemap.xml, robots.txt, JSON-LD structured data |
| 7 | Performance: image optimization, caching strategy |
| 8 | Contributor va Editor dashboard'lari (UI + real actions) |

Davom ettirish uchun: **"2-qismni boshla"** deb yozing.
