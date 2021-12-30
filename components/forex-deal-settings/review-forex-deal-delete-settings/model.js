/** Model for review forex deal delete settings
 * @param {object} BaseService base service instance
 * @return {object} reviewForexDeleteSettingsModel
 */
define([
    "baseService"
], function(BaseService) {
  "use strict";

  const reviewForexDeleteSettingsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * Fetches the forex deal timer flag.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDealTimerFlag: function() {
        return baseService.fetch({
          url: "configurations/base/dayoneconfig/properties/FOREX_DEAL_TIMER"
        });
      }
    };
  };

  return new reviewForexDeleteSettingsModel();
});