define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ChequeStatusInquiryModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * This function fires a fetch request to get the cheque status
     * @function getChequeSatus
     * @memberOf ChequeStatusInquiryModel
     * @param {accountId} - unique accountID of user
     * @param {selectedStatusValue}
     * @param {startChequeNumber}
     * @param {endChequeNumber}
     * @param {fromDate}
     * @param {toDate}
     * @param {deferred} - resolved after successful execution or rejected after failure
     **/
    let getChequeSatusDeferred, getStatusEnumDeffered;
    const getChequeSatus = function(accountId, selectedStatusValue, startChequeNumber, endChequeNumber, fromDate, toDate, deferred) {
        const options = {
          url: "accounts/demandDeposit/{accountId}/issuedCheques?status={status}&startChequeNo={startChequeNo}&endChequeNo={endChequeNo}&fromDate={fromDate}&toDate={toDate}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, {
          accountId: accountId,
          status: selectedStatusValue,
          startChequeNo: startChequeNumber,
          endChequeNo: endChequeNumber,
          fromDate: fromDate,
          toDate: toDate
        });
      },
      /**
       * This function fires a fetch request to get the different status.
       *
       * @function getStatusEnum
       * @memberOf ChequeStatusInquiryModel
       * @param {deferred} - - Resolved after successful execution or rejected after failure.
       **/
      getStatusEnum = function(deffered) {
        const options = {
          url: "enumerations/chequeStatus",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };

        baseService.fetch(options);
      };

    return {
      getChequeSatus: function(accountId, selectedStatusValue, startChequeNumber, endChequeNumber, fromDate, toDate) {
        getChequeSatusDeferred = $.Deferred();
        getChequeSatus(accountId, selectedStatusValue, startChequeNumber, endChequeNumber, fromDate, toDate, getChequeSatusDeferred);

        return getChequeSatusDeferred;
      },
      getStatusEnum: function() {
        getStatusEnumDeffered = $.Deferred();
        getStatusEnum(getStatusEnumDeffered);

        return getStatusEnumDeffered;
      }
    };
  };

  return new ChequeStatusInquiryModel();
});