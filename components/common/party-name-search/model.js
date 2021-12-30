define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SearchPartyNameModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Function to get new instance of SearchPartyNameModel
     *
     * @function
     * @memberOf SearchPartyNameModel
     * @returns Model
     */
    let
      /**
       * This function uses baseService's fetch to GET party details based on party id
       * @function fetchDetailsByName
       *
       * @param {String} partyId - String for which party name needs to be fetched
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsByNameDeferred;
    const fetchDetailsByName = function(partyName, deferred) {
      const options = {
        url: "parties?fullName=" + partyName,
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchDetailsByName: function(partyName) {
        fetchDetailsByNameDeferred = $.Deferred();
        fetchDetailsByName(partyName, fetchDetailsByNameDeferred);

        return fetchDetailsByNameDeferred;
      }
    };
  };

  return new SearchPartyNameModel();
});