define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const fuidViewModel = function() {
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
    let getFileTypesDeferred;
    const getFileTypes = function(deferred) {
      const options = {
        url: "enumerations/fileTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getAccountingTypesDeferred;
    const getAccountingTypes = function(deferred) {
      const options = {
        url: "enumerations/accountingTypes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getFileFormatTypesDeferred;
    const getFileFormatTypes = function(deferred) {
      const options = {
        url: "enumerations/formatTypes",
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
      getFileFormatTypes: function() {
        getFileFormatTypesDeferred = $.Deferred();
        getFileFormatTypes(getFileFormatTypesDeferred);

        return getFileFormatTypesDeferred;
      },
      getAccountingTypes: function() {
        getAccountingTypesDeferred = $.Deferred();
        getAccountingTypes(getAccountingTypesDeferred);

        return getAccountingTypesDeferred;
      },
      getTransactionTypes: function() {
        getTransactionTypesDeferred = $.Deferred();
        getTransactionTypes(getTransactionTypesDeferred);

        return getTransactionTypesDeferred;
      },
      getFileTypes: function() {
        getFileTypesDeferred = $.Deferred();
        getFileTypes(getFileTypesDeferred);

        return getFileTypesDeferred;
      }
    };
  };

  return new fuidViewModel();
});