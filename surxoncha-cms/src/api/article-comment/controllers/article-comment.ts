// @ts-nocheck
'use strict';

export {};

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article-comment.article-comment', ({ strapi }) => ({
  async create(ctx) {
    const payload = ctx.request.body?.data || ctx.request.body || {};
    const articleId = payload.article;
    if (!articleId || !payload.name || !payload.message) {
      return ctx.badRequest('Maqola, ism va izoh majburiy.');
    }
    const data = {
      article: articleId,
      name: String(payload.name).trim().slice(0, 80),
      email: payload.email ? String(payload.email).trim() : null,
      message: String(payload.message).trim().slice(0, 1000),
      approved: false,
    };
    if (ctx.state.user) data.author = ctx.state.user.id;
    const entity = await strapi.service('api::article-comment.article-comment').create({ data });
    return this.transformResponse(entity);
  },
}));
