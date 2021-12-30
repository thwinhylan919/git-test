define([
  "baseService"
], function (BaseService) {
  "use strict";

  const userFIMapModel = function () {
    const baseService = BaseService.getInstance();

    return {
      getRecords: function (fileRefId, pageSize, pageNumber, fromAmount, toAmount, currency, valueDateStart, valueDateEnd, recordStatus, beneName, creditAccount, debitAccount, transactionType, payeeType, accountType) {
        const params = {
            fileRefId: fileRefId,
            pageSize: pageSize,
            pageNumber: pageNumber,
            fromAmount: fromAmount,
            toAmount: toAmount,
            currency: currency,
            valueDateStart: valueDateStart,
            valueDateEnd: valueDateEnd,
            recordStatus: recordStatus,
            beneName: beneName,
            creditAccount: creditAccount,
            debitAccount: debitAccount,
            transactionType: transactionType,
            payeeType: payeeType,
            accountType: accountType
          },
          options = {
            url: "/fileUploads/files/{fileRefId}/records?pageSize={pageSize}&pageNumber={pageNumber}&fromAmount={fromAmount}&toAmount={toAmount}&currency={currency}&valueDateStart={valueDateStart}&valueDateEnd={valueDateEnd}&recordStatus={recordStatus}&beneName={beneName}&creditAccount={creditAccount}&debitAccount={debitAccount}&transactionType={transactionType}&payeeType={payeeType}&accountType={accountType}",
            version: "v1"
          };

        return baseService.fetch(options, params);
      },
      readRecord: function (fileRefId, recordRefId) {
        const params = {
            fileRefId: fileRefId,
            recordRefId: recordRefId
          },
          options = {
            url: "/fileUploads/files/{fileRefId}/records/{recordRefId}",
            version: "v1"
          };

        return baseService.fetch(options, params);
      },
      getRecordStatus: function () {
        const params = {},
          options = {
            url: "enumerations/recordStatuses",
            version: "v1"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new userFIMapModel();
});