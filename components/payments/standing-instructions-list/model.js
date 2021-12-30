define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const standingInstructionModel = function() {
    const Model = function() {
      this.standingInstructionCancelModel = {
        instructionType: "REC"
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getTransferPurposeDeferred;
    const getPurpose = function(paymentType, deferred) {
        let url;

        if (paymentType === "INTERNALFT_SI") {
          url = "purposes/linkages?taskCode=PC_F_INTRNL";
        } else if (paymentType === "DOMESTICFT_SI" || paymentType === "INDIADOMESTICFT_SI" || paymentType === "UKDOMESTICFT_SI" || paymentType === "SEPADOMESTICFT_SI") {
          url = "purposes/linkages?taskCode=PC_F_DOM";
        }

        const options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
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
    },
      errors = {
        InitializationException: (function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()),
        ObjectNotInitialized: (function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }())
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    let getSIListDeferred;
    const getSIList = function(deferred) {
      const options = {
        url: "payments/instructions?status=ACTIVE&type=REC",
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
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getSIList: function() {
        objectInitializedCheck();
        getSIListDeferred = $.Deferred();
        getSIList(getSIListDeferred);

        return getSIListDeferred;
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
      getTransferPurpose: function(paymentType) {
        objectInitializedCheck();
        getTransferPurposeDeferred = $.Deferred();
        getPurpose(paymentType, getTransferPurposeDeferred);

        return getTransferPurposeDeferred;
      }
    };
  };

  return new standingInstructionModel();
});