define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for Card pay.
   *
   * @namespace
   * @class
   */
  const CardPayModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    let confirmPaymentDeferred;
    const confirmPayment = function(paymentId, deferred) {
      params = {
        paymentId: paymentId
      };

      const options = {
        url: "payments/transfers/creditCard/{paymentId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.patch(options, params);
    };
    let confirmPaymentWithAuthDeferred;
    const confirmPaymentWithAuth = function(paymentId, authKey, deferred) {
      params = {
        paymentId: paymentId
      };

      const options = {
        url: "payments/transfers/creditCard/{paymentId}/authentication",
        headers: {
          TOKEN_ID: authKey
        },
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.update(options, params);
    };
    let listAccessPointDeferred;
    const listAccessPoint = function (deferred) {
      const options = {
        url: "accessPoints",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      paybill: function(model) {
        const options = {
          url: "payments/transfers/creditCard",
          data: model
        };

        return baseService.add(options);
      },
      confirmPayment: function(paymentId) {
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, confirmPaymentDeferred);

        return confirmPaymentDeferred;
      },
      listAccessPoint: function () {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);

        return listAccessPointDeferred;
      },
      confirmPaymentWithAuth: function(paymentId, authKey) {
        confirmPaymentWithAuthDeferred = $.Deferred();
        confirmPaymentWithAuth(paymentId, authKey, confirmPaymentWithAuthDeferred);

        return confirmPaymentWithAuthDeferred;
      }
    };
  };

  return new CardPayModel();
});
