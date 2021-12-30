define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const adminSearchModel = function() {
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
    let adminCreateDeferred;
    const adminCreate = function(deferred) {
      const options = {
        url: "fileUploads/parties/ADMIN/fileIdentifiers",
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
      adminCreate: function() {
        adminCreateDeferred = $.Deferred();
        adminCreate(adminCreateDeferred);

        return adminCreateDeferred;
      }
    };
  };

  return new adminSearchModel();
});