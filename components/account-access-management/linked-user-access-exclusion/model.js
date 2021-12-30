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
     * This function fires batch of set of request
     * @params {deferred} - object to trach completion of Batch call
     * {batchData} - payload of batch service
     * @function fireBatch
     * @memberOf ExclusionModel
     **/
    let
      /**
       * This function gets list of associated users for party
       * @params {partyID} - partyID for preference needs to be fetched
       * @function fetchAssociatedUserForParty
       * @memberOf ExclusionModel
       **/
      fetchAssociatedUserForPartyDeferred;
    const fetchAssociatedUserForParty = function(partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "users?partyId={partyId}",
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
     * @function readAccess
     * @memberOf ExclusionModel
     **/
    let readAccessDeferred;
    const readAccess = function(userId, linkedPartyId, partyId, deferred) {
      const params = {
          userId: userId,
          linkedPartyId: linkedPartyId,
          partyId: partyId
        },
        options = {
          url: "users/{userId}/linkedAccountAccess?linkedPartyId={linkedPartyId}&partyId={partyId}",
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
     * @function updateAccess
     * @memberOf ExclusionModel
     **/
    let createAccessCloneDeferred;
    const createAccessClone = function(payload, userId, deferred) {
        const params = {
          userId: userId
        },
        options = {
        url: "users/{userId}/linkedAccountAccess",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options, params);
    };
    /**
     * This function updates the access
     * @params {deferred} - object to track completion of put request
     * {payload} - payload of batch service
     * @function updateAccess
     * @memberOf ExclusionModel
     **/
    let updateAccessCloneDeferred;
    const updateAccessClone = function(payload, userId, deferred) {
        const params = {
          userId: userId
        },
        options = {
        url: "users/{userId}/linkedAccountAccess",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options, params);
    };
    /**
     * This function updates the access
     * @params {deferred} - object to track completion of put request
     * {payload} - payload of batch service
     * @function updateAccess
     * @memberOf ExclusionModel
     **/
    let deleteAccessDeferred;
    const deleteAccess = function(payload, userId, deferred) {
        const params = {
          userId: userId
        },
        options = {
        url: "users/{userId}/linkedAccountAccess",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.remove(options, params);
    };

    return {
      fetchAssociatedUserForParty: function(batchData) {
        fetchAssociatedUserForPartyDeferred = $.Deferred();
        fetchAssociatedUserForParty(batchData, fetchAssociatedUserForPartyDeferred);

        return fetchAssociatedUserForPartyDeferred;
      },
      readAccess: function(userId, linkedPartyId, partyId) {
        readAccessDeferred = $.Deferred();
        readAccess(userId, linkedPartyId, partyId, readAccessDeferred);

        return readAccessDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      createAccessClone: function(payload, userId) {
        createAccessCloneDeferred = $.Deferred();
        createAccessClone(payload, userId, createAccessCloneDeferred);

        return createAccessCloneDeferred;
      },
      updateAccessClone: function(payload, userId) {
        updateAccessCloneDeferred = $.Deferred();
        updateAccessClone(payload, userId, updateAccessCloneDeferred);

        return updateAccessCloneDeferred;
      },
      deleteAccess: function(payload, userId) {
        deleteAccessDeferred = $.Deferred();
        deleteAccess(payload, userId, deleteAccessDeferred);

        return deleteAccessDeferred;
      }
    };
  };

  return new ExclusionModel();
});