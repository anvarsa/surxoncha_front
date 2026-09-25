'use strict';

const { triggerRevalidate } = require('../../../../utils/trigger-revalidate');

module.exports = {
  async afterCreate(event) {
    await triggerRevalidate('region', event.result);
  },
  async afterUpdate(event) {
    await triggerRevalidate('region', event.result);
  },
  async afterDelete(event) {
    await triggerRevalidate('region', event.result);
  },
};
