define([
    "jquery",
    "baseService"
    ], function ($, BaseService) {
    "use strict";

    const Model = function () {
      const baseService = BaseService.getInstance();

      let relationshipTypeDeferred;
      /**
       * Private method to create a service request
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchRelationshipTypes
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      const fetchRelationshipTypes = function(deferred) {
        const options = {
          url: "enumerations/relationshipType",
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
           * @function fetchRelationshipTypes
           * @memberOf ServiceRequestsSearchModel
           * @returns {Object} - DeferredObject.
           * @example
           *       OrderStatusModel.fetchRelationshipTypes().done(function(data) {
           *
           *       });
           */
          fetchRelationshipTypes: function() {
            relationshipTypeDeferred = $.Deferred();
            fetchRelationshipTypes(relationshipTypeDeferred);

            return relationshipTypeDeferred;
          }
        };
    };

    return new Model();
});
