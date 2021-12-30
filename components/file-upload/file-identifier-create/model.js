define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const fiRegistrationModel = function() {
    const Model = function() {
        this.partyFiRegistrationModel = {
          description: null,
          partyId: null,
          templateId: null,
          fileIdentifier: null,
          approvalType: null,
          partialProcessingTolerance: null,
          maxNoOfRecords: null,
          debitAccountNumber: null
        };
      },
      baseService = BaseService.getInstance();
    let listTemplatesDeferred;
    const listTemplates = function(deferred) {
      const options = {
        url: "fileUploads/templates?userType=CUSTOMER",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listAdminTemplatesDeferred;
    const listAdminTemplates = function(deferred) {
      const options = {
        url: "fileUploads/templates?userType=ADMIN",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listDebitAccountNumbersDeferred;
    const listDebitAccountNumbers = function(deferred, partyId) {
      const options = {
          url: "accountAccess?partyId={partyId}&accountType=CSA",
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
    let registerFiPaymentDeferred;
    const registerFiPayment = function(deferred, model, partyId) {
      const options = {
          url: "fileUploads/parties/{partyId}/fileIdentifiers",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          partyId: partyId
        };

      baseService.add(options, params);
    };

    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      listTemplates: function() {
        listTemplatesDeferred = $.Deferred();
        listTemplates(listTemplatesDeferred);

        return listTemplatesDeferred;
      },
      listAdminTemplates: function() {
        listAdminTemplatesDeferred = $.Deferred();
        listAdminTemplates(listAdminTemplatesDeferred);

        return listAdminTemplatesDeferred;
      },
      listDebitAccountNumbers: function(partyId) {
        listDebitAccountNumbersDeferred = $.Deferred();
        listDebitAccountNumbers(listDebitAccountNumbersDeferred, partyId);

        return listDebitAccountNumbersDeferred;
      },
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
      },
      registerFiPayment: function(model, partyId) {
        registerFiPaymentDeferred = $.Deferred();
        registerFiPayment(registerFiPaymentDeferred, model, partyId);

        return registerFiPaymentDeferred;
      }
    };
  };

  return new fiRegistrationModel();
});