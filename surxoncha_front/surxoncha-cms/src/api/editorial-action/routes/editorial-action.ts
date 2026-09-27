'use strict';

export {};

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::editorial-action.editorial-action');