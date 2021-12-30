define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ExclusionModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * In case more than one instance of model is required,
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       * @memberOf ExclusionModel~ExclusionModel
       */
      Model = function () {
        this.partyDetails = {
          partyId: null,
          userType: "",
          partyName: null,
          partyDetailsFetched: false,
          additionalDetails: "",
          partyFirstName: null,
          partyLastName: null
        };

        this.transactionMappingCasa = {
          accountNumber: "",
          selectedTasks: []
        };

        this.transactionMappingTD = {
          accountNumber: "",
          selectedTasks: []
        };

        this.transactionMappingLoan = {
          accountNumber: "",
          selectedTasks: []
        };
      };
    /**
     * This function gets customer preference for party id
     * @params {partyID} - partyID for preference needs to be fetched
     * @function fetchPreferenceForParty
     * @memberOf ExclusionModel
     **/
    let fetchPreferencePartyDeferrred;
    const fetchPreferenceForParty = function (partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "parties/{partyId}/preferences",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * This function creates the access
     * @params {deferred} - object to trach completion of Batch call
     * {payload} - payload of batch service
     * @function readAccess
     * @memberOf ExclusionModel
     **/
    let readAccessDeferred;
    const readAccess = function (partyId, relatePartyId, deferred) {
      const params = {
          partyId: partyId,
          relatePartyId: relatePartyId
        },
        options = {
          url: "parties/{partyId}/relations/accountAccess/{relatePartyId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchPreferenceForParty: function (partyID) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyID, fetchPreferencePartyDeferrred);

        return fetchPreferencePartyDeferrred;
      },
      readAccess: function (partyId, relatePartyId) {
        readAccessDeferred = $.Deferred();
        readAccess(partyId, relatePartyId, readAccessDeferred);

        return readAccessDeferred;
      },
      getNewModel: function () {
        return new Model();
      },
      /**
       * This function creates the access
       * @params {deferred} - object to track completion of post request
       * {payload} - payload of batch service
       * @function createAccessClone
       * @memberOf ExclusionModel
       **/
      createAccessClone: function (payload, partyId, linkedPartyId) {
        const params = {
            partyId: partyId,
            linkedPartyId: linkedPartyId
          },
          options = {
            url: "parties/{partyId}/relations/accountAccess/{linkedPartyId}",
            data: payload
          };

        return baseService.add(options, params);
      },
      /**
       * This function updates the access
       * @params {deferred} - object to track completion of put request
       * {payload} - payload of batch service
       * @function updateAccessClone
       * @memberOf ExclusionModel
       **/
      updateAccessClone: function (payload, partyId, relatePartyId) {
        const params = {
            partyId: partyId,
            relatePartyId: relatePartyId
          },
          options = {
            url: "parties/{partyId}/relations/accountAccess/{relatePartyId}",
            data: payload
          };

        return baseService.update(options, params);
      },
      deleteAccess: function (payload, partyId, relatePartyId) {
        const params = {
            partyId: partyId,
            relatePartyId: relatePartyId
          },
          options = {
            url: "parties/{partyId}/relations/accountAccess/{relatePartyId}",
            data: payload
          };

        return baseService.remove(options, params);
      }
    };
  };

  return new ExclusionModel();
});