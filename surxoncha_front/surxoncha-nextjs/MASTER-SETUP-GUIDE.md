# SURXONCHA.UZ — To'liq O'rnatish va Fayl Qo'llanmasi

Bu bitta hujjat — 8 qismda yaratilgan **butun loyihani** boshidan oxirigacha,
nol nuqtadan ishga tushirish uchun. Ketma-ketlikni buzmasdan o'qing: ba'zi
qadamlar (masalan, Strapi bootstrap) keyingi qadamlar ishlashi uchun shart.

Agar shoshilsangiz: **0-bo'lim (Tezkor boshlash)**ni o'qing va bajaring.
Agar loyihani chuqur tushunmoqchi bo'lsangiz yoki kimgadir topshirmoqchi
bo'lsangiz — hujjatni to'liq, tartib bilan o'qing.

---

## Mundarija

- [0. Tezkor boshlash (5 daqiqada)](#0-tezkor-boshlash)
- [1. Loyiha nima va qanday qurilgan](#1-loyiha-nima-va-qanday-qurilgan)
- [2. Talablar](#2-talablar)
- [3. A-QISM: Strapi CMS'ni o'rnatish](#3-a-qism-strapi-cmsni-ornatish)
- [4. B-QISM: Next.js frontend'ni o'rnatish](#4-b-qism-nextjs-frontendni-ornatish)
- [5. C-QISM: Birinchi marta sozlash (admin panel qadamlari)](#5-c-qism-birinchi-marta-sozlash)
- [6. D-QISM: To'liq oqimni sinash (ro'yxatdan tortib nashrgacha)](#6-d-qism-toliq-oqimni-sinash)
- [7. E-QISM: Har bir faylning vazifasi (to'liq ro'yxat)](#7-e-qism-har-bir-faylning-vazifasi)
- [8. F-QISM: Environment o'zgaruvchilari — to'liq jadval](#8-f-qism-environment-ozgaruvchilari)
- [9. G-QISM: Nima nimaga bog'liq (ketma-ketlik mantiqi)](#9-g-qism-nima-nimaga-boliq)
- [10. H-QISM: Muammolarni bartaraf etish](#10-h-qism-muammolarni-bartaraf-etish)
- [11. I-QISM: Nima kiritilmagan / keyingi qadamlar](#11-i-qism-nima-kiritilmagan)
- [12. J-QISM: Production'ga chiqarish (qisqacha)](#12-j-qism-productionga-chiqarish)

---

## 0. Tezkor boshlash

Agar oldin hech narsa o'rnatmagan bo'lsangiz, shu buyruqlarni **aynan shu
tartibda** bajaring (har biri pastda batafsil tushuntirilgan):

```bash
# ---- 1. Strapi ----
npx create-strapi-app@latest surxoncha-cms --quickstart --no-run
cd surxoncha-cms
cp -r ../surxoncha/strapi-schemas/src/* ./src/
# .env faylini oching, pastdagi "F-QISM"dagi Strapi jadvalini to'ldiring
npm run develop
# → brauzerda http://localhost:1337/admin ochiladi, birinchi admin hisobni yarating

# ---- 2. Next.js (Strapi ishlab turgan holda, YANGI terminalda) ----
cd ../surxoncha
npm install
cp .env.example .env.local
# .env.local faylini oching, pastdagi "F-QISM"dagi Next.js jadvalini to'ldiring
npm run dev
# → http://localhost:3000
```

Ikkala server ham parallel ishlab turishi kerak (2 ta terminal oynasi).
Keyin **5-bo'lim**ga o'ting — u yerda admin panelda bosishingiz kerak
bo'lgan aniq qadamlar bor (bularsiz sayt bo'sh ko'rinadi).

---

## 1. Loyiha nima va qanday qurilgan

Bu ikki alohida loyihadan iborat, ular bir-biri bilan REST API orqali
gaplashadi:

```
┌─────────────────────┐        HTTP/REST        ┌──────────────────────┐
│   Next.js frontend   │ ───────────────────────▶│   Strapi CMS backend  │
│   (papka: surxoncha) │ ◀─────────────────────── │ (papka: surxoncha-cms)│
│   port 3000           │      webhook (7-qism)    │   port 1337            │
└─────────────────────┘ ◀─────────────────────── └──────────────────────┘
         │                                                   │
         ▼                                                   ▼
   Foydalanuvchi brauzeri                           PostgreSQL ma'lumotlar bazasi
```

- **`surxoncha/`** — bu conversationda yaratilgan **Next.js loyihaning
  o'zi**. Uni to'g'ridan-to'g'ri `npm install && npm run dev` bilan
  ishga tushirasiz.
- **`surxoncha/strapi-schemas/`** — bu alohida loyiha EMAS. Bu — Strapi
  CMS'ga **nusxalanadigan fayllar to'plami** (content-type'lar,
  controller'lar, policy'lar). O'zi ishlamaydi; avval haqiqiy Strapi
  loyihasini yaratib (`create-strapi-app`), so'ng shu fayllarni ustiga
  nusxalash kerak.

Loyiha 8 qismda qurilgan, har biri o'z izohi bilan:

| Qism | Nima qurilgan | Batafsil |
|---|---|---|
| 1 | Loyiha skeleti, dizayn token'lari, Strapi content-type'lar | `README.md` |
| 2 | Ruxsatlar (permissions), seed skript, editorial workflow backend | `PHASE-2-NOTES.md` |
| 3 | Autentifikatsiya (register/login/parol tiklash) | `PHASE-3-NOTES.md` |
| 4 | Jamoaga qo'shilish arizasi, maqola yuborish formasi | `PHASE-4-NOTES.md` |
| 5 | Public sahifalar (bosh sahifa, maqola, kategoriya...) | `PHASE-5-NOTES.md` |
| 6 | SEO (sitemap, robots, RSS, structured data) | `PHASE-6-NOTES.md` |
| 7 | Performance (kesh, on-demand revalidation) | `PHASE-7-NOTES.md` |
| 8 | Contributor/Editor dashboard'lari | `PHASE-8-NOTES.md` |

Bu hujjat — o'sha 8 ta faylning **hammasini birlashtirib, amaliy
o'rnatish tartibiga solingan** yakuniy versiyasi. Alohida-alohida
`PHASE-*.md` fayllarni o'qishga hojat yo'q, lekin ular texnik
tafsilotlar (nega shunday qilingan) uchun saqlanib qolgan.

---

## 2. Talablar

| Dastur | Versiya | Tekshirish buyrug'i |
|---|---|---|
| Node.js | 18.x yoki 20.x | `node -v` |
| npm | 9+ | `npm -v` |
| PostgreSQL | 14+ | `psql --version` |
| Git (ixtiyoriy) | — | — |

Ikkita bo'sh port kerak: **1337** (Strapi) va **3000** (Next.js).

---

## 3. A-QISM: Strapi CMS'ni o'rnatish

### 3.1. Yangi Strapi loyihasini yaratish

```bash
npx create-strapi-app@latest surxoncha-cms --quickstart --no-run
```

`--quickstart` SQLite bilan sinov uchun avtomatik sozlaydi, lekin biz
PostgreSQL ishlatamiz (spec talabi), shuning uchun keyingi qadamda
`.env`ni qo'lda o'zgartiramiz. `--no-run` — avtomatik ishga tushirmaydi,
chunki avval fayllarni nusxalashimiz kerak.

### 3.2. PostgreSQL bazasini yaratish

```bash
createdb surxoncha
```

(Agar PostgreSQL boshqa foydalanuvchi/parol bilan sozlangan bo'lsa, o'z
sharoitingizga moslang.)

### 3.3. Bizning fayllarimizni ustiga nusxalash

**Bu eng muhim qadam.** `surxoncha/strapi-schemas/src/` papkasidagi
HAR BIR narsa yangi yaratilgan `surxoncha-cms/src/` ustiga ko'chiriladi:

```bash
cd surxoncha-cms
cp -r ../surxoncha/strapi-schemas/src/* ./src/
```

Bu buyruq quyidagilarni nusxalaydi (E-QISMda har biri alohida
tushuntirilgan):

```
src/index.js                          ← Strapi ildiziga (bootstrap fayli)
src/policies/is-owner-or-editor.js
src/utils/trigger-revalidate.js
src/components/shared/seo.json
src/components/article/*.json
src/api/article/...
src/api/category/...
src/api/region/...
src/api/tag/...
src/api/author-profile/...
src/api/contributor-application/...
src/api/editorial-action/...
src/api/contact-message/...
src/api/site-setting/...
```

Agar `create-strapi-app` allaqachon bo'sh `src/index.js` yaratgan bo'lsa,
`cp -r` uni **ustiga yozadi** (bizniki to'g'ri versiya) — bu normal.

### 3.4. Strapi `.env` faylini sozlash

`surxoncha-cms/.env` faylini oching va quyidagilarni **qo'shing/
o'zgartiring** (F-QISM'dagi to'liq jadvalga qarang):

```
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=surxoncha
DATABASE_USERNAME=<sizning_postgres_useringiz>
DATABASE_PASSWORD=<sizning_postgres_parolingiz>
DATABASE_SSL=false

# 7-qismdagi on-demand revalidation uchun — Next.js'dagi REVALIDATE_SECRET
# bilan AYNAN BIR XIL bo'lishi shart:
REVALIDATE_SECRET=juda-uzun-tasodifiy-satr-shu-yerga
NEXT_REVALIDATE_URL=http://localhost:3000/api/revalidate
```

### 3.5. Kerakli npm paketlarini o'rnatish

`strapi-schemas` fayllari qo'shimcha paket talab qilmaydi — hammasi
Strapi'ning o'z ichki API'lari (`strapi.db.query`, `strapi.entityService`)
va Node'ning global `fetch()`i orqali ishlaydi. Qo'shimcha `npm install`
shart emas.

### 3.6. Strapi'ni ishga tushirish

```bash
npm run develop
```

Konsolda quyidagilarni ko'rishingiz kerak (agar ko'rmasangiz — 10-bo'lim,
Muammolarni bartaraf etish):

```
[bootstrap] Creating role: Contributor
[bootstrap] Creating role: Reporter
[bootstrap] Creating role: Moderator
[bootstrap] Creating role: Editor
[bootstrap] Seeding api::region.region: Termiz shahri
[bootstrap] Seeding api::region.region: Angor
... (yana 12 ta tuman)
[bootstrap] Seeding api::category.category: Yangiliklar
... (yana 9 ta kategoriya)
[bootstrap] SURXONCHA.UZ: roles, permissions va seed ma'lumotlari tayyor.
```

Bu — `src/index.js`dagi bootstrap kodi (2-qism) avtomatik ishlagani.
Agar bu qatorlar chiqmasa, fayl to'g'ri joyga nusxalanmagan bo'lishi
mumkin — `surxoncha-cms/src/index.js` mavjudligini tekshiring.

Brauzer avtomatik `http://localhost:1337/admin`ni ochadi (yoki qo'lda
oching) — birinchi administrator hisobingizni yarating (ism, email,
parol).

---

## 4. B-QISM: Next.js frontend'ni o'rnatish

**Muhim:** Strapi (3-bo'lim) allaqachon ishlab turishi kerak, chunki
ba'zi Next.js sahifalari server-rendering paytida Strapi'ga so'rov
yuboradi.

### 4.1. Paketlarni o'rnatish

```bash
cd surxoncha
npm install
```

### 4.2. `.env.local` yaratish

```bash
cp .env.example .env.local
```

`.env.local`ni oching, F-QISM'dagi jadvalga qarab **har bir qatorni**
to'ldiring. Eng muhimlari:

```
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<4.3-qadamda olinadi>
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
AUTH_SECRET=<uzun tasodifiy satr>
REVALIDATE_SECRET=<Strapi .env bilan bir xil>
```

`AUTH_SECRET` generatsiya qilish uchun:

```bash
openssl rand -base64 32
```

### 4.3. Strapi API Token'larini olish

Strapi admin panelida (`http://localhost:1337/admin`):

1. **Settings → API Tokens → Create new API Token**
2. Nomi: `nextjs-write` (yoki xohlagan nom)
3. Token type: **Full access**
4. **Save** — chiqqan tokenni darhol nusxalang (qayta ko'rsatilmaydi)
5. Buni `.env.local`dagi `STRAPI_API_TOKEN`ga qo'ying

> **Nega "Full access"?** Chunki `STRAPI_API_TOKEN` server-side route
> handler'larda (`/api/register`, `/api/submit-article` va h.k.)
> region/category qidirish, tag yaratish kabi ishlar uchun ishlatiladi.
> Bu token **hech qachon** brauzerga yoki client komponentga chiqmaydi —
> faqat Next.js serverida (2 va 4-qism xavfsizlik eslatmalariga qarang).

### 4.4. Next.js'ni ishga tushirish

Yangi terminalda (Strapi ishlab turgan holda):

```bash
npm run dev
```

`http://localhost:3000`ni oching. Sayt ochiladi, lekin hozircha **bo'sh**
ko'rinadi (maqola yo'q) — bu normal, keyingi bo'limda to'ldiramiz.

---

## 5. C-QISM: Birinchi marta sozlash

Bootstrap avtomatik qilgan narsalar (rollar, tumanlar, kategoriyalar)dan
tashqari, quyidagilarni **qo'lda, bir marta** bajarish kerak:

### 5.1. O'zingizni Editor qilib belgilash (sinov uchun)

Real loyihada Editor bo'lish uchun kimdir avval Contributor bo'lib,
keyin administrator uni Editor qilib "ko'tarishi" kerak — lekin bu
oqim hozircha alohida UI'ga ega emas (11-bo'limga qarang). **Sinov
uchun eng tez yo'l:**

1. `http://localhost:3000/register` orqali o'zingizni ro'yxatdan
   o'tkazing.
2. Strapi admin panelida: **Content Manager → Collection Types →
   Author Profile** → o'zingizning yozuvingizni toping.
3. `communityRole` maydonini `registered_user`dan **`editor`**ga
   o'zgartiring → **Save**.
4. Saytda **chiqib qayta kiring** (logout/login) — sessiya yangilanishi
   uchun shart (rol JWT/session ichida keshlanadi).

Endi `/dashboard/editor` va `/dashboard/editor/applications`ga
kirasiz.

### 5.2. Site Settings'ni to'ldirish (ixtiyoriy, lekin tavsiya etiladi)

**Content Manager → Single Types → Site Settings**:
- `siteName`, `tagline`, `logo`, `favicon`
- `telegramUrl`, `instagramUrl`, `youtubeUrl` (Footer'da ko'rinadi)
- `defaultSeo.metaTitle`, `defaultSeo.metaDescription`

Bo'sh qoldirsangiz ham sayt ishlайveradi — kod ichida fallback qiymatlar
bor (`lib/api/site.ts` va `app/layout.tsx`ga qarang), lekin
professional ko'rinish uchun to'ldirish tavsiya etiladi.

### 5.3. Tumanlar va kategoriyalarga rasm qo'yish (ixtiyoriy)

Bootstrap faqat `name`/`slug` bilan yaratadi, `coverImage`siz. Bosh
sahifadagi "Hududlardan" bo'limi chiroyli ko'rinishi uchun:

**Content Manager → Region** → har birini oching → `coverImage`
yuklang → **Save**.

---

## 6. D-QISM: To'liq oqimni sinash

Bu — 70-band test-stsenariysining brauzerda qo'lda bajariladigan
versiyasi. Har bir qadam qaysi fayl/route ishlayotganini ko'rsatadi.

| # | Amal | Qayerda | Nima ishlaydi |
|---|---|---|---|
| 1 | Ikkinchi (oddiy) hisob bilan ro'yxatdan o'ting | `/register` | `app/api/register/route.ts` |
| 2 | `/join` orqali ariza yuboring | `/join` | `app/api/applications/route.ts` |
| 3 | Editor hisobingiz bilan kiring | `/login` | — |
| 4 | `/dashboard/editor/applications`ga o'ting, **Tasdiqlash**ni bosing | Editor Dashboard | `app/api/applications/[id]/approve/route.ts` → Strapi `contributor-application.approve()` |
| 5 | Oddiy hisobga qaytib, **chiqib-kiring** (rol yangilanishi uchun) | — | — |
| 6 | `/submit`ga o'ting, forma to'ldiring, rasm yuklang, yuboring | `/submit` | `app/api/submit-article/route.ts` |
| 7 | Editor hisobiga qaytib, `/dashboard/editor`ni oching | Editorial Queue | `lib/api/dashboard.ts#getEditorialQueue` |
| 8 | **Qayta ko'rib chiqish** tugmasini bosing, sabab yozing | Editorial Queue | `article.requestRevision()` |
| 9 | Oddiy hisobda `/dashboard`ga o'ting, maqolani **Tahrirlash**ni bosing | `/dashboard/articles/[id]/edit` | `app/api/edit-article/[id]/route.ts` |
| 10 | O'zgartirib, **"Saqlash va qayta yuborish"**ni bosing | — | `resubmit: true` |
| 11 | Editor hisobida yana Editorial Queue'ga qaytib, **Tasdiqlash** | — | `article.approve()` |
| 12 | **Nashr qilish** tugmasini bosing | — | `article.publish()` |
| 13 | Bosh sahifaga o'ting (`/`) — maqola ko'rinishi kerak | `/` | 7-qism on-demand revalidation tufayli **darhol** ko'rinadi |
| 14 | Maqolani oching, pastga tushing — muallif kartasi, o'xshash maqolalar | `/news/[slug]` | — |
| 15 | `view-source:` orqali `<script type="application/ld+json">` borligini tekshiring | — | `NewsArticle` schema |
| 16 | `/sitemap.xml`ni oching — maqola URL'i ro'yxatda | `/sitemap.xml` | — |
| 17 | Ulashish tugmalaridan birini bosing | `/news/[slug]` | `ShareButtons.tsx` |

Agar 13-qadamda maqola darhol ko'rinmasa (60 soniyagacha kutish kerak
bo'lsa) — `REVALIDATE_SECRET` ikkala `.env`da mos kelmayapti, degani.
10-bo'limga qarang.

---

## 7. E-QISM: Har bir faylning vazifasi

Bu bo'lim — loyihadagi **har bir fayl** uchun bitta qatorlik izoh.
Papka bo'yicha guruhlangan. Next.js va Strapi fayllari aniq ajratilgan.

### 7.1. Loyiha ildizi (`surxoncha/`)

| Fayl | Vazifasi |
|---|---|
| `package.json` | Next.js bog'liqliklari (next, react, next-auth, zod, lucide-react...) |
| `tsconfig.json` | TypeScript strict-mode sozlamalari, `@/*` yo'l alias'i |
| `tailwind.config.ts` | Brend ranglar/tipografika CSS-o'zgaruvchilarga bog'langan Tailwind config |
| `next.config.js` | Rasm domenlari, xavfsizlik header'lari, kesh header'lari, bundle optimallashtirish |
| `postcss.config.js` | Tailwind/Autoprefixer uchun standart PostCSS sozlamasi |
| `middleware.ts` | `/dashboard/*` va `/submit/*`ni himoyalaydi; `/dashboard/editor/*`ni faqat Editor'ga ochadi |
| `.env.example` | Barcha kerakli environment o'zgaruvchilarining namunasi |
| `README.md` | 1-qism yozuvlari (loyiha skeleti haqida) |
| `PHASE-2..8-NOTES.md` | Har bir qismning batafsil texnik yozuvlari |
| `MASTER-SETUP-GUIDE.md` | **Shu fayl** |

### 7.2. `app/` — sahifalar va route'lar

**Root:**

| Fayl | Vazifasi |
|---|---|
| `app/layout.tsx` | Butun sayt uchun umumiy HTML qobiq: `<html>`, global CSS, SessionProvider, Organization/WebSite JSON-LD, dinamik SEO metadata |
| `app/globals.css` | Brend ranglar (CSS variables), tipografika, `.article-prose`, `.category-pill` kabi utility class'lar |
| `app/sitemap.ts` | `/sitemap.xml` — barcha nashr qilingan kontent |
| `app/robots.ts` | `/robots.txt` |
| `app/rss.xml/route.ts` | `/rss.xml` — so'nggi 30 maqola |

**`app/(public)/`** — Header+Footer bilan o'ralgan ommaviy sahifalar:

| Fayl | Vazifasi |
|---|---|
| `layout.tsx` | Header + Footer'ni o'raydi |
| `page.tsx` | Bosh sahifa (hero, so'nggi yangiliklar, hududlar...) |
| `loading.tsx` | Bosh sahifa skeleton |
| `news/[slug]/page.tsx` | Maqola sahifasi — to'liq (galereya, video, ulashish, JSON-LD) |
| `news/[slug]/loading.tsx` | Maqola skeleton |
| `category/[slug]/page.tsx` | Kategoriya arxivi |
| `category/[slug]/loading.tsx` | Kategoriya skeleton |
| `regions/page.tsx` | 14 tuman grid ko'rinishida |
| `regions/[slug]/page.tsx` | Bitta hudud arxivi |
| `regions/[slug]/loading.tsx` | Hudud skeleton |
| `authors/[username]/page.tsx` | Muallif profili |
| `search/page.tsx` | Qidiruv natijalari |
| `join/page.tsx` | "Jamoaga qo'shiling" — `JoinForm`ni o'raydi |
| `about/page.tsx` | "Biz haqimizda" |
| `contact/page.tsx` | "Aloqa" — `ContactForm`ni o'raydi |
| `editorial-policy/page.tsx` | Tahririyat siyosati matni |

**`app/(auth)/`** — login/register oqimi, alohida (markazlashgan karta) layout:

| Fayl | Vazifasi |
|---|---|
| `layout.tsx` | Markazlashgan karta ko'rinishidagi qobiq |
| `login/page.tsx` | `LoginForm`ni chaqiradi |
| `register/page.tsx` | Hududlar ro'yxatini serverdan olib, `RegisterForm`ga uzatadi |
| `forgot-password/page.tsx` | `ForgotPasswordForm`ni chaqiradi |
| `reset-password/page.tsx` | `ResetPasswordForm`ni chaqiradi (URL'dagi `?code=`ni o'qiydi) |

**`app/(community)/`** — autentifikatsiya talab qiladigan sahifalar:

| Fayl | Vazifasi |
|---|---|
| `submit/page.tsx` | Yangi maqola yuborish (rol tekshiruvi bilan) |
| `dashboard/layout.tsx` | Dashboard header + tab-navigatsiya (rolga qarab Editor tab'lari qo'shiladi) |
| `dashboard/page.tsx` | Contributor: o'z maqolalari + statistika. Registered User: ariza holati |
| `dashboard/articles/[id]/edit/page.tsx` | Mavjud maqolani tahrirlash (`SubmitArticleForm`ni `editMode`da ishlatadi) |
| `dashboard/editor/page.tsx` | Editorial Queue — real Tasdiqlash/Rad etish/Nashr tugmalari |
| `dashboard/editor/applications/page.tsx` | Contributor arizalarini ko'rib chiqish |

**`app/api/`** — backend route handler'lar (hammasi server-side, hech biri client kodga chiqmaydi):

| Fayl | Vazifasi |
|---|---|
| `api/auth/[...nextauth]/route.ts` | NextAuth asosiy handler |
| `api/register/route.ts` | Strapi user + AuthorProfile'ni birga yaratadi |
| `api/forgot-password/route.ts` | Strapi parol-tiklash so'roviga proxy |
| `api/reset-password/route.ts` | Strapi parol-yangilash so'roviga proxy |
| `api/applications/route.ts` | `/join` formasi backend'i |
| `api/applications/[id]/[action]/route.ts` | Ariza `approve`/`reject` — Editor JWT'i bilan |
| `api/submit-article/route.ts` | Yangi maqola: draft yaratadi, darhol submit qiladi |
| `api/edit-article/[id]/route.ts` | Mavjud maqolani yangilaydi, ixtiyoriy qayta yuboradi |
| `api/editorial/[id]/[action]/route.ts` | `submit`/`approve`/`reject`/`request-revision`/`publish` — umumiy proxy |
| `api/upload/route.ts` | Rasm yuklash — **magic-byte** orqali haqiqiy MIME tekshiruvi, 8MB limit |
| `api/tags-resolve/route.ts` | Vergul bilan yozilgan teglarni id'larga aylantiradi (standalone) |
| `api/articles/[id]/view/route.ts` | Ko'rishlar sonini oshirish uchun public proxy |
| `api/contact/route.ts` | `/contact` formasi backend'i |
| `api/revalidate/route.ts` | Strapi'dan webhook qabul qiladi, Next.js keshini yangilaydi |

### 7.3. `components/` — qayta ishlatiladigan UI qismlari

| Papka | Nima bor |
|---|---|
| `components/layout/` | `Header`, `Footer`, `BreakingNewsBar`, `MobileMenu`, `AccountMenu` — sayt qobig'i |
| `components/article/` | `ArticleCard`, `ArticleMeta`, `HeroArticle`, `RelatedArticles`, `ShareButtons`, `PhotoGallery`, `VideoEmbed`, `ViewCounter` |
| `components/author/` | `AuthorCard` |
| `components/region/` | `RegionCard` |
| `components/search/` | `SearchBox` (header ichida), `SearchInput` (qidiruv sahifasida, debounced) |
| `components/home/` | `SectionHeader`, `CommunityCTA` — faqat bosh sahifada |
| `components/common/` | `Breadcrumb`, `Pagination`, `EmptyState` — har qanday sahifada qayta ishlatiladi |
| `components/dashboard/` | `EditorialStatusBadge`, `StatCard`, `DashboardArticleRow`, `EditorialQueueRow`, `ApplicationRow` |
| `components/forms/` | `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `JoinForm`, `SubmitArticleForm`, `ContactForm` — barchasi client component, zod validatsiya bilan |
| `components/providers/` | `SessionProvider` — NextAuth'ni butun saytga ulaydi |
| `components/ui/` | `CategoryBadge` |

### 7.4. `lib/` — biznes-logika va API qatlami

| Fayl | Vazifasi |
|---|---|
| `lib/api/client.ts` | Barcha Strapi so'rovlari o'tadigan bitta `strapiFetch()` funksiyasi |
| `lib/api/articles.ts` | Maqolalar bilan bog'liq HAMMA so'rov (ro'yxat, bitta, workflow amallari) |
| `lib/api/categories.ts` | Kategoriyalar |
| `lib/api/regions.ts` | Hududlar |
| `lib/api/authors.ts` | Muallif profillari |
| `lib/api/search.ts` | Global qidiruv (4 turdagi natija birga) |
| `lib/api/site.ts` | Site Settings |
| `lib/api/media.ts` | Client-side rasm yuklash helper'i |
| `lib/api/tags.ts` | Server-only: tag topish/yaratish, slug→id |
| `lib/api/contributor-applications.ts` | Ariza yaratish |
| `lib/api/dashboard.ts` | Dashboard uchun maxsus, foydalanuvchining o'z JWT'i bilan ishlaydigan so'rovlar |
| `lib/auth/options.ts` | NextAuth konfiguratsiyasi (Strapi bilan integratsiya) |
| `lib/auth/session.ts` | `getCurrentUser`, `requireUser`, `requireEditor`, `canSubmitArticles` |
| `lib/seo/metadata.ts` | Next.js `Metadata` generatorlari (maqola, hudud, kategoriya, muallif uchun) |
| `lib/seo/structured-data.ts` | JSON-LD generatorlar (`NewsArticle`, `Organization`, `WebSite`, `BreadcrumbList`, `Person`) |
| `lib/validation/auth.ts` | zod: register/login/forgot-password sxemalari, media-yo'nalish ro'yxati |
| `lib/validation/application.ts` | zod: ariza va maqola yuborish sxemalari |
| `lib/utils.ts` | `cn()`, `mediaUrl()`, `formatDate()`, `formatRelativeTime()` |

### 7.5. `types/` va `config/`

| Fayl | Vazifasi |
|---|---|
| `types/content.ts` | Barcha content model'lar uchun TypeScript interfeyslar (Article, Region, AuthorProfile...) |
| `types/next-auth.d.ts` | NextAuth Session/JWT tiplarini `role`, `authorProfileId` bilan kengaytiradi |
| `config/nav.ts` | Bosh navigatsiya menyusi (bitta joyda, hamma yerda qayta ishlatiladi) |

### 7.6. `strapi-schemas/` — bular `surxoncha-cms/src/`ga NUSXALANADI

> Eslatma: quyidagi barcha yo'llar `strapi-schemas/src/...` prefiksisiz
> yozilgan — chunki nusxalangandan keyin ular haqiqiy Strapi loyihasida
> shu nom bilan `src/...` ostida joylashadi.

| Fayl | Vazifasi |
|---|---|
| `index.js` | **Bootstrap.** Har `strapi develop`da ishlaydi: 4 ta maxsus rol (Contributor/Reporter/Moderator/Editor) yaratadi, ruxsatlarni o'rnatadi, 14 tuman + 10 kategoriyani seed qiladi. Hammasi idempotent |
| `policies/is-owner-or-editor.js` | "Faqat o'zinikini tahrirlash mumkin" qoidasi — route policy sifatida |
| `utils/trigger-revalidate.js` | Next.js `/api/revalidate`ga webhook yuboruvchi yordamchi funksiya |
| `components/shared/seo.json` | SEO komponenti (Article/Region/SiteSetting ichida qayta ishlatiladi) |
| `components/article/gallery-image.json` | Maqola galereyasi uchun component |
| `components/article/correction-note.json` | Tuzatish yozuvi uchun component |
| `api/article/content-types/article/schema.json` | Article content-type — barcha maydonlar, 8 bosqichli status enum |
| `api/article/content-types/article/lifecycles.js` | **State-machine.** Status o'tishlarini server darajasida majburlaydi, `afterUpdate`da revalidation'ni ishga tushiradi |
| `api/article/controllers/article.js` | `find()` ownership-scoping + `submit/approve/reject/requestRevision/publish/incrementView` custom action'lar |
| `api/article/routes/article.js` | Standart CRUD route'lar, `findOne/update/delete`ga policy qo'shilgan |
| `api/article/routes/custom-article.js` | `/articles/:id/submit`, `/approve`, `/publish` va h.k. maxsus route'lar |
| `api/category/content-types/category/schema.json` | Category content-type |
| `api/category/content-types/category/lifecycles.js` | Revalidation trigger |
| `api/region/content-types/region/schema.json` | Region content-type |
| `api/region/content-types/region/lifecycles.js` | Revalidation trigger |
| `api/tag/content-types/tag/schema.json` | Tag content-type |
| `api/author-profile/content-types/author-profile/schema.json` | Public muallif profili (email/telefon YO'Q) |
| `api/author-profile/controllers/author-profile.js` | Email/telefon sizib chiqmasligi uchun qo'shimcha himoya qatlami |
| `api/contributor-application/content-types/contributor-application/schema.json` | Ariza content-type |
| `api/contributor-application/controllers/contributor-application.js` | `find()` scoping + `approve()` (rolni Contributor'ga o'zgartiradi) + `reject()` |
| `api/contributor-application/routes/contributor-application.js` | Standart CRUD |
| `api/contributor-application/routes/custom-contributor-application.js` | `/approve`, `/reject` maxsus route'lar |
| `api/editorial-action/content-types/editorial-action/schema.json` | O'chirib bo'lmaydigan audit-log content-type |
| `api/contact-message/content-types/contact-message/schema.json` | `/contact` formasi yozuvlari |
| `api/site-setting/content-types/site-setting/schema.json` | Sайт sozlamalari (single type) |
| `api/site-setting/content-types/site-setting/lifecycles.js` | Revalidation trigger |
| `docs/permissions-matrix.md` | 7 rol × 10 content-type — to'liq ruxsatlar jadvali (hujjat, kod emas) |

---

## 8. F-QISM: Environment o'zgaruvchilari

### 8.1. Next.js — `surxoncha/.env.local`

| O'zgaruvchi | Namuna qiymat | Izoh |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Production'da haqiqiy domen |
| `NEXT_PUBLIC_SITE_NAME` | `Surxoncha.uz` | — |
| `STRAPI_URL` | `http://localhost:1337` | Server-side so'rovlar uchun |
| `STRAPI_API_TOKEN` | `(4.3-bo'limda olingan)` | **Maxfiy.** Faqat serverda ishlatiladi |
| `STRAPI_MEDIA_HOSTNAME` | `localhost` | `next.config.js` rasm domeni uchun (production'da CDN domeni) |
| `NEXT_PUBLIC_STRAPI_URL` | `http://localhost:1337` | Client-side rasm preview uchun (yuklashda) |
| `DATABASE_URL` | — | **Ishlatilmaydi** (Next.js bazaga bevosita ulanmaydi, faqat Strapi API orqali) — qatorni bo'sh qoldirsa ham bo'ladi |
| `AUTH_SECRET` | `openssl rand -base64 32` chiqishi | NextAuth JWT imzosi uchun |
| `AUTH_URL` | `http://localhost:3000` | — |
| `STORAGE_*` | — | Faqat S3 ishlatilsa kerak (12-bo'limga qarang); local uchun bo'sh qoldiring |
| `REVALIDATE_SECRET` | Strapi bilan **bir xil** tasodifiy satr | 7-qism xavfsizligi uchun |
| `NEXT_PUBLIC_ANALYTICS_ID` | — | Ixtiyoriy |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | — | Ixtiyoriy, yoki Site Settings'dan |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID` | — | Kelajakda (11-bo'limga qarang), hozir ishlatilmaydi |

### 8.2. Strapi — `surxoncha-cms/.env`

`create-strapi-app` avtomatik yaratgan qatorlardan tashqari, **qo'lda
qo'shish kerak bo'lganlar**:

| O'zgaruvchi | Namuna qiymat | Izoh |
|---|---|---|
| `DATABASE_CLIENT` | `postgres` | `--quickstart` sqlite qo'yadi, buni o'zgartiring |
| `DATABASE_HOST` | `127.0.0.1` | — |
| `DATABASE_PORT` | `5432` | — |
| `DATABASE_NAME` | `surxoncha` | — |
| `DATABASE_USERNAME` | — | Sizning PostgreSQL useringiz |
| `DATABASE_PASSWORD` | — | Sizning PostgreSQL parolingiz |
| `REVALIDATE_SECRET` | Next.js bilan **bir xil** | `src/utils/trigger-revalidate.js` shuni o'qiydi |
| `NEXT_REVALIDATE_URL` | `http://localhost:3000/api/revalidate` | Production'da haqiqiy domen |

---

## 9. G-QISM: Nima nimaga bog'liq

Bu bo'lim — "nega aynan shu tartibda qilish kerak" savoliga javob:

1. **Strapi fayllari nusxalanmaguncha** `npm run develop` oddiy bo'sh
   Strapi'ni ishga tushiradi — bizning content-type'larimiz, bootstrap,
   controller'lar umuman yo'q bo'ladi. Shuning uchun **3.3-qadam 3.6-dan
   OLDIN** bo'lishi shart.

2. **Bootstrap (`index.js`) birinchi marta ishga tushmaguncha** rollar
   (Contributor, Editor...) va seed ma'lumotlar (14 tuman, 10 kategoriya)
   mavjud emas. `/register` formasi hudud tanlashni talab qiladi — agar
   tumanlar seed qilinmagan bo'lsa, forma bo'sh select ko'rsatadi va
   ro'yxatdan o'tib bo'lmaydi. Shuning uchun **birinchi `npm run develop`
   ishga tushishi, konsolda seed log'lari chiqishi shart**, keyin Next.js
   bilan ishlashni boshlang.

3. **`STRAPI_API_TOKEN` olinmaguncha** Next.js'ning `/api/register`,
   `/api/submit-article` kabi route'lari 500 xato qaytaradi — chunki
   ular region/category/tag qidirish uchun shu tokenni ishlatadi.

4. **`REVALIDATE_SECRET` ikkala tomonda mos kelmasa** — sayt baribir
   ishlайveradi, lekin "Publish" bosilgandan keyin maqola bosh sahifada
   ko'rinishi uchun ISR muddati (60 soniya) tugashini kutish kerak
   bo'ladi, "darhol" ko'rinmaydi. Bu funksional emas, faqat tezlik
   masalasi.

5. **Editor rolisiz** `/dashboard/editor`ga kirib bo'lmaydi (middleware
   403'ga yo'naltiradi) — shuning uchun sinov uchun 5.1-qadamdagi
   "o'zini Editor qilish" kerak.

6. **Rol o'zgargandan keyin qayta login qilish shart** — chunki
   `session.user.role` NextAuth JWT ichida keshlanadi (`lib/auth/
   options.ts`), Strapi'dagi o'zgarish avtomatik session'ga tushmaydi.

---

## 10. H-QISM: Muammolarni bartaraf etish

| Muammo | Sabab | Yechim |
|---|---|---|
| Strapi konsolida bootstrap log'lari chiqmaydi | `src/index.js` nusxalanmagan | `surxoncha-cms/src/index.js` mavjudligini tekshiring, `cp -r` qaytadan bajaring |
| `/register`da hudud select bo'sh | Bootstrap hali ishlamagan yoki region seed muvaffaqiyatsiz | Strapi konsolidagi xatoni o'qing; Content Manager → Region'da yozuvlar borligini tekshiring |
| `/api/register` 500 xato qaytaradi | `STRAPI_API_TOKEN` noto'g'ri/yo'q | `.env.local`ni tekshiring, tokenni qayta yarating (4.3-qadam) |
| Login qilib bo'lmaydi, "Invalid identifier" | Parol siyosati yoki email tasdiqlanmagan | Strapi'da **Settings → Users & Permissions → Advanced Settings** → "Enable email confirmation" o'chirilganligini tekshiring (default o'chiq) |
| `/dashboard/editor`ga kirganda `/dashboard?error=forbidden`ga tashlaydi | Sizning rolingiz Editor emas | 5.1-qadamni bajaring, **qayta login qiling** |
| Maqola publish qilindi, lekin bosh sahifada ko'rinmaydi | `REVALIDATE_SECRET` mos kelmayapti | Ikkala `.env`dagi qiymatni solishtiring; Strapi konsolida `[revalidate] ... muvaffaqiyatsiz` xabarini qidiring |
| Rasm yuklab bo'lmaydi, "Faqat JPEG, PNG..." xatosi | Fayl haqiqatan ham qo'llab-quvvatlanmaydigan format yoki buzilgan | Boshqa rasm bilan sinab ko'ring; `app/api/upload/route.ts`dagi magic-byte tekshiruvi juda qat'iy |
| `next/image` rasm ko'rsatmaydi, konsolda "hostname not configured" | `next.config.js`dagi `remotePatterns` bilan mos kelmaydi | `STRAPI_MEDIA_HOSTNAME`ni to'g'irlang yoki local uchun `localhost` qoldiring |
| Strapi PostgreSQL'ga ulanolmayapti | `.env`dagi baza ma'lumotlari noto'g'ri | `psql -U <user> -d surxoncha` bilan qo'lda ulanishni sinab ko'ring |
| `npm run dev` (Next.js) TypeScript xatolari bilan to'xtaydi | Ehtimol `npm install` to'liq bajarilmagan | `rm -rf node_modules package-lock.json && npm install` |

---

## 11. I-QISM: Nima kiritilmagan

Halol bo'lish uchun — bu loyihada **qasddan** qilinmagan narsalar:

- **Avtomatlashtirilgan testlar** (Jest/Playwright) — yozilmagan. Kod
  strukturasi (`lib/api/` xizmat qatlami) testlash uchun qulay qilib
  qurilgan, lekin test fayllarining o'zi yo'q.
- **Contributor'ni admin panelisiz Editor qilish UI'si** — hozircha
  faqat Strapi admin panelida qo'lda (5.1-qadam). Kelajakda
  `/dashboard/editor/team` kabi sahifa qo'shilishi mumkin.
- **Telegram avtomatik post** (spec 57-band) — arxitektura tayyor
  (`article.js#publish` ichida izoh bilan joy bor), lekin ulanmagan.
- **AI funksiyalar** (spec 58-band) — V1'dan chiqarilgan, spec ham
  shuni talab qilgan.
- **Kommentariylar** — spec 20-band buni aniq "keyinroq qo'shiladi"
  deb belgilagan.
- **Docker/CI-CD** — so'ralmagan, kerak bo'lsa alohida so'rang.

---

## 12. J-QISM: Production'ga chiqarish (qisqacha)

To'liq deploy qo'llanmasi bu hujjat doirasidan tashqarida, lekin asosiy
nuqtalar:

1. **Strapi**: Railway, Render yoki VPS'ga deploy qiling; production
   PostgreSQL'ga ulang; `NODE_ENV=production`.
2. **Next.js**: Vercel eng oson (bir marta GitHub repo ulash yetarli);
   yoki har qanday Node hosting.
3. Ikkala joyda ham `.env` qiymatlarini production domenlariga
   moslang (`NEXT_PUBLIC_SITE_URL`, `STRAPI_URL`, `NEXT_REVALIDATE_URL`
   va h.k.) — **localhost qolmasligi kerak**.
3. `STORAGE_*` o'zgaruvchilarini to'ldirib, Strapi'da S3-compatible
   provider plugin'ini (`@strapi/provider-upload-aws-s3` yoki
   Cloudflare R2 muqobili) o'rnating — production'da media fayllarni
   local diskda saqlash tavsiya etilmaydi.
4. `AUTH_SECRET` va `REVALIDATE_SECRET`ni **yangi, faqat production'ga
   xos** qiymatlar bilan almashtiring (local'dagilarni ishlatmang).
5. Strapi'da **Settings → API Tokens**dagi tokenlarni ham production
   uchun alohida yarating.

---

*Bu hujjat 8 qismlik ishlab chiqish jarayonining yakuniy, birlashtirilgan
qo'llanmasi. Har bir texnik qarorning "nega" qismi uchun `PHASE-1..8-
NOTES.md` fayllariga qarang.*
