define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const scanToPayModel = function() {
    const Model = function() {
        this.payload = {
          userReferenceNo: null,
          purpose: "OTH",
          purposeText: null,
          amount: {
            currency: null,
            amount: null
          },
          debitAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          beneCode: null
        };
      },
      baseService = BaseService.getInstance();
    let makePaymentDeferred;
    const makePayment = function(deferred, payload) {
      const options = {
        headers: {
          "X-Validate-Only": "V"
        },
        url: "payments/transfers/qrCode",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let getTransferPurposeDeferred;
    const getTransferPurpose = function(deferred) {
      const options = {
        url: "purposes/linkages?taskCode=INTERNALFT",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      makePayment: function(payload) {
        makePaymentDeferred = $.Deferred();
        makePayment(makePaymentDeferred, payload);

        return makePaymentDeferred;
      },
      getTransferPurpose: function() {
        getTransferPurposeDeferred = $.Deferred();
        getTransferPurpose(getTransferPurposeDeferred);

        return getTransferPurposeDeferred;
      }
    };
  };

  return new scanToPayModel();
});