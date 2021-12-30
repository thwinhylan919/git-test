/**
 * Model for edit-network-preference.
 * @param {object} BaseService base service instance for server communication
 * @return {object} networkPreferenceModel Modal instance
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const networkPreferenceModel = function() {
    const Model = function() {
        this.networkPriorityModel = {
          networkType :null,
          priority:null
        };
      },
      baseService = BaseService.getInstance();

    return {
      /**
       * Method to get new modal instance.
       *
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function() {
        return new Model();
      },
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
      }
    };
  };

  return new networkPreferenceModel();
});