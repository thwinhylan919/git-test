define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const billPaymentsModel = function() {
    const baseService = BaseService.getInstance();
    let getBillPaymentDetailsDeferred;
    const getBillPaymentDetails = function(paymentId, deferred) {
      const options = {
        url: "payments/transfers/bill/{paymentId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          paymentId: paymentId
        };

      baseService.fetch(options, params);
    };
    let getBillerDetailsDeferred;
    const getBillerDetails = function(billerId, deferred) {
      const options = {
        url: "payments/billers/{billerId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          billerId: billerId
        };

      baseService.fetch(options, params);
    };
    let confirmPaymentDeferred;
    const confirmPayment = function(paymentId, transactionId, deferred) {
      const options = {
        url: "payments/transfers/bill/{paymentId}",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      },
        params = {
          paymentId: paymentId
        };

      if (transactionId) {
        options.headers = {};
        options.headers.TRANSACTION_REFERENCE_NO = transactionId;
      }

      baseService.patch(options, params);
    };

    return {
      getBillPaymentDetails: function(paymentId) {
        getBillPaymentDetailsDeferred = $.Deferred();
        getBillPaymentDetails(paymentId, getBillPaymentDetailsDeferred);

        return getBillPaymentDetailsDeferred;
      },
      getBillerDetails: function(billerId) {
        getBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, getBillerDetailsDeferred);

        return getBillerDetailsDeferred;
      },
      confirmPayment: function(paymentId, transactionId) {
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, transactionId, confirmPaymentDeferred);

        return confirmPaymentDeferred;
      }
    };
  };

  return new billPaymentsModel();
});