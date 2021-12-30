define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TransactionDetailModel = function() {
    const Model = function() {
        return {
          workflowDetails: {
            name: null,
            description: null,
            workFlowId: null,
            steps: [{
              sequenceNo: "1",
              paneldto: {
                panelId: null
              }
            }, {
              sequenceNo: "2",
              paneldto: {
                panelId: null
              }
            }]
          },
          approvals: {
            partyId: null,
            userType: null,
            partyName: null
          }
        };
      },
      baseService = BaseService.getInstance();
    let readTransactionDeferred;
    const readTransaction = function(transactionId, deferred) {
      const options = {
        url: "transactions/" + transactionId + "?expand=HISTORY",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let transactionApproveDeferred;
    const approve = function(remarks, searchURL, transactionApproveDeferred) {
      const options = {
        url: searchURL,
        data: remarks,
        contentType: "text/plain",
        success: function(data, status, jqXHR) {
          transactionApproveDeferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let transactionRejectDeferred;
    const reject = function(remarks, searchURL, transactionRejectDeferred) {
      const options = {
        url: searchURL,
        data: remarks,
        contentType: "text/plain",
        success: function(data, status, jqXHR) {
          transactionRejectDeferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let transactionmodificationRequestDeferred;
    const modificationRequest = function(remarks, searchURL, transactionmodificationRequestDeferred) {
      const options = {
        url: searchURL,
        data: remarks,
        contentType: "text/plain",
        success: function(data, status, jqXHR) {
          transactionmodificationRequestDeferred.resolve(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let downloadEreceiptDeferred;
    const downloadEreceipt = function(transactionId, deferred) {
      const params = {
          transactionId: transactionId
        },
        options = {
          url: "transactions/{transactionId}?media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);
    };

    return {
      readTransaction: function(transactionId) {
        readTransactionDeferred = $.Deferred();
        readTransaction(transactionId, readTransactionDeferred);

        return readTransactionDeferred;
      },
      downloadEreceipt: function(transactionId) {
        downloadEreceiptDeferred = $.Deferred();
        downloadEreceipt(transactionId, downloadEreceiptDeferred);

        return downloadEreceiptDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      approve: function(remarks, searchURL) {
        transactionApproveDeferred = $.Deferred();
        approve(remarks, searchURL, transactionApproveDeferred);

        return transactionApproveDeferred;
      },
      reject: function(remarks, searchURL) {
        transactionRejectDeferred = $.Deferred();
        reject(remarks, searchURL, transactionRejectDeferred);

        return transactionRejectDeferred;
      },
      modificationRequest: function(remarks, searchURL) {
        transactionmodificationRequestDeferred = $.Deferred();
        modificationRequest(remarks, searchURL, transactionmodificationRequestDeferred);

        return transactionmodificationRequestDeferred;
      }
    };
  };

  return new TransactionDetailModel();
});