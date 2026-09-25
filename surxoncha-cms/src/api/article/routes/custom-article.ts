// @ts-nocheck
'use strict';

export {};

/**
 * src/api/article/routes/custom-article.js
 * Editorial workflow uchun qo'shimcha marshrutlar.
 * Ruxsatlar: submit — muallif o'ziniki bo'lsa; qolganlari — editor/administrator
 * (users-permissions'dagi "Editor" roli, PERMISSIONS_BY_ROLE.editor orqali yoqilgan).
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/articles/:id/submit',
      handler: 'article.submit',
      config: { policies: ['global::is-owner-or-editor'] },
    },
    {
      method: 'POST',
      path: '/articles/:id/request-revision',
      handler: 'article.requestRevision',
      config: { policies: [] }, // role permission (editor-only) already gates via users-permissions
    },
    {
      method: 'POST',
      path: '/articles/:id/approve',
      handler: 'article.approve',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/reject',
      handler: 'article.reject',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/publish',
      handler: 'article.publish',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/articles/:id/view',
      handler: 'article.incrementView',
      config: { auth: false }, // public — anyone reading the article increments the count
    },
  ],
};
