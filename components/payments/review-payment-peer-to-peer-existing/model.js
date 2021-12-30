define([
  "jquery",
    "baseService"
], function($,BaseService) {
  "use strict";

  const reviewP2PPaymentModel = function() {
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

    return {
      /**
       * ReadP2P -fetches p2p transfer details.
       *
       * @param {string} paymentId - Payment Id of p2p tranfer.
       * @returns {Promise}  Returns the promise object.
       */
      readP2P: function(paymentId) {
        return baseService.fetch({
          url: "payments/transfers/peerToPeer/{paymentId}"
        },{
          paymentId:paymentId
        });
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getPayeeDetails: function(payeeGroupId,payeeId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}/payees/peerToPeer/{payeeId}"
        },{
          payeeGroupId :payeeGroupId,
          payeeId:payeeId
        });
      }
    };
  };

  return new reviewP2PPaymentModel();
});
