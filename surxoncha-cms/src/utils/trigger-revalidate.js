'use strict';

/**
 * src/utils/trigger-revalidate.js
 *
 * Strapi'ning o'rnatilgan "Webhooks" UI'si (Settings → Webhooks) bilan ham
 * ishlaydi, lekin loyihani bitta joyda, versiyalangan holda saqlash uchun
 * shu yordamchi funksiya afterUpdate/afterCreate/afterDelete hook'laridan
 * to'g'ridan-to'g'ri chaqiriladi — Strapi admin panelida qo'shimcha sozlash
 * shart emas, ENV o'zgaruvchisini to'g'rilash yetarli.
 */

const NEXT_REVALIDATE_URL =
  process.env.NEXT_REVALIDATE_URL || 'http://localhost:3000/api/revalidate';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

async function triggerRevalidate(model, entry) {
  if (!REVALIDATE_SECRET) {
    strapi.log.warn(
      '[revalidate] REVALIDATE_SECRET sozlanmagan — Next.js keshi avtomatik yangilanmaydi.'
    );
    return;
  }

  try {
    await fetch(NEXT_REVALIDATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATE_SECRET,
      },
      body: JSON.stringify({ model, entry: { id: entry.id, slug: entry.slug } }),
    });
  } catch (err) {
    // Revalidation muvaffaqiyatsiz bo'lsa ham yozish amali (publish, save)
    // muvaffaqiyatli qolishi kerak — sahifa shunchaki keyingi ISR
    // muddatida (revalidate=60s) yangilanadi.
    strapi.log.error(`[revalidate] ${model} uchun so'rov muvaffaqiyatsiz: ${err.message}`);
  }
}

module.exports = { triggerRevalidate };
