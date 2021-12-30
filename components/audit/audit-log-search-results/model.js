define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AuditLogSearchResultsModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Function to get new instance of AuditLogSearchResultsModel
     *
     * @function
     * @memberOf AuditLogSearchResultsModel
     * @returns Model
     */
    let searchAuditItemDeferred;
    /**
     * Method to get the response of perticular audit based on Id.
     *
     * @function searchAuditItem
     * @param {string} ID - Of perticular audit.
     * @param {Object} deferred - Resolved for successful request.
     * @memberOf AuditLogSearchResultsModel
     * @private
     */
    const searchAuditItem = function(deferred, id) {
      const params = {
        id: id
      },
      options = {
        url: "audit/{id}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      /**
       * Public function to search Audit Details.
       *
       * @param {string} ID - Of perticular audit.
       * @returns {Promise}  Returns the promise object.
       */
      searchAuditItem: function(id) {
        searchAuditItemDeferred = $.Deferred();
        searchAuditItem(searchAuditItemDeferred, id);

        return searchAuditItemDeferred;
      }
    };
  };

  return new AuditLogSearchResultsModel();
});