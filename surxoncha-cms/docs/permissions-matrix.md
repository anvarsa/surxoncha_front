# SURXONCHA.UZ — Ruxsatlar Matritsasi (Permissions)

Ikki xil ruxsat tizimi ishlaydi:

1. **Strapi Admin RBAC** — faqat `Administrator` va `Editor` (CMS xodimlari) shu yerga kiradi, `/admin` panelga kirish huquqi.
2. **users-permissions plugin roles** — saytdagi oddiy foydalanuvchilar (`Public`, `Registered User`, `Contributor`, `Reporter`, `Moderator`) shu orqali boshqariladi, REST API orqali.

`Editor` va `Administrator` CMS ichida **Strapi Admin RBAC** orqali ham, kerak bo'lsa users-permissions'dagi `Editor` roli orqali ham (frontend dashboard uchun) ishlaydi.

> **Muhim:** Bu jadval faqat hujjat emas — har bir qator `src/index.js` bootstrap skriptida dasturiy tarzda o'rnatiladi (pastda), shuning uchun admin panelda qo'lda bosish shart emas va muhitlar orasida bir xil bo'ladi.

## Content-type bo'yicha ruxsatlar

| Content-Type | Public | Registered User | Contributor / Reporter | Moderator | Editor | Administrator |
|---|---|---|---|---|---|---|
| **Article** (published) | find, findOne | find, findOne | find, findOne | find, findOne | find, findOne | full |
| **Article** (own draft/submitted) | — | — | create, find(own), update(own), delete(own draft) | find | find, update(status), findAll | full |
| **Article** (boshqa muallif) | — | — | ❌ | ❌ (read-only) | update(status) | full |
| **Category / Region / Tag** | find, findOne | find, findOne | find, findOne | find, findOne | full | full |
| **Author Profile** (public fields) | find, findOne | find, findOne | find, findOne | find, findOne | full | full |
| **Author Profile** (o'zi) | — | update(own, safe fields) | update(own, safe fields) | update(own) | full | full |
| **Contributor Application** | — | create(own) | create(own) | find, update(status) | find, update(status) | full |
| **Editorial Action** | — | — | find(own article) | find | create, find | full |
| **Contact Message** | create | create | create | find, update(resolved) | find | full |
| **Site Setting** | find | find | find | find | update | full |

Legend: "own" — faqat `user` yoki `author` relation joriy foydalanuvchiga teng bo'lgan yozuvlar; "❌" — server darajasida rad etiladi, hatto to'g'ri token bilan ham.

## Kritik server-side qoidalar (frontend tekshiruviga ishonilmaydi)

1. Contributor/Reporter **hech qachon** `status`ni to'g'ridan-to'g'ri `published`ga o'zgartira olmaydi — bu faqat Editor roli uchun ochiq `lifecycles.js` darajasida bloklanadi.
2. Contributor faqat `author.user.id === ctx.state.user.id` bo'lgan maqolani tahrirlashi mumkin — `is-owner-or-editor` policy orqali.
3. `viewCount` faqat maxsus `/articles/:id/view` endpoint orqali, faqat serverda oshiriladi — client to'g'ridan-to'g'ri PUT qila olmaydi.
4. `featured`, `breaking`, `sponsored` maydonlarini faqat Editor/Administrator o'zgartira oladi.
5. Author Profile'dagi `user.email`, `user.phone` maydonlari public API javobida **hech qachon** qaytarilmaydi (custom controller sanitize).
