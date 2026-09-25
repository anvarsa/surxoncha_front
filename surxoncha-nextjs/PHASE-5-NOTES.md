# 5-qism: Public Frontend — nima qo'shildi

Sayt endi birinchi marta **ko'rinadigan**. Barcha sahifalar real Strapi
ma'lumotlari bilan ishlaydi (mock emas), har biri loading/empty/error
holatlarini boshqaradi.

## Yangi sahifalar

| Route | Vazifa |
|---|---|
| `/` | Bosh sahifa — hero, so'nggi yangiliklar, hududlar, intervyu/reportaj/biznes/yoshlar, ko'p o'qilganlar, community CTA (spec 59-band tartibida) |
| `/news/[slug]` | Maqola sahifasi — breadcrumb, meta, galereya, video, manba, teglar, tuzatish bloki, muallif kartasi, o'xshash maqolalar, ulashish |
| `/category/[slug]` | Kategoriya arxivi, sahifalash bilan |
| `/regions` | 14 tuman grid ko'rinishida |
| `/regions/[slug]` | Hudud arxivi |
| `/authors/[username]` | Muallif profili — bio, ijtimoiy tarmoqlar, maqolalari |
| `/search` | Debounced qidiruv — maqola/muallif/kategoriya/hudud |

## Komponentlar

```
components/
├── layout/   Header, Footer, BreakingNewsBar, MobileMenu, AccountMenu
├── article/  ArticleCard, ArticleMeta, HeroArticle, RelatedArticles,
│             ShareButtons, PhotoGallery, VideoEmbed, ViewCounter
├── author/   AuthorCard
├── region/   RegionCard
├── search/   SearchBox (header), SearchInput (search page, debounced)
├── home/     SectionHeader, CommunityCTA
└── common/   Breadcrumb, Pagination, EmptyState
```

## API qatlami (yangi)

```
lib/api/
├── authors.ts     # getAuthorByUsername, getArticlesByAuthor
├── search.ts       # bitta chaqiruvda articles+authors+categories+regions
└── articles.ts      # +getArticlesByContentType, +getPopularArticles
lib/utils.ts          # cn(), mediaUrl(), formatDate(), formatRelativeTime()
```

`app/api/articles/[id]/view/route.ts` — `ViewCounter` komponenti sahifa
ochilganda shu route orqali Strapi'dagi `viewCount`ni oshiradi (2-qismdagi
public `/articles/:id/view` endpoint'ga proxy).

## Muhim texnik qarorlar

- Har bir sahifa (`getFeaturedArticle`, `getAllRegions` va h.k.) `.catch()`
  bilan himoyalangan — Strapi vaqtincha ishlamay qolsa, bosh sahifa
  butunlay qulamaydi, faqat tegishli bo'lim bo'sh holatini ko'rsatadi
  (`EmptyState`).
- `article.content` HTML sifatida render qilinadi
  (`dangerouslySetInnerHTML`) — Strapi rich-text/CKEditor chiqishi
  shu formatda saqlanadi deb faraz qilingan.
- Rasm domenlari `next.config.js`dagi `STRAPI_MEDIA_HOSTNAME`/
  `STORAGE_PUBLIC_HOSTNAME` orqali whitelist qilingan — boshqa domendan
  rasm yuklanmaydi (xavfsizlik).
- `revalidate` har sahifada alohida sozlangan: bosh sahifa/kategoriya —
  60s, hudud/muallif — 300s (kamroq o'zgaradi), `/regions` — 3600s.

## Sinash

```bash
npm run dev
```

4-qismda yaratilgan va Editor tomonidan `publish` qilingan (2-qism
`/articles/:id/publish`) maqola endi:
- bosh sahifada (agar `featured=true` bo'lsa hero'da, aks holda "So'nggi
  yangiliklar"da),
- `/category/[slug]`da,
- `/authors/[username]`da,
- qidiruvda

ko'rinishi kerak — bu test-stsenariysining **18–24 qadamlari**
(homepage, SEO metadata, author profile, related articles, view count)
ni tasdiqlaydi. To'liq SEO (sitemap, robots, JSON-LD tekshiruvi) **6-qism**da.

## Keyingi qism

**6-qism** — SEO: `sitemap.xml`, `robots.txt`, `/rss.xml`, Organization/
WebSite JSON-LD root layout'ga ulash, Open Graph rasm fallback'lari.

Davom ettirish uchun: **"6-qismni boshla"**
