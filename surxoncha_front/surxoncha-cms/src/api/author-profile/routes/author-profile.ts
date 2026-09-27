'use strict';

export {};

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::author-profile.author-profile');