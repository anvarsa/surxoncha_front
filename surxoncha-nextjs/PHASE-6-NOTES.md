# 6-qism: SEO — nima qo'shildi

## Fayllar

```
app/
├── sitemap.ts              # Next.js dinamik sitemap — /sitemap.xml
├── robots.ts                # Next.js dinamik robots — /robots.txt
├── rss.xml/route.ts          # /rss.xml — so'nggi 30 ta maqola
├── layout.tsx                 # YANGILANDI: Organization + WebSite JSON-LD,
│                              #   dinamik metadata (site-setting'dan), RSS autodiscovery
├── (public)/
│   ├── about/page.tsx          # spec 33-band
│   ├── contact/page.tsx         # spec 32-band, ContactForm bilan
│   └── editorial-policy/page.tsx # spec 34-band
└── api/contact/route.ts          # /contact formasi backend'i

components/forms/ContactForm.tsx

lib/api/articles.ts   # +getAllPublishedArticlesForSitemap (sahifalab yig'adi),
                        # +getLatestArticlesForRss
lib/api/authors.ts     # +getAllAuthorsForSitemap
```

## `/sitemap.xml` nima qamraydi

- Statik sahifalar: `/`, `/about`, `/contact`, `/editorial-policy`, `/regions`, `/join`
- Barcha **nashr qilingan** maqolalar (`status=published`) — sahifalab
  yig'iladi, chunki Strapi bitta so'rovda cheklangan son qaytaradi
- Barcha kategoriyalar, hududlar, muallif profillari

**Chiqarib tashlangan** (spec 28-band talabiga muvofiq): draft/submitted/
in_review holatidagi maqolalar, `/admin`, `/dashboard`, `/submit`,
`/login`, `/register` — bular sitemap generatorida umuman so'ralmaydi,
chunki faqat `status: published` filtri bilan so'rov yuboriladi.

## `/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /dashboard
Disallow: /submit
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: https://surxoncha.uz/sitemap.xml
```

## Structured data (root layout, butun sayt uchun bir marta)

- `Organization` — nomi, logo, ijtimoiy tarmoqlar (`site-setting`dan
  dinamik)
- `WebSite` — `SearchAction` bilan, Google'da to'g'ridan-to'g'ri qidiruv
  qutisi chiqishi mumkin

Sahifa darajasida (5-qismda qo'shilgan):
- `/news/[slug]` — `NewsArticle` + `BreadcrumbList`
- `/authors/[username]` — `Person`

## Sinash

```bash
npm run dev
```

- `http://localhost:3000/sitemap.xml` — barcha nashr qilingan maqolalar
  ko'rinishi kerak
- `http://localhost:3000/robots.txt`
- `http://localhost:3000/rss.xml`
- Google'ning [Rich Results Test](https://search.google.com/test/rich-results)
  orqali `/news/[slug]` sahifasini tekshiring — `NewsArticle` sxemasi
  aniqlanishi kerak.

Bu test-stsenariysining **19–21 qadamlarini** (SEO metadata, sitemap'da
ko'rinish, ijtimoiy tarmoqlarda ulashish) yakunlaydi.

## Keyingi qism

**7-qism** — Performance: rasm optimizatsiyasi tekshiruvi, Strapi so'rov
keshlash strategiyasi, `revalidateTag` bilan on-demand revalidation
(maqola publish qilinganda sahifalar darhol yangilanishi uchun),
Core Web Vitals bo'yicha tavsiyalar.

Davom ettirish uchun: **"7-qismni boshla"**
