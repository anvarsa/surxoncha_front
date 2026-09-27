// @ts-nocheck
'use strict';

export {};

/**
 * src/api/author-profile/controllers/author-profile.js
 *
 * Schema darajasida email/phone author-profile'da umuman yo'q, lekin
 * "user" relation http so'rovda noto'g'ri populate qilinsa ham sizib chiqmasligi
 * uchun qo'shimcha strip qilamiz — depth-in-depth xavfsizlik.
 */

const { createCoreController } = require('@strapi/strapi').factories;

function stripPrivateUserFields(entity) {
  if (entity?.user) {
    const { email, phone, provider, resetPasswordToken, confirmationToken, ...safeUser } =
      entity.user;
    entity.user = safeUser;
  }
  return entity;
}

module.exports = createCoreController('api::author-profile.author-profile', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data: Array.isArray(data) ? data.map(stripPrivateUserFields) : data, meta };
  },
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    return { data: stripPrivateUserFields(data), meta };
  },
}));
