define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const LinkageModel = function() {
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
      Model = function() {
        const party = {};

        party.value = "";
        party.displayValue = "";

        this.partyDetails = {
          partyId: "",
          userType: "",
          partyName: "",
          partyDetailsFetched: false,
          partyFirstName: "",
          partyLastName: "",
          additionalDetails: "",
          party: party
        };
      };
    /**
     * This function gets list of associated users for party
     * @params {partyID} - partyID for preference needs to be fetched
     * @function fetchLinkagesForParty
     * @memberOf ExclusionModel
     **/
    let fetchLinkagesForPartyDeferred;
    const fetchLinkagesForParty = function(partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "parties/{partyId}/relations",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    /**
     * This function gets customer preference for party id
     * @function fetchPreferenceForParty
     * @memberOf PreferenceFunctionsModel
     **/
    let fetchPreferencePartyDeferrred;
    const fetchPreferenceForParty = function(partyId, deferred) {
      const params = {
          partyId: partyId
        },
        options = {
          url: "parties/{partyId}/preferences",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchMeDeferred;
    const fetchMe = function(deferred) {
      const options = {
        url: "me",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchMeWithPartyNameDeferred;
    const fetchMeWithPartyName = function(deferred) {
      const options = {
        url: "me/party",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchLinkagesForPartyCorpDeferred;
    const fetchLinkagesForPartyCorp = function(deferred) {
      const options = {
        url: "me/party/relations",
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
      getNewModel: function() {
        return new Model();
      },
      fetchPreferenceForParty: function(partyId) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyId, fetchPreferencePartyDeferrred);

        return fetchPreferencePartyDeferrred;
      },
      init: function() {
        const modelInitialized = true;

        return modelInitialized;
      },
      fetchLinkagesForParty: function(batchData) {
        fetchLinkagesForPartyDeferred = $.Deferred();
        fetchLinkagesForParty(batchData, fetchLinkagesForPartyDeferred);

        return fetchLinkagesForPartyDeferred;
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);

        return fetchMeDeferred;
      },
      fetchMeWithPartyName: function() {
        fetchMeWithPartyNameDeferred = $.Deferred();
        fetchMeWithPartyName(fetchMeWithPartyNameDeferred);

        return fetchMeWithPartyNameDeferred;
      },
      fetchLinkagesForPartyCorp: function() {
        fetchLinkagesForPartyCorpDeferred = $.Deferred();
        fetchLinkagesForPartyCorp(fetchLinkagesForPartyCorpDeferred);

        return fetchLinkagesForPartyCorpDeferred;
      }
    };
  };

  return new LinkageModel();
});