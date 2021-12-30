/**
 * Model for view-network-preference.
 * @param {object} jquery jquery instance
 * @param {object} BaseService base service instance for server communication
 * @return {object} networkPreferenceModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const networkPreferenceModel = function() {
     const baseService = BaseService.getInstance();
      let setPriorityDeferred;
       /**
     * Set priority for network type.
        *
     * @function setPriority
     * @param {Object} payload  - An object containg the data to be sent to host.
     * @param {Object} deferred  - An object containg the data to be recieved from host.
     * @returns {void}
     * @memberOf networkPreferenceModel
     */
    const setPriority = function(payload, deferred) {
      const options = {
        url: "maintenances/payments/networkPreferences",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
      };

    return {
      /**
       * ReadNetworkType - fetch the networkType.
       *
       * @param {string} region - Region of logged in user.
       * @returns {Promise}  Returns the promise object.
       */
      readNetworkType: function(region) {
        return baseService.fetch({
          url: "enumerations/networkType?REGION={region}"
        },{
          region :region
        });
      },
      /**
       * FetchBankConfiguration - fetch the configuration details.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchBankConfiguration: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      /**
       * FetchPriority - fetch the priority of network types.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchPriority: function() {
        return baseService.fetch({
          url: "maintenances/payments/networkPreferences"
        });
      },
      /**
       * Public function to set priority for network types.
       *
       * @param {Object} payload - Payload to be passed set priority for network types.
       * @returns {Promise}  Returns the promise object.
       */
      setPriority: function(payload) {
        setPriorityDeferred = $.Deferred();
        setPriority(payload, setPriorityDeferred);

        return setPriorityDeferred;
      }
    };
  };

  return new networkPreferenceModel();
});