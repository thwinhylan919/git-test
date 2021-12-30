/**
 * Model for view-network-rule
 * @param {object} BaseService base service instance for server communication
 * @return {object} networkRuleModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const networkRuleModel = function() {
    const baseService = BaseService.getInstance();
    let fireBatchDeferred;
    /**
     * Fetches property details for all properties.
     *
     * @function batchRead
     * @param {string} deferred  - An string containg the data to be recieved from host.
     * @param {string} batchRequest  - An string containg the data to be sent to host.
     * @param {string} type - It is a type of data passed.
     * @returns {Promise}  Returns the promise object.
     * @memberOf networkRuleModel
     */
    const batchRead = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };
    let updateNetworkRuleDeferred;
    /**
     * Update Network Rule.
     *
     * @function updateNetworkRule
     * @param {Object} payload  - An object containg the data to be sent to host.
     * @param {string} deferred  - An string containg the data to be recieved from host.
     * @returns {Promise}  Returns the promise object.
     * @memberOf networkRuleModel
     */
    const updateNetworkRule = function(payload, deferred) {
      const options = {
        url: "configurations/variable/NetworkType/properties",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };

    return {
      /**
       * BatchRead - fetch the property details for all properties.
       *
       * @param {Object} batchRequest  - It contains the data to be sent to host.
       * @param {string} type - It is a type of data passed.
       * @returns {Promise}  Returns the promise object.
       */
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      /**
       * FetchPropertyList - fetch the propertylist for networktype category id.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchPropertyList: function() {
        return baseService.fetch({
          url: "configurations/base/NetworkType/properties"
        });
      },
      /**
       * UpdateNetworkRule - Update the property details.
       *
       * @param {Object} payload  - An object containg the data to be sent to host.
       * @returns {Promise}  Returns the promise object.
       */
      updateNetworkRule: function(payload) {
        updateNetworkRuleDeferred = $.Deferred();
        updateNetworkRule(payload, updateNetworkRuleDeferred);

        return updateNetworkRuleDeferred;
      }
    };
  };

  return new networkRuleModel();
});