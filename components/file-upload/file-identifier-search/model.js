define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const fiSearchModel = function() {
    const baseService = BaseService.getInstance();
    let getApprovalTypesDeferred;
    const getApprovalTypes = function(deferred) {
      const options = {
        url: "enumerations/approvalTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getTransactionTypesDeferred;
    const getTransactionTypes = function(deferred) {
      const options = {
        url: "enumerations/transactionTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listFileIdentifiersDeferred;
    const listFileIdentifiers = function(deferred, partyId) {
      const options = {
          url: "fileUploads/parties/{partyId}/fileIdentifiers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          partyId: partyId
        };

      baseService.fetch(options, params);
    };
    let fetchMeDeferred, fetchMeWithPartyDeferred;
    const fetchMe = function(deferred) {
        const options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {
        const options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

    return {
      getApprovalTypes: function() {
        getApprovalTypesDeferred = $.Deferred();
        getApprovalTypes(getApprovalTypesDeferred);

        return getApprovalTypesDeferred;
      },
      getTransactionTypes: function() {
        getTransactionTypesDeferred = $.Deferred();
        getTransactionTypes(getTransactionTypesDeferred);

        return getTransactionTypesDeferred;
      },
      listFileIdentifiers: function(partyId) {
        listFileIdentifiersDeferred = $.Deferred();
        listFileIdentifiers(listFileIdentifiersDeferred, partyId);

        return listFileIdentifiersDeferred;
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);

        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);

        return fetchMeWithPartyDeferred;
      }
    };
  };

  return new fiSearchModel();
});