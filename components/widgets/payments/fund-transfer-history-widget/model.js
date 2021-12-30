define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Const Model - description.
   *
   * @return {type}  Description.
   */
  const Model = function() {
    const baseService = BaseService.getInstance();
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

    return {
      paymentsget: function() {
        const options = {
          url: "payments?maxRecords=3",
          mockedUrl:"framework/json/design-dashboard/payments/fund-transfer-history-widget/fund-transfer-history-widget.json",

          version: "v1"
        };

        return baseService.fetchWidget(options);
      },
      readPayee: function(gId, pId, type) {
        readPayeeDeferred = $.Deferred();
        readPayee(gId, pId, type, readPayeeDeferred);

        return readPayeeDeferred;
      },
      getPayeeMaintenance: function() {
        const options = {
          url: "maintenances/payments",
          mockedUrl:"framework/json/design-dashboard/payments/fund-transfer-history-widget/maintenances-payments.json"

        };

        return baseService.fetchWidget(options);
      },
      getPaymentDetails: function(paymentId, paymentType) {
        const options = {
          url: null

        };

        if (paymentType === "SELFFT") {
          options.url= "payments/transfers/self/{paymentId}";
        } else if (paymentType === "INTERNALFT") {
          options.url= "payments/transfers/internal/{paymentId}";
        } else if (paymentType === "INDIADOMESTICFT") {
          options.url= "payments/payouts/domestic/{paymentId}";
        } else if (paymentType === "DOMESTICDRAFT") {
          options.url= "payments/drafts/domestic/{paymentId}";
        } else if (paymentType === "PEER_TO_PEER") {
          options.url= "payments/transfers/peerToPeer/{paymentId}";
        }

        return baseService.fetch(options, {
          paymentId: paymentId
        });
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new Model();
});
