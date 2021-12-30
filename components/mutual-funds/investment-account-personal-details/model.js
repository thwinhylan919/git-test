define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class OrderStatusModel
   */

  const OrderStatusModel = function() {

    const baseService = BaseService.getInstance();
    let identificationTypeDeferred;
    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchIdentificationType
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchIdentificationType = function(deferred) {
      const options = {
        url: "enumerations/identificationType",
        success: function(status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function(status, jqXhr) {
          deferred.reject(status, jqXhr);
        }
      };

      baseService.fetch(options);
    };

    let fetchGenderDeferred;
    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchGenderDeferred
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchGender = function(deferred) {
      const options = {
        url: "enumerations/gender",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchIdentificationType
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       OrderStatusModel.getIdentificationType().done(function(data) {
       *
       *       });
       */
      getIdentificationType: function() {
        identificationTypeDeferred = $.Deferred();
        fetchIdentificationType(identificationTypeDeferred);

        return identificationTypeDeferred;
      },
      fetchGender: function() {
        fetchGenderDeferred = $.Deferred();
        fetchGender(fetchGenderDeferred);

        return fetchGenderDeferred;
      }
    };
  };

  return new OrderStatusModel();
});
