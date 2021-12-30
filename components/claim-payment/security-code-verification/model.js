define([
  "jquery",
  "baseService"

], function ($, BaseService) {
  "use strict";

  const SecuritycodeModel = function () {
    const Model = function () {
      this.securitycodeVerificationModel = {
        securityCode: "",
        aliasType: "",
        aliasValue: "",
        paymentId: "",
        transferAmount: {
          currency: null,
          amount: null
        }
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let verifySecurityCodeDeferred;
    const verifySecurityCode = function (payload, deferred, determinantValue,isDynamicUrl) {
        const options = {
          url: "payments/transfers/peerToPeer/receiverValidation",
          data: payload,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

        if(isDynamicUrl){
          options.headers = {};
          options.headers["X-Target-Unit"] = determinantValue;
        }

        baseService.update(options);
      },
      errors = {
        InitializationException: function () {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function () {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function () {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function () {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      verifySecurityCode: function (payload, determinantValue,isDynamicUrl) {
        objectInitializedCheck();
        verifySecurityCodeDeferred = $.Deferred();
        verifySecurityCode(payload, verifySecurityCodeDeferred, determinantValue,isDynamicUrl);

        return verifySecurityCodeDeferred;
      },
      fetchPaymentDetails: function (paymentId, determinantValue) {
        const options = {
          url: "payments/transfers/peerToPeer/{paymentId}/verification"
        },
        params = {
          paymentId: paymentId
        };

        options.headers = {};
        options.headers["X-Target-Unit"] = determinantValue;
        options.showMessage = false;

        return baseService.fetch(options, params);
      }
    };
  };

  return new SecuritycodeModel();
});