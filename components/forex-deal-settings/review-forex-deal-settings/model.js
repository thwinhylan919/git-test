/** Model for review forex deals settings
 * @param {object} BaseService base service instance
 * @return {object} reviewForexDealSettingsModel
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * In case more than one instance of reviewForexDealSettingsModel is required,
   * we are declaring model as a function, of which new instances can be created and
   * used when required.
   *
   * @class reviewForexDealSettingsModel
   * @private
   */
  const reviewForexDealSettingsModel = function() {
    /**
     * In case more than one instance of reviewForexDealSettingsModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    const Model = function() {
        this.settingsModel = {
          forexDealMaintenanceList: []
        };
      },
      baseService = BaseService.getInstance();
    let confirmSettingsDeferred;
    /**
     * Adds or creates the forex deal settings in DB.
     *
     * @param {string} payload  - An string containg the data to be sent to host.
     * @param {string} deferred  - An string containg the data to be recieved from host.
     * @returns {Promise}  Returns the promise object.
     */
    const confirmSettings = function(payload, deferred) {
      const options = {
        url: "forexDeals/configurations",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };

    return {
      /**
       * Returns new Model instance.
       *
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function() {
        return new Model();
      },
      /**
       * Returns deferred.
       *
       * @param {string} payload  - A string containg the data to be sent to host.
       * @returns {Object}  Returns the modelData.
       */
      confirmSettings: function(payload) {
        confirmSettingsDeferred = $.Deferred();
        confirmSettings(payload, confirmSettingsDeferred);

        return confirmSettingsDeferred;
      },
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

  return new reviewForexDealSettingsModel();
});