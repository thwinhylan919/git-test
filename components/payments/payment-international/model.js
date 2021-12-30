define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const InternationalPaymentModel = function() {
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let getCorrespondenceChargesDeferred;
    const getCorrespondenceCharges = function(deferred) {
      const options = {
        url: "enumerations/correspondanceChargeType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getTransferDataDeferred;
    const getTransferData = function(paymentId, param1, param2, date, deferred) {
        let url;

        if (date === "now") {
          url = "payments/{paymentType}/{transferType}/{paymentId}";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
        }

        const options = {
            url: url,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            paymentType: param1,
            transferType: param2,
            paymentId: paymentId
          };

        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getCorrespondenceCharges: function() {
        objectInitializedCheck();
        getCorrespondenceChargesDeferred = $.Deferred();
        getCorrespondenceCharges(getCorrespondenceChargesDeferred);

        return getCorrespondenceChargesDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        objectInitializedCheck();
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);

        return getTransferDataDeferred;
      },
      getCountries: function() {
        return baseService.fetch({
          url: "enumerations/country"
        });
      },
      getBankConfiguration: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      getNetworkTypes: function() {
        return baseService.fetch({
          url: "enumerations/networkType?REGION=INTERNATIONAL"
        });
      },
      getBankDetailsBIC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/bicCodeDetails/{BICCode}"
        },{
          BICCode: code
        });
      },
      getRemarks: function() {
        return baseService.fetch({
          url: "enumerations/senderToReceiverInfo"
        });
      },
      getBankDetailsNCC: function(code, region) {
        return baseService.fetch({
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
        },{
            nationalClearingCode: code,
            nationalClearingCodeType: region
          });
      }
    };
  };

  return new InternationalPaymentModel();
});