define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const cancelSIModel = function() {
    const Model = function() {
      this.cancelSIModel = {
        dictionaryArray: null,
        refLinks: null,
        instructionType: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let initiateCancelSIDeferred;
    const initiateCancelSI = function(id, payload, deferred) {
      const options = {
          url: "payments/instructions/cancellation/{externalReferenceId}",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          externalReferenceId: id
        };

      baseService.add(options, params);
    };
    let verifyCancelSIDeferred;
    const verifyCancelSI = function(id, deferred) {
      const options = {
          url: "payments/instructions/cancellation/{externalReferenceId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          externalReferenceId: id
        };

      baseService.patch(options, params);
    };
    /*If OTP required this function will fire from otp section*/
    let confirmCancelSIDeferred;
    const confirmCancelSI = function(id, uuid, deferred) {
        const options = {
            url: "payments/instructions/cancellation/{externalReferenceId}/authentication",
            headers: {
              TOKEN_ID: uuid
            },
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            externalReferenceId: id
          };

        baseService.update(options, params);
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
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      initiateCancelSI: function(refId, payload) {
        objectInitializedCheck();
        initiateCancelSIDeferred = $.Deferred();
        initiateCancelSI(refId, payload, initiateCancelSIDeferred);

        return initiateCancelSIDeferred;
      },
      verifyCancelSI: function(refId) {
        objectInitializedCheck();
        verifyCancelSIDeferred = $.Deferred();
        verifyCancelSI(refId, verifyCancelSIDeferred);

        return verifyCancelSIDeferred;
      },
      confirmCancelSI: function(refId, uuid) {
        objectInitializedCheck();
        confirmCancelSIDeferred = $.Deferred();
        confirmCancelSI(refId, uuid, confirmCancelSIDeferred);

        return confirmCancelSIDeferred;
      }
    };
  };

  return new cancelSIModel();
});