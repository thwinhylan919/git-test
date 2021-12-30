define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MultipleBillPaymentsModel = function() {
    const Model = function() {
        this.autoPopulationData = {
          billerId: null,
          overviewDetails: null,
          showPaymentOverview: false,
          txnFailed: false,
          failureReason: null,
          payBillModel: {
            amount: {
              currency: null,
              amount: null
            },
            valueDate: null,
            userReferenceNo: "",
            remarks: "",
            purpose: "",
            debitAccountId: {
              displayValue: null,
              value: null
            },
            status: null,
            billerId: null,
            billNumber: null,
            billDate: null,
            consumerNumber: null,
            relationshipNumber: null
          }
        };
      },
      baseService = BaseService.getInstance();
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
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

    return {
      getNewModel: function() {
        return new Model();
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new MultipleBillPaymentsModel();
});