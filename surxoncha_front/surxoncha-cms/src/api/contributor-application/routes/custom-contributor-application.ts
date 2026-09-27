// @ts-nocheck
'use strict';

export {};

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/contributor-applications/:id/approve',
      handler: 'contributor-application.approve',
      config: { policies: [] }, // "editor"/"moderator" role permission gates this (index.js bootstrap)
    },
    {
      method: 'POST',
      path: '/contributor-applications/:id/reject',
      handler: 'contributor-application.reject',
      config: { policies: [] },
    },
  ],
};
