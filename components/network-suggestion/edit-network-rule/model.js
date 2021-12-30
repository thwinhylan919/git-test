/**
 * Model for edit-network-rule
 * @param {object} BaseService base service instance for server communication
 * @return {object} networkRuleModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const networkRuleModel = function() {
    const Model = function() {
        this.ydyf = {
          networkType :null,
          weightage:null
        };
      },
      baseService = BaseService.getInstance();
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
       * Method to get new modal instance.
       *
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function() {
        return new Model();
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
       * FetchProperty - fetch the property details for specific propertyid and
       * category id.
       *
       * @param {string} categoryId  - It is category id of property.
       * @param {string} propertyId - It is property id of property.
       * @returns {Promise}  Returns the promise object.
       */
      fetchProperty: function(categoryId, propertyId) {
        return baseService.fetch({
          url: "configurations/variable/{categoryId}/properties/?propertyId={propertyId}"
        },{
          categoryId :categoryId,
          propertyId :propertyId
        });
      }

    };
  };

  return new networkRuleModel();
});