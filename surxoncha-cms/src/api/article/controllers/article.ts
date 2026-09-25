// @ts-nocheck
'use strict';

export {};

/**
 * src/api/article/controllers/article.js
 *
 * Core find/findOne/create/update Strapi avtomatik beradi.
 * Bu yerda faqat workflow-maxsus action'lar: submit, requestRevision,
 * approve, reject, publish, va view-count increment.
 * Haqiqiy ruxsat tekshiruvi lifecycles.js (state machine) va
 * is-owner-or-editor policy'da — bu yerda faqat orkestratsiya.
 */

const { createCoreController } = require('@strapi/strapi').factories;

const EDITOR_ROLES = ['editor', 'administrator'];

async function logEditorialAction(strapi, { articleId, editorAuthorProfileId, action, note }) {
  await strapi.db.query('api::editorial-action.editorial-action').create({
    data: {
      article: articleId,
      editor: editorAuthorProfileId,
      action,
      note: note || null,
    },
  });
}

async function getAuthorProfileIdForUser(strapi, userId) {
  const profile = await strapi.db
    .query('api::author-profile.author-profile')
    .findOne({ where: { user: userId } });
  return profile?.id ?? null;
}

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  /**
   * Ruxsat qatlami: Editor/Administrator cheklovsiz ko'radi. Boshqa hamma
   * (jumladan Contributor/Reporter) faqat: (a) status="published" bo'lgan
   * har qanday maqolani, YOKI (b) o'zining muallif profiliga tegishli
   * maqolani (istalgan statusda) ko'ra oladi. Bu Dashboard'ning "Mening
   * maqolalarim" ro'yxati ishlashi uchun ZARUR, lekin boshqa Contributor'ning
   * qoralamasini oshkor qilmaydi.
   */
  async find(ctx) {
    const role = ctx.state.user?.role?.type;
    const userId = ctx.state.user?.id;
    const isEditor = EDITOR_ROLES.includes(role);

    if (!isEditor) {
      const existingFilters = ctx.query.filters || {};
      const ownershipClause = userId
        ? { $or: [{ status: { $eq: 'published' } }, { author: { user: { id: { $eq: userId } } } }] }
        : { status: { $eq: 'published' } };

      ctx.query = {
        ...ctx.query,
        filters: { $and: [existingFilters, ownershipClause] },
      };
    }

    return super.find(ctx);
  },

  /** Contributor: draft -> submitted */
  async submit(ctx) {
    const { id } = ctx.params;
    const updated = await strapi.entityService.update('api::article.article', id, {
      data: { status: 'submitted' },
    });
    return { data: updated };
  },

  /** Editor: submitted/in_review -> revision_requested (with a note the contributor sees) */
  async requestRevision(ctx) {
    const { id } = ctx.params;
    const { note } = ctx.request.body ?? {};
    if (!note) return ctx.badRequest("Qayta ko'rib chiqish sababini kiriting.");

    const updated = await strapi.entityService.update('api::article.article', id, {
      data: { status: 'revision_requested' },
    });

    const editorProfileId = await getAuthorProfileIdForUser(strapi, ctx.state.user.id);
    await logEditorialAction(strapi, {
      articleId: id,
      editorAuthorProfileId: editorProfileId,
      action: 'request_revision',
      note,
    });

    return { data: updated };
  },

  /** Editor: submitted/in_review -> approved */
  async approve(ctx) {
    const { id } = ctx.params;
    const updated = await strapi.entityService.update('api::article.article', id, {
      data: { status: 'approved' },
    });

    const editorProfileId = await getAuthorProfileIdForUser(strapi, ctx.state.user.id);
    await logEditorialAction(strapi, {
      articleId: id,
      editorAuthorProfileId: editorProfileId,
      action: 'approve',
    });

    return { data: updated };
  },

  /** Editor: submitted/in_review -> rejected */
  async reject(ctx) {
    const { id } = ctx.params;
    const { note } = ctx.request.body ?? {};

    const updated = await strapi.entityService.update('api::article.article', id, {
      data: { status: 'rejected' },
    });

    const editorProfileId = await getAuthorProfileIdForUser(strapi, ctx.state.user.id);
    await logEditorialAction(strapi, {
      articleId: id,
      editorAuthorProfileId: editorProfileId,
      action: 'reject',
      note,
    });

    return { data: updated };
  },

  /** Editor: approved -> published (sets publishedAt via lifecycle hook) */
  async publish(ctx) {
    const { id } = ctx.params;
    const updated = await strapi.entityService.update('api::article.article', id, {
      data: { status: 'published' },
    });

    const editorProfileId = await getAuthorProfileIdForUser(strapi, ctx.state.user.id);
    await logEditorialAction(strapi, {
      articleId: id,
      editorAuthorProfileId: editorProfileId,
      action: 'publish',
    });

    // Future: fire Telegram webhook here (spec section 57) — kept out of V1.
    return { data: updated };
  },

  /** Public: increment view count. No auth required, but rate-limited at the
   *  gateway/middleware level to prevent trivial abuse. */
  async incrementView(ctx) {
    const { id } = ctx.params;
    const article = await strapi.db
      .query('api::article.article')
      .findOne({ where: { id, status: 'published' } });
    if (!article) return ctx.notFound();

    const updated = await strapi.db.query('api::article.article').update({
      where: { id },
      data: { viewCount: (article.viewCount || 0) + 1 },
    });
    return { data: { id: updated.id, viewCount: updated.viewCount } };
  },
}));
