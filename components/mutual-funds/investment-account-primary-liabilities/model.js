define([
    "jquery",
    "baseService"
    ], function ($, BaseService) {
    "use strict";

    const Model = function () {
      const baseService = BaseService.getInstance();

      let liabilityTypeDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchLiabilityTypes
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchLiabilityTypes = function(deferred) {
        const options = {
          url: "enumerations/financialLiabilityType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      let repaymentFrequencyDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchRepaymentFrequency
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchRepaymentFrequency = function(deferred) {
        const options = {
          url: "enumerations/installmentRepaymentFrequency",
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
           * @function fetchLiabilityTypes
           * @memberOf ServiceRequestsSearchModel
           * @returns {Object} - DeferredObject.
           * @example
           *       OrderStatusModel.fetchLiabilityTypes().done(function(data) {
           *
           *       });
           */
          fetchLiabilityTypes: function() {
            liabilityTypeDeferred = $.Deferred();
            fetchLiabilityTypes(liabilityTypeDeferred);

            return liabilityTypeDeferred;
          },
          fetchRepaymentFrequency: function() {
            repaymentFrequencyDeferred = $.Deferred();
            fetchRepaymentFrequency(repaymentFrequencyDeferred);

            return repaymentFrequencyDeferred;
          }
        };
    };

    return new Model();
});
