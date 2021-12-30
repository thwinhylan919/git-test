define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const DomesticMoneyTransferModel = function() {
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let getTransferPurposeDeferred;
    const getPurpose = function(deferred) {
      const options = {
        url: "purposes/linkages?taskCode=PC_F_DOM",
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
    };
    let getPayeeDataDeferred;
    const getPayeeData = function(payeeId, groupId, payeeType, deferred) {
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
            groupId: groupId,
            payeeType: payeeType,
            payeeId: payeeId
          };

        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
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
      getTransferPurpose: function() {
        objectInitializedCheck();
        getTransferPurposeDeferred = $.Deferred();
        getPurpose(getTransferPurposeDeferred);

        return getTransferPurposeDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        objectInitializedCheck();
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);

        return getTransferDataDeferred;
      },
      getPayeeData: function(payeeId, groupId, payeeType) {
        objectInitializedCheck();
        getPayeeDataDeferred = $.Deferred();
        getPayeeData(payeeId, groupId, payeeType, getPayeeDataDeferred);

        return getPayeeDataDeferred;
      }
    };
  };

  return new DomesticMoneyTransferModel();
});