'use strict';

/**
 * src/api/article/content-types/article/lifecycles.js
 *
 * Bu qoidalar controller/policy darajasidan MUSTAQIL ravishda,
 * har qanday yozish amalida (admin panel, REST, boshqa plugin) ishlaydi.
 * "Never trust frontend permissions" — spec 46-band.
 */

const { triggerRevalidate } = require('../../../../utils/trigger-revalidate');

const ALLOWED_TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['in_review', 'revision_requested', 'rejected'],
  in_review: ['approved', 'revision_requested', 'rejected'],
  revision_requested: ['submitted'],
  approved: ['published'],
  published: ['archived'],
  rejected: ['draft'],
  archived: [],
};

const EDITOR_ROLES = ['editor', 'administrator'];

function currentUserRole(ctx) {
  return ctx?.state?.user?.role?.type || null;
}

module.exports = {
  async beforeUpdate(event) {
    const { params, state } = event;
    const ctx = strapi.requestContext.get();
    if (!ctx) return; // internal/system update (e.g. bootstrap seed) — skip guard

    const incomingStatus = params.data?.status;
    if (!incomingStatus) return; // status not being changed, nothing to validate

    const existing = await strapi.db
      .query('api::article.article')
      .findOne({ where: params.where, populate: ['author', 'author.user'] });
    if (!existing) return;

    const role = currentUserRole(ctx);
    const isEditor = EDITOR_ROLES.includes(role);
    const isOwner = existing.author?.user === ctx.state.user?.id;

    // 1. Only Editor/Administrator may move a piece into approved/published/archived.
    const editorOnlyStatuses = ['approved', 'published', 'archived', 'in_review'];
    if (editorOnlyStatuses.includes(incomingStatus) && !isEditor) {
      throw new Error(
        `Faqat Editor status'ni "${incomingStatus}" ga o'zgartira oladi.`
      );
    }

    // 2. Contributors may only move their OWN article, and only along legal edges.
    if (!isEditor && !isOwner) {
      throw new Error("Boshqa muallifning maqolasini tahrirlash mumkin emas.");
    }

    // 3. Enforce the state machine — no skipping steps, even for editors,
    //    to keep the editorial audit trail meaningful.
    const allowedNext = ALLOWED_TRANSITIONS[existing.status] || [];
    if (existing.status !== incomingStatus && !allowedNext.includes(incomingStatus)) {
      throw new Error(
        `Status "${existing.status}" dan "${incomingStatus}" ga to'g'ridan-to'g'ri o'tib bo'lmaydi.`
      );
    }

    // 4. Setting publishedAt only happens automatically, on entering "published".
    if (incomingStatus === 'published' && existing.status !== 'published') {
      params.data.publishedAt = new Date();
    }
  },

  async beforeCreate(event) {
    const { params } = event;
    // Every article always starts as a draft, regardless of what the client sends.
    params.data.status = 'draft';
    params.data.viewCount = 0;
    params.data.featured = false;
    params.data.breaking = false;
  },

  async afterUpdate(event) {
    // published/unpublished/o'zgartirilgan maqolalar uchun Next.js keshini
    // darhol yangilaymiz — o'quvchi "Publish" tugmasidan keyin 60 soniya
    // kutmasligi kerak (7-qism, Core Web Vitals / perceived performance).
    const { result } = event;
    if (!result?.slug) return;
    await triggerRevalidate('article', result);
  },
};
