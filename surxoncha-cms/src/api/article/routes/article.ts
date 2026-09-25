// @ts-nocheck
'use strict';

export {};

/**
 * src/api/article/routes/article.js
 * Standart CRUD marshrutlari (find, findOne, create, update, delete).
 * update/delete uchun ownership tekshiruvi policy orqali qo'shiladi.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::article.article', {
  config: {
    // findOne — faqat Dashboard'da "tahrirlash" uchun ishlatiladi (public
    // sahifalar /articles?filters[slug]=... qidiradi, findOne emas),
    // shuning uchun bu yerga policy qo'yish xavfsiz.
    findOne: { policies: ['global::is-owner-or-editor'] },
    update: { policies: ['global::is-owner-or-editor'] },
    delete: { policies: ['global::is-owner-or-editor'] },
  },
});
