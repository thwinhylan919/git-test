define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ExternalPaymentModel = function() {
    const Model = function() {
      this.epiVerificationModel = {
        externalReferenceId: null,
        txnAmount: {
          amount: null
        }
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let initiatePaymentDeferred;
    const initiatePayment = function(payload, deferred) {
      const options = {
        data: payload,
        url: "payments/transfers/external/verification",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let readPaymentDeferred;
    const readPayment = function(verificationId, deferred) {
      const options = {
          url: "payments/transfers/external/verification/{verifyId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          verifyId: verificationId
        };

      baseService.fetch(options, params);
    };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      initiatePayment: function(payload) {
        initiatePaymentDeferred = $.Deferred();
        initiatePayment(payload, initiatePaymentDeferred);

        return initiatePaymentDeferred;
      },
      readPayment: function(verificationId) {
        readPaymentDeferred = $.Deferred();
        readPayment(verificationId, readPaymentDeferred);

        return readPaymentDeferred;
      }
    };
  };

  return new ExternalPaymentModel();
});