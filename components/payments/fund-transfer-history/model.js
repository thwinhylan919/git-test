define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const FundTransferHistorySearchModel = function() {
    const baseService = BaseService.getInstance();
    let getPayeeListDeferred;
    const getPayeeList = function(deferred) {
      const url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INDIADOMESTIC,DEMANDDRAFT,PEERTOPEER",
        options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fireBatchDeferred;
    const batchRead = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };
    let downloadDeferred;
    const download = function(deferred) {
      const options = {
        url: "payments?media=application/pdf",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.downloadFile(options);
    };
    let fetchAccountDataDeferred;
    const fetchAccountData = function(deferred) {
      const url = "accounts/demandDeposit",
        options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let readPayeeDeferred;
    const readPayee = function(gId, pId, type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        };

      baseService.fetch(options, params);
    };
    let fetchMediaTypeDeferred;
    const fetchMediaType = function(deferred) {
      const options = {
        url: "enumerations/mediatype",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listFundTransfersDeffered;
    const listFundTransfers = function(queryParameters, isDownload, deffered) {
      const
        parameters = {
          fromDate: queryParameters.fromDate,
          toDate: queryParameters.toDate,
          debitAccountId: queryParameters.debitAccountId,
          transferType: queryParameters.transferType,
          status: queryParameters.status,
          transactionReferenceNumber: queryParameters.transactionReferenceNumber,
          payeeName: queryParameters.payeeName
        },
        options = {
          url: "payments?fromDate={fromDate}&toDate={toDate}&sourceAccount={debitAccountId}&paymentType={transferType}&status={status}&transactionReferenceNumber={transactionReferenceNumber}&payeeName={payeeName}",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };

      if (isDownload) {
            options.url+= "&media=application/pdf";
        baseService.downloadFile(options, parameters);
      } else {
        baseService.fetch(options, parameters);
      }
    };
    let fetchTransferTypesDeferred;
    const fetchTransferTypes = function (deferred) {
      const options = {
        url: "enumerations/transferType/FTH",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchTransferStatusDeferred;
    const fetchTransferStatus = function (deferred) {
      const options = {
        url: "enumerations/transferStatus/FTH",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      listFundTransfers: function(queryParameters, isDownload) {
        listFundTransfersDeffered = $.Deferred();
        listFundTransfers(queryParameters, isDownload, listFundTransfersDeffered);

        return listFundTransfersDeffered;
      },
      downloadTransferHistory: function(queryParameters, isDownload) {
        listFundTransfers(queryParameters, isDownload,listFundTransfersDeffered);
      },
      getPaymentDetails: function(paymentId, paymentType) {
        const options = {
          url: null
        };

        if (paymentType === "SELFFT") {
          options.url = "payments/transfers/self/{paymentId}";
        } else if (paymentType === "INTERNALFT") {
          options.url = "payments/transfers/internal/{paymentId}";
        } else if (paymentType === "INDIADOMESTICFT") {
          options.url = "payments/payouts/domestic/{paymentId}";
        } else if (paymentType === "DOMESTICDRAFT") {
          options.url = "payments/drafts/domestic/{paymentId}";
        } else if (paymentType === "PEER_TO_PEER") {
          options.url = "payments/transfers/peerToPeer/{paymentId}";
        }

        return baseService.fetch(options, {
          paymentId: paymentId
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getPayeeList: function() {
        getPayeeListDeferred = $.Deferred();
        getPayeeList(getPayeeListDeferred);

        return getPayeeListDeferred;
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      download: function() {
        downloadDeferred = $.Deferred();
        download(downloadDeferred);

        return downloadDeferred;
      },
      readPayee: function(gId, pId, type) {
        readPayeeDeferred = $.Deferred();
        readPayee(gId, pId, type, readPayeeDeferred);

        return readPayeeDeferred;
      },
      fetchAccountData: function() {
        fetchAccountDataDeferred = $.Deferred();
        fetchAccountData(fetchAccountDataDeferred);

        return fetchAccountDataDeferred;
      },
      fetchTransferTypes: function () {
        fetchTransferTypesDeferred = $.Deferred();
        fetchTransferTypes(fetchTransferTypesDeferred);

        return fetchTransferTypesDeferred;
      },
      fetchTransferStatus: function () {
        fetchTransferStatusDeferred = $.Deferred();
        fetchTransferStatus(fetchTransferStatusDeferred);

        return fetchTransferStatusDeferred;
      },
      fetchMediaType: function() {
        fetchMediaTypeDeferred = $.Deferred();
        fetchMediaType(fetchMediaTypeDeferred);

        return fetchMediaTypeDeferred;
      }
    };
  };

  return new FundTransferHistorySearchModel();
});
