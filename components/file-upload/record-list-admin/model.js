define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const recordListAdminModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Method to get currency Types
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function getCurrencyTypes
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let getCurrencyTypesDeferred;
    const getCurrencyTypes = function(deferred) {
      const options = {
        url: "payments/currencies?type=PC_F_IT",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Method to get Record Status
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function getRecordStatus
     * @param {oject} deferred- resolved for successful request
     * @private
     */
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
    /**
     * Method to get Payment Types
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function getPaymentTypes
     * @param {oject} deferred- resolved for successful request
     * @private
     */
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
    /**
     * Method to get the list of records
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function listRecords
     * @param {object} deferred- resolved for successful request
     * @param {object} PARAMS - indicates the url
     * @private
     */
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
    /**
     * Method to get to download the receipt
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function downloadEReceipt
     * @param {oject} deferred- resolved for successful request
     * @param {string} fileRefId - the file reference ID
     * @param {string} recRefId - the record refernce ID
     * @private
     */
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
      }
    };
  };

  return new recordListAdminModel();
});