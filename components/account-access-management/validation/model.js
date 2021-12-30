define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ExclusionModel = function() {
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
        this.partyDetails = {
          party: {
            value: "",
            displayValue: ""
          },
          userType: "",
          partyName: null,
          partyDetailsFetched: false,
          additionalDetails: "",
          partyFirstName: null,
          partyLastName: null
        };
      };
    /**
     * This function fires batch of set of request
     * @params {deferred} - object to trach completion of Batch call
     * {batchData} - payload of batch service
     * @function fireBatch
     * @memberOf ExclusionModel
     **/
    let fireBatchDeferred;
    const fireBatch = function(batchData, deferred) {
      const options = {
        headers: {
          BATCH_ID: ((Math.random() * 1000000000000) + 1).toString()
        },
        url: "batch/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {}, batchData);
    };
    let fetchCorpAdminPartyDetailsDeferred;
    const fetchCorpAdminPartyDetails = function(deferred) {
      const options = {
        url: "me/party",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * This function gets list of associated users for party
     * @params {partyID} - partyID for preference needs to be fetched
     * @function fetchAssociatedUserForParty
     * @memberOf ExclusionModel
     **/
    let fetchAssociatedUserForPartyDeferred;
    const fetchAssociatedUserForParty = function(partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "users?partyId={partyId}&isAccessSetupCheckRequired=true",
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
     * This function creates the access
     * @params {deferred} - object to trach completion of Batch call
     * {payload} - payload of batch service
     * @function readUserAccountAccess
     * @memberOf ExclusionModel
     **/
    let readUserAccountAccessDeferred;
    const readUserAccountAccess = function(userId, partyId, deferred) {
      const params = {
          partyId: partyId,
          userId: userId
      },
      options = {
        url: "accountAccess?partyId={partyId}&userId={userId}",
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
      getNewModel: function() {
        return new Model();
      },
      fireBatch: function(batchData) {
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);

        return fireBatchDeferred;
      },
      fetchCorpAdminPartyDetails: function() {
        fetchCorpAdminPartyDetailsDeferred = $.Deferred();
        fetchCorpAdminPartyDetails(fetchCorpAdminPartyDetailsDeferred);

        return fetchCorpAdminPartyDetailsDeferred;
      },
      fetchAssociatedUserForParty: function(batchData) {
        fetchAssociatedUserForPartyDeferred = $.Deferred();
        fetchAssociatedUserForParty(batchData, fetchAssociatedUserForPartyDeferred);

        return fetchAssociatedUserForPartyDeferred;
      },
      readUserAccountAccess: function(userId, partyId) {
        readUserAccountAccessDeferred = $.Deferred();
        readUserAccountAccess(userId, partyId, readUserAccountAccessDeferred);

        return readUserAccountAccessDeferred;
      }
    };
  };

  return new ExclusionModel();
});