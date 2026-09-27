// @ts-nocheck
'use strict';

export {};

/**
 * src/api/contributor-application/controllers/contributor-application.js
 *
 * approve(): pending -> approved, va shu arizaning applicant'iga tegishli
 * AuthorProfile.communityRole'ni "contributor" (yoki "reporter") ga o'zgartiradi.
 * Bu "Test Scenario" 5-6 qadamlarini (Admin approves -> User becomes Contributor)
 * amalga oshiradi.
 */

const { createCoreController } = require('@strapi/strapi').factories;

const REVIEWER_ROLES = ['editor', 'moderator', 'administrator'];

module.exports = createCoreController(
  'api::contributor-application.contributor-application',
  ({ strapi }) => ({
    /** Registered User/Contributor faqat o'z arizasini ko'radi;
     *  Moderator/Editor/Administrator barchasini ko'radi (Editorial Queue). */
    async find(ctx) {
      const role = ctx.state.user?.role?.type;
      const userId = ctx.state.user?.id;
      const isReviewer = REVIEWER_ROLES.includes(role);

      if (!isReviewer && userId) {
        const applications = await strapi.db
          .query('api::contributor-application.contributor-application')
          .findMany({
            where: { applicant: { id: userId } },
            orderBy: { createdAt: 'desc' },
            limit: 1,
            populate: ['region'],
          });
        const data = await this.sanitizeOutput(applications, ctx);
        return this.transformResponse(data, {
          pagination: { page: 1, pageSize: 1, pageCount: data.length ? 1 : 0, total: data.length },
        });
      }

      return super.find(ctx);
    },

    async approve(ctx) {
      const { id } = ctx.params;
      const { asRole } = ctx.request.body ?? {}; // "contributor" | "reporter", default "contributor"
      const targetRole = asRole === 'reporter' ? 'reporter' : 'contributor';

      const application = await strapi.db
        .query('api::contributor-application.contributor-application')
        .findOne({ where: { id }, populate: ['applicant'] });

      if (!application) return ctx.notFound();
      if (application.status !== 'pending') {
        return ctx.badRequest('Bu ariza allaqachon ko\'rib chiqilgan.');
      }

      const profile = await strapi.db
        .query('api::author-profile.author-profile')
        .findOne({ where: { user: application.applicant.id } });

      if (!profile) {
        return ctx.badRequest('Arizachining profil yozuvi topilmadi.');
      }

      await strapi.db.query('api::author-profile.author-profile').update({
        where: { id: profile.id },
        data: { communityRole: targetRole },
      });

      const updated = await strapi.db
        .query('api::contributor-application.contributor-application')
        .update({ where: { id }, data: { status: 'approved' } });

      return { data: updated };
    },

    async reject(ctx) {
      const { id } = ctx.params;
      const { reviewNote } = ctx.request.body ?? {};

      const application = await strapi.db
        .query('api::contributor-application.contributor-application')
        .findOne({ where: { id } });
      if (!application) return ctx.notFound();
      if (application.status !== 'pending') {
        return ctx.badRequest('Bu ariza allaqachon ko\'rib chiqilgan.');
      }

      const updated = await strapi.db
        .query('api::contributor-application.contributor-application')
        .update({ where: { id }, data: { status: 'rejected', reviewNote } });

      return { data: updated };
    },
  })
);
