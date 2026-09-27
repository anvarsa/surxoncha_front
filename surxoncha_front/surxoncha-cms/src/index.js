'use strict';

/**
 * src/index.js
 *
 * Strapi loyihaning bootstrap fayli. Har safar `strapi start`/`develop`da ishlaydi,
 * lekin barcha amallar IDEMPOTENT — allaqachon mavjud bo'lsa qayta yaratilmaydi.
 *
 * Bajaradi:
 *  1. users-permissions plugin'da maxsus rollarni yaratadi:
 *     Contributor, Reporter, Moderator, Editor
 *     (Registered User = mavjud "Authenticated" roli, Public Visitor = mavjud "Public" roli)
 *  2. Har bir rol uchun permissions-matrix.md'ga mos ruxsatlarni o'rnatadi.
 *  3. 14 ta Surxondaryo tumanini va 10 ta kategoriyani seed qiladi.
 */

const CUSTOM_ROLES = [
  { name: 'Contributor', type: 'contributor', description: "Maqola yozadi, faqat o'z qoralamalarini boshqaradi" },
  { name: 'Reporter', type: 'reporter', description: 'Contributor bilan bir xil huquq, tajribali muxbir statusi' },
  { name: 'Moderator', type: 'moderator', description: 'Community kontent va murojaatlarni moderatsiya qiladi' },
  { name: 'Editor', type: 'editor', description: 'Maqolalarni tekshiradi, tasdiqlaydi va nashr qiladi' },
];

const REGIONS = [
  'Termiz shahri', 'Angor', 'Bandixon', 'Boysun', 'Denov', "Jarqo'rg'on",
  'Muzrabot', 'Oltinsoy', 'Qiziriq', "Qumqo'rg'on", 'Sariosiyo', 'Sherobod',
  "Sho'rchi", 'Uzun',
];

const CATEGORIES = [
  'Yangiliklar', 'Jamiyat', "Ta'lim", 'Biznes', 'Yoshlar',
  'Texnologiya', 'Madaniyat', 'Sport', 'Intervyu', 'Reportaj',
];

/** action nomlari Strapi'ning `plugin::content-manager` emas,
 *  balki `api::<name>.<name>` controller action'lariga mos keladi. */
const PERMISSIONS_BY_ROLE = {
  public: [
    'api::article.article.find', 'api::article.article.findOne',
    'api::category.category.find', 'api::category.category.findOne',
    'api::region.region.find', 'api::region.region.findOne',
    'api::tag.tag.find', 'api::tag.tag.findOne',
    'api::author-profile.author-profile.find', 'api::author-profile.author-profile.findOne',
    'api::contact-message.contact-message.create',
    'api::site-setting.site-setting.find',
    'api::photo.photo.find', 'api::photo.photo.findOne',
    'api::video.video.find', 'api::video.video.findOne',
  ],
  authenticated: [
    // "Registered User" — Strapi's built-in Authenticated role
    'api::article.article.find', 'api::article.article.findOne',
    'api::category.category.find', 'api::region.region.find', 'api::tag.tag.find',
    'api::author-profile.author-profile.find', 'api::author-profile.author-profile.findOne',
    'api::author-profile.author-profile.update', // policy restricts to own record
    'api::contributor-application.contributor-application.create',
    'api::contributor-application.contributor-application.find', // own, filtered in controller
    'api::contact-message.contact-message.create',
    'api::site-setting.site-setting.find',
    'api::photo.photo.find', 'api::photo.photo.findOne',
    'api::video.video.find', 'api::video.video.findOne',
  ],
  contributor: [
    'api::article.article.find', 'api::article.article.findOne',
    'api::article.article.create',
    'api::article.article.update', // policy restricts to own + non-published
    'api::category.category.find', 'api::region.region.find', 'api::tag.tag.find',
    'api::author-profile.author-profile.find', 'api::author-profile.author-profile.findOne',
    'api::author-profile.author-profile.update', // own only
    'api::editorial-action.editorial-action.find', // own article's actions
    'api::site-setting.site-setting.find',
    'api::photo.photo.find', 'api::photo.photo.findOne',
    'api::video.video.find', 'api::video.video.findOne',
  ],
  moderator: [
    'api::article.article.find', 'api::article.article.findOne',
    'api::category.category.find', 'api::region.region.find', 'api::tag.tag.find',
    'api::author-profile.author-profile.find', 'api::author-profile.author-profile.update',
    'api::contributor-application.contributor-application.find',
    'api::contributor-application.contributor-application.update',
    'api::contributor-application.contributor-application.approve',
    'api::contributor-application.contributor-application.reject',
    'api::contact-message.contact-message.find',
    'api::contact-message.contact-message.update',
    'api::site-setting.site-setting.find',
  ],
  editor: [
    'api::article.article.find', 'api::article.article.findOne',
    'api::article.article.update', // full — status transitions
    'api::category.category.find', 'api::category.category.create', 'api::category.category.update',
    'api::region.region.find', 'api::region.region.create', 'api::region.region.update',
    'api::tag.tag.find', 'api::tag.tag.create',
    'api::author-profile.author-profile.find', 'api::author-profile.author-profile.update',
    'api::contributor-application.contributor-application.find',
    'api::contributor-application.contributor-application.update',
    'api::contributor-application.contributor-application.approve',
    'api::contributor-application.contributor-application.reject',
    'api::editorial-action.editorial-action.find', 'api::editorial-action.editorial-action.create',
    'api::contact-message.contact-message.find',
    'api::site-setting.site-setting.find', 'api::site-setting.site-setting.update',
    'api::photo.photo.find', 'api::photo.photo.findOne', 'api::photo.photo.create', 'api::photo.photo.update',
    'api::video.video.find', 'api::video.video.findOne', 'api::video.video.create', 'api::video.video.update',
  ],
};

// reporter gets the same permission set as contributor
PERMISSIONS_BY_ROLE.reporter = PERMISSIONS_BY_ROLE.contributor;

async function ensureRole(strapi, { name, type, description }) {
  const existing = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type } });
  if (existing) return existing;

  strapi.log.info(`[bootstrap] Creating role: ${name}`);
  return strapi.query('plugin::users-permissions.role').create({
    data: { name, type, description },
  });
}

async function setPermissionsForRole(strapi, roleId, actions) {
  for (const action of actions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: roleId } });
    if (existing) continue;
    await strapi.query('plugin::users-permissions.permission').create({
      data: { action, role: roleId, enabled: true },
    });
  }
}

async function seedCollection(strapi, uid, items, buildData) {
  for (const item of items) {
    const slug = item
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const existing = await strapi.db.query(uid).findOne({ where: { slug } });
    if (existing) continue;
    strapi.log.info(`[bootstrap] Seeding ${uid}: ${item}`);
    await strapi.db.query(uid).create({ data: buildData(item, slug) });
  }
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    // 1. Custom roles
    const createdRoles = {};
    for (const role of CUSTOM_ROLES) {
      createdRoles[role.type] = await ensureRole(strapi, role);
    }

    // 2. Permissions for built-in roles (public/authenticated)
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (publicRole) await setPermissionsForRole(strapi, publicRole.id, PERMISSIONS_BY_ROLE.public);
    if (authenticatedRole) await setPermissionsForRole(strapi, authenticatedRole.id, PERMISSIONS_BY_ROLE.authenticated);

    // 3. Permissions for custom roles
    for (const [type, role] of Object.entries(createdRoles)) {
      await setPermissionsForRole(strapi, role.id, PERMISSIONS_BY_ROLE[type] || []);
    }

    // 4. Seed regions
    await seedCollection(strapi, 'api::region.region', REGIONS, (name, slug) => ({
      name,
      slug,
      featured: false,
      publishedAt: new Date(),
    }));

    // 5. Seed categories
    await seedCollection(strapi, 'api::category.category', CATEGORIES, (name, slug) => ({
      name,
      slug,
      publishedAt: new Date(),
    }));

    strapi.log.info('[bootstrap] SURXONCHA.UZ: roles, permissions va seed ma\'lumotlari tayyor.');
  },
};
