define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const userFIMapModel = function() {
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
    let listAllFIDeferred;
    const listAllFI = function(deferred, partyId) {
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
    let fetchUserDetailsDeferred;
    const fetchUserDetails = function(deferred, userId) {
      const options = {
          url: "users/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userId: userId
        };

      baseService.fetch(options, params);
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
      listAllFI: function(partyId) {
        listAllFIDeferred = $.Deferred();
        listAllFI(listAllFIDeferred, partyId);

        return listAllFIDeferred;
      },
      fetchUserDetails: function(userId) {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred, userId);

        return fetchUserDetailsDeferred;
      }
    };
  };

  return new userFIMapModel();
});