define([
    "jquery",
    "baseService"
    ], function ($, BaseService) {
    "use strict";

    const Model = function () {
      const baseService = BaseService.getInstance();

      let assetTypeDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchAssetTypes
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchAssetTypes = function(deferred) {
        const options = {
          url: "enumerations/financialAsset",
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
           * @function fetchAssetTypes
           * @memberOf ServiceRequestsSearchModel
           * @returns {Object} - DeferredObject.
           * @example
           *       OrderStatusModel.fetchAssetTypes().done(function(data) {
           *
           *       });
           */
          fetchAssetTypes: function() {
            assetTypeDeferred = $.Deferred();
            fetchAssetTypes(assetTypeDeferred);

            return assetTypeDeferred;
          }
        };
    };

    return new Model();
});
