'use strict';

const { triggerRevalidate } = require('../../../../utils/trigger-revalidate');

module.exports = {
  async afterUpdate(event) {
    await triggerRevalidate('site-setting', event.result);
  },
};
