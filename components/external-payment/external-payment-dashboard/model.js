define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const ExternalPaymentModel = function () {
    const Model = function () {
      this.EPIModel = {
        transferDetails: {
          merchantCode: null,
          transactionAmount: {
            amount: null,
            currency: null
          },
          serviceCharges: {
            amount: null,
            currency: null
          },
          partyId: null,
          amount: {
            amount: null,
            currency: null
          },
          remarks: null,
          status: "INT",
          userReferenceNo: null,
          debitAccountId: {
            value: null
          }
        },
        epiRefid: null
      };

      this.EPIVerifyModel = {
        merchantCode: null,
        successStaticUrlFlag: null,
        failureStaticUrlFlag: null,
        dynamicSuccessUrl: null,
        dynamicFailureUrl: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      let logOutDeferred;
      const logOut = function (deferred) {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage("logout");
        }

          const options = {
            url: "session",
            success: function(data) {
              deferred.resolve(data);
            }
          };

          baseService.remove(options);
      };
    let readMerchantTransferDeferred;
    const readMerchantTransfer = function (refId, deferred) {
      const options = {
          url: "payments/transfers/merchantTransferData?epiRefId={epiRefId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          epiRefId: refId
        };

      baseService.fetch(options, params);
    };
    let readMerchantDeferred;
    const readMerchant = function (merchantCode, deferred) {
      const options = {
          url: "payments/merchants/{merchantCode}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          merchantCode: merchantCode
        };

      baseService.fetch(options, params);
    };
    let initiatePaymentDeferred;
    const initiatePayment = function (payload, deferred) {
      const options = {
        data: payload,
        url: "payments/transfers/external",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let verifyPaymentDeferred;
    const verifyPayment = function (payload, paymentId, deferred) {
      const options = {
          data: payload,
          url: "payments/transfers/external/{paymentId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            if (data.status !== 417) {
              deferred.reject(data);
            }
          }
        },
        params = {
          paymentId: paymentId
        };

      baseService.patch(options, params);
    };
    let redirectPageDeferred;
    const redirectPage = function (redirectURL, deferred) {
      const options = {
        url: redirectURL,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getDomesticCurrencyDeferred;
    const getDomesticCurrency = function (deferred) {
      const options = {
        url: "bankConfiguration",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let submitOTPDeferred;
    const submitOTP = function (payload, baseUrl, code, deferred) {
      const options = {
        url: baseUrl + "/authentication",
        headers: {
          TOKEN_ID: code
        },
        data: payload,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.update(options);
    };
    let resendOTPDeferred;
    const resendOTP = function (payload, baseUrl, deferred) {
      const options = {
        url: baseUrl,
        data: payload,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.patch(options);
    };

    return {
      init: function () {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      readMerchantTransfer: function (refId) {
        readMerchantTransferDeferred = $.Deferred();
        readMerchantTransfer(refId, readMerchantTransferDeferred);

        return readMerchantTransferDeferred;
      },
      readMerchant: function (merchantCode) {
        readMerchantDeferred = $.Deferred();
        readMerchant(merchantCode, readMerchantDeferred);

        return readMerchantDeferred;
      },
      initiatePayment: function (payload) {
        initiatePaymentDeferred = $.Deferred();
        initiatePayment(payload, initiatePaymentDeferred);

        return initiatePaymentDeferred;
      },
      verifyPayment: function (payload, paymentId) {
        verifyPaymentDeferred = $.Deferred();
        verifyPayment(payload, paymentId, verifyPaymentDeferred);

        return verifyPaymentDeferred;
      },
      redirectPage: function (redirectURL) {
        redirectPageDeferred = $.Deferred();
        redirectPage(redirectURL, redirectPageDeferred);

        return redirectPageDeferred;
      },
      getDomesticCurrency: function () {
        getDomesticCurrencyDeferred = $.Deferred();
        getDomesticCurrency(getDomesticCurrencyDeferred);

        return getDomesticCurrencyDeferred;
      },
      submitOTP: function (payload, baseUrl, code) {
        submitOTPDeferred = $.Deferred();
        submitOTP(payload, baseUrl, code, submitOTPDeferred);

        return submitOTPDeferred;
      },
      resendOTP: function (payload, baseUrl) {
        resendOTPDeferred = $.Deferred();
        resendOTP(payload, baseUrl, resendOTPDeferred);

        return resendOTPDeferred;
      },
      logOut: function () {
        logOutDeferred = $.Deferred();
        logOut(logOutDeferred);

        return logOutDeferred;
      }
    };
  };

  return new ExternalPaymentModel();
});