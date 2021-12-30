define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const recordListFinancialModel = function() {
    const baseService = BaseService.getInstance();
    let getCurrencyTypesDeferred;
    const getCurrencyTypes = function(deferred) {
      const options = {
        url: "payments/currencies?type=FU_UP",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getRecordStatusDeferred;
    const getRecordStatus = function(deferred) {
      const options = {
        url: "enumerations/recordStatuses",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getPaymentTypesDeferred;
    const getPaymentTypes = function(deferred) {
      const options = {
        url: "enumerations/transactionTypes?financial=Y",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listRecordsDeferred;
    const listRecords = function(deferred, PARAMS) {
      const options = {
        url: PARAMS,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let downloadEReceiptDeferred;
    const downloadEReceipt = function(deferred, fileRefId, recRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}/records/{recRefId}?media={media}&mediaFormat={mediaFormat}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId,
          recRefId: recRefId,
          media: "application/pdf",
          mediaFormat: "pdf"
        };

      baseService.downloadFile(options, params);
    };
    let deleteRecordsDeferred;
    const deleteRecords = function(deferred, fileRefId, recordRefId) {
      const options = {
          url: "fileUploads/files/{fileRefId}/records/{recordRefId}",
          success: function(result, status, xhr) {
            deferred.resolve(result, status, xhr);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          fileRefId: fileRefId,
          recordRefId: recordRefId
        };

      baseService.remove(options, params);
    };

    return {
      getCurrencyTypes: function() {
        getCurrencyTypesDeferred = $.Deferred();
        getCurrencyTypes(getCurrencyTypesDeferred);

        return getCurrencyTypesDeferred;
      },
      listRecords: function(PARAMS) {
        listRecordsDeferred = $.Deferred();
        listRecords(listRecordsDeferred, PARAMS);

        return listRecordsDeferred;
      },
      getRecordStatus: function() {
        getRecordStatusDeferred = $.Deferred();
        getRecordStatus(getRecordStatusDeferred);

        return getRecordStatusDeferred;
      },
      getPaymentTypes: function() {
        getPaymentTypesDeferred = $.Deferred();
        getPaymentTypes(getPaymentTypesDeferred);

        return getPaymentTypesDeferred;
      },
      downloadEReceipt: function(fileRefId, recRefId) {
        downloadEReceiptDeferred = $.Deferred();
        downloadEReceipt(downloadEReceiptDeferred, fileRefId, recRefId);

        return downloadEReceiptDeferred;
      },
      deleteRecords: function(fileRefId, recordRefId) {
        deleteRecordsDeferred = $.Deferred();
        deleteRecords(deleteRecordsDeferred, fileRefId, recordRefId);

        return deleteRecordsDeferred;
      }
    };
  };

  return new recordListFinancialModel();
});