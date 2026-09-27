// import type { Core } from '@strapi/strapi';

const { seedDemoData } = require(`${process.cwd()}/src/utils/seed-demo-data.js`);

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    const actions = [
      'api::photo.photo.find',
      'api::photo.photo.findOne',
      'api::article.article.find',
      'api::article.article.findOne',
      'api::category.category.find',
      'api::category.category.findOne',
      'api::region.region.find',
      'api::region.region.findOne',
      'api::tag.tag.find',
      'api::author-profile.author-profile.find',
      'api::author-profile.author-profile.findOne',
      'api::site-setting.site-setting.find',
      'api::video.video.find',
      'api::video.video.findOne',
      'api::article-comment.article-comment.find',
      'api::article-comment.article-comment.create',
    ];
    const authenticatedActions = [
      'api::contributor-application.contributor-application.find',
      'api::contributor-application.contributor-application.create',
      'api::contact-message.contact-message.create',
    ];
    const roles = await strapi.query('plugin::users-permissions.role').findMany({
      where: { type: { $in: ['public', 'authenticated', 'editor', 'contributor', 'reporter'] } },
    });

    for (const role of roles) {
      if (role.type === 'public') {
        await strapi
          .query('plugin::users-permissions.permission')
          .deleteMany({
            where: {
              action: {
                $in: [
                  'api::contributor-application.contributor-application.find',
                  'api::contributor-application.contributor-application.findOne',
                ],
              },
              role: role.id,
            },
          });
      }
      const roleActions = role.type === 'authenticated'
        ? [...actions, ...authenticatedActions]
        : actions;
      for (const action of roleActions) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: role.id } });
        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action, role: role.id, enabled: true },
          });
        }
      }
    }

    await seedDemoData(strapi);
  },
};
