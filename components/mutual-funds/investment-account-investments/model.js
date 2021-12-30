define([
    "jquery",
    "baseService"
    ], function ($, BaseService) {
    "use strict";

    const Model = function () {
      const baseService = BaseService.getInstance();

      let investmentTypeDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchInvestmentTypes
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchInvestmentTypes = function(deferred) {
        const options = {
          url: "enumerations/investmentType",
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
           * @function fetchInvestmentTypes
           * @memberOf ServiceRequestsSearchModel
           * @returns {Object} - DeferredObject.
           * @example
           *       OrderStatusModel.fetchInvestmentTypes().done(function(data) {
           *
           *       });
           */
          fetchInvestmentTypes: function() {
            investmentTypeDeferred = $.Deferred();
            fetchInvestmentTypes(investmentTypeDeferred);

            return investmentTypeDeferred;
          }
        };
    };

    return new Model();
});
