define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains all the REST services APIs for the bank-look-up component.
   *
   * @class BankLookUpModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  const PartyValidateModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchDetailsDeferred;
    const fetchDetails = function(partyId, deferred,partyName) {
      const params = {
        partyId: partyId
      },
      options = {
        url: "parties?partyId=" + partyId+"&fullName="+partyName,
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options,params);
    };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetailsWithIndirectedValue
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchDetailsWithIndirectedValueDeferred;
    const fetchDetailsWithIndirectedValue = function(partyId, deferred) {
      const params = {
        partyId: partyId
      },
      options = {
        url: "parties/{partyId}?expand=addresses,contactPoints",
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    /**
     * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
     * @function fetchDetails
     *
     * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
     * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
     */
    let fetchDetailsByNameDeferred;
    const fetchDetailsByName = function(partyName, deferred) {
      const params = {
        partyName: partyName
      }, options = {
        url: "parties?fullName={partyName}",
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      fetchDetails: function(partyId,partyName) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(partyId, fetchDetailsDeferred, partyName);

        return fetchDetailsDeferred;
      },
      fetchDetailsWithIndirectedValue: function(partyId) {
        fetchDetailsWithIndirectedValueDeferred = $.Deferred();
        fetchDetailsWithIndirectedValue(partyId, fetchDetailsWithIndirectedValueDeferred);

        return fetchDetailsWithIndirectedValueDeferred;
      },
      fetchDetailsByName: function(partyName) {
        fetchDetailsByNameDeferred = $.Deferred();
        fetchDetailsByName(partyName, fetchDetailsByNameDeferred);

        return fetchDetailsByNameDeferred;
      }
    };
  };

  return new PartyValidateModel();
});
