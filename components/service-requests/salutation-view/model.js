define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SalutationModel = function() {
    const Model = function() {
        this.SRDefinitionDTO = {
          name: null,
          description: null,
          priorityType: null,
          moduleType: null,
          transactionType: null,
          requestType: null,
          categoryType: null,
          allowedStatuses: null,
          assignees: null,
          isActive: null,
          form: {
            header: null,
            confirmMessage: null,
            infoNote: {
              header: null,
              description: null
            },
            fields: [],
            subHeaders: [],
            sectionHeaders: []
          }
        };
      },
      baseService = BaseService.getInstance();
    let salutationDeferred;
    /**
     * Private method to fetch the salutation data
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function getSalutationData
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const getSalutationData = function(deferred) {
      const options = {
        url: "enumerations/salutation",
        success: function(status, jqXhr) {
          deferred.resolve(status, jqXhr);
        },
        error: function(status, jqXhr) {
          deferred.reject(status, jqXhr);
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
       * @function getSalutationData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       SalutationModel.getSalutationData().done(function(data) {
       *
       *       });
       */
      getSalutationData: function() {
        salutationDeferred = $.Deferred();
        getSalutationData(salutationDeferred);

        return salutationDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new SalutationModel();
});