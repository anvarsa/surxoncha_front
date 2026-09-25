# 7-qism: Performance — nima qo'shildi

## 1. On-demand revalidation (eng muhim qism)

Muammo: ISR (`revalidate: 60`) bilan Editor "Publish" tugmasini bossa,
o'quvchilar sahifada yangi maqolani ko'rishi uchun 60 soniyagacha kutishi
mumkin edi.

Yechim — ikki bosqichli:

1. **`app/api/revalidate/route.ts`** — Next.js'da webhook qabul qiluvchi.
   `x-revalidate-secret` header orqali tasdiqlaydi, so'ng model turiga
   qarab `revalidateTag()`/`revalidatePath()` chaqiradi.
2. **`strapi-schemas/src/utils/trigger-revalidate.js`** — Strapi
   tomonidan chaqiriladigan yordamchi. `article`, `category`, `region`,
   `site-setting` uchun `lifecycles.js`ning `afterUpdate` bosqichiga
   ulangan — **admin panelda qo'shimcha sozlash shart emas**, faqat
   ikkala loyihada bir xil `REVALIDATE_SECRET` bo'lishi kifoya.

Natija: Editor "Publish" bosgan zahoti (`article.afterUpdate` →
`triggerRevalidate` → Next.js `revalidateTag("articles")` +
`revalidatePath("/news/[slug]")`) bosh sahifa va maqola sahifasi
**darhol** yangilanadi, 60 soniya kutilmaydi.

## 2. Kesh teglari strategiyasi

```
lib/api/articles.ts    → "articles" (ro'yxatlar), "article:{slug}" (bitta maqola)
lib/api/categories.ts   → "categories"
lib/api/regions.ts       → "regions"
lib/api/authors.ts        → "author-profiles"
lib/api/site.ts            → "site-settings"
```

Bundan tashqari `getAllRegions()`dagi eski xato tuzatildi: `coverImage`
`populate` qilinmagan edi — `RegionCard` komponenti rasm ko'rsata
olmasdi. Endi to'g'irlandi.

## 3. Rasm optimizatsiyasi (`next.config.js`)

- `formats: ["image/avif", "image/webp"]` — brauzer qo'llab-quvvatlasa,
  eng kichik formatni avtomatik tanlaydi.
- `deviceSizes` mobil-birinchi qurilma kengliklariga moslashtirildi
  (360–1536px) — kerakli o'lchamdan katta rasm yuklanmaydi.
- `/_next/image` va `/_next/static` uchun 1 yillik `immutable`
  Cache-Control — CDN/brauzer qayta so'ramaydi.
- Har bir `<Image>` chaqiruvida (5-qismda) `sizes` atributi to'g'ri
  belgilangan — brauzer aynan kerakli o'lchamni yuklaydi, katta rasmni
  kichraytirib ko'rsatmaydi.

## 4. Bundle hajmi

- `experimental.optimizePackageImports: ["lucide-react"]` — faqat
  ishlatilgan ikonkalar bundle'ga kiradi.
- Arxitektura bo'yicha: `Header`, `Footer`, `BreakingNewsBar`,
  `ArticleCard`, barcha sahifalar — **Server Component**. Faqat haqiqatan
  interaktiv qism (`MobileMenu`, `AccountMenu`, `SearchBox`, `ShareButtons`,
  barcha formalar) `"use client"`. Bu client JS hajmini minimal saqlaydi.
- Sahifalash (`Pagination`) va `pageSize` cheklovlari (12 ta maqola/sahifa)
  — bitta so'rovda ortiqcha ma'lumot yuklanmaydi.

## 5. Perceived performance — skeleton holatlar

```
app/(public)/loading.tsx                  # bosh sahifa
app/(public)/news/[slug]/loading.tsx       # maqola sahifasi
app/(public)/category/[slug]/loading.tsx    # kategoriya arxivi
app/(public)/regions/[slug]/loading.tsx      # hudud arxivi
```

Next.js'ning `loading.tsx` konvensiyasi — server component ma'lumot
kutayotganda avtomatik ko'rsatiladi, blank oq ekran bo'lmaydi.

## O'rnatish (yangi qadam)

`.env.local` (Next.js) va Strapi loyihasining `.env`ida **bir xil**
qiymat:

```
REVALIDATE_SECRET=<uzun tasodifiy satr>
```

Strapi tomonida qo'shimcha: `NEXT_REVALIDATE_URL` (production'da Next.js
domenini ko'rsatadi, masalan `https://surxoncha.uz/api/revalidate`).

## Core Web Vitals — tavsiyalar (qo'lda tekshirish uchun)

- **LCP** (Largest Contentful Paint): Hero rasmda `priority` va `fetchPriority`
  allaqachon qo'yilgan (`HeroArticle`, maqola cover rasmi) — brauzer uni
  eng birinchi yuklaydi.
- **CLS** (Cumulative Layout Shift): barcha rasm konteynerlari `aspect-*`
  klasslari bilan oldindan o'lcham egallaydi — rasm yuklanganda joy
  siljimaydi.
- **INP** (Interaction to Next Paint): og'ir client-side state yo'q;
  formalar oddiy `useState`, debounce faqat qidiruvda.
- Production'ga chiqarishdan oldin: `npm run build` → Lighthouse (Chrome
  DevTools) yoki `npx unlighthouse` bilan haqiqiy raqamlarni tekshiring.

## Keyingi qism

**8-qism** — Contributor va Editor dashboard'lari: qoralamalar, statistika,
Editorial Queue UI (2 va 4-qismdagi backend endpoint'lariga to'liq
ulangan holda), ariza va maqolalarni ko'rib chiqish interfeysi.

Davom ettirish uchun: **"8-qismni boshla"**
