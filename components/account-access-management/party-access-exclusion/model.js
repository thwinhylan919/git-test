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

    return {
      fetchPreferenceForParty: function (partyID) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyID, fetchPreferencePartyDeferrred);

        return fetchPreferencePartyDeferrred;
      },
      /**
       * This function reads the access
       * @function readAccess
       * @memberOf ExclusionModel
       **/
      readAccess: function (partyId, isCorpAdmin) {
        const params = {
            partyId: partyId
          },
          options = {
            url: isCorpAdmin ? "me/party/accountAccess" : "parties/{partyId}/preferences/accountAccess"
          };

        return baseService.fetch(options, params);
      },

      getNewModel: function () {
        return new Model();
      },
      /**
       * This function creates the access
       * {payload} - payload of service
       * @function createAccessClone
       * @memberOf ExclusionModel
       **/
      createAccessClone: function (payload, partyId, isCorpAdmin) {
        const params = {
            partyId: partyId
          },
          options = {
            url: isCorpAdmin ? "me/party/accountAccess" : "parties/{partyId}/preferences/accountAccess",
            data: payload
          };

        return baseService.add(options, params);

      },
      deleteAccess: function (payload, partyId) {
        const params = {
            partyId: partyId
          },
          options = {
            url: "parties/{partyId}/preferences/accountAccess",
            data: payload
          };

        return baseService.remove(options, params);
      },
      /**
       * This function updates the access
       * {payload} - payload of service
       * @function updateAccess
       * @memberOf ExclusionModel
       **/
      updateAccessClone: function (payload, partyId, isCorpAdmin) {
        const params = {
            partyId: partyId
          },
          options = {
            url: isCorpAdmin ? "me/party/accountAccess" : "parties/{partyId}/preferences/accountAccess",
            data: payload
          };

        return baseService.update(options, params);
      }
    };
  };

  return new ExclusionModel();
});