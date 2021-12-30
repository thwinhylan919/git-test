define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reviewScheduledPaymentsInfoModel = function() {
    let
      modelInitialized = false;
    const baseService = BaseService.getInstance();
    let readCancelSIDeferred;
    const readCancelSI = function(id, deferred) {
      const options = {
          url: "payments/instructions?externalReferenceId={externalReferenceId}",
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

      baseService.fetch(options, params);
    };
    let getPurposeDescDeferred;
    const getPurposeDesc = function(deferred) {
        const options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
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

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      readCancelSI: function(refId) {
        objectInitializedCheck();
        readCancelSIDeferred = $.Deferred();
        readCancelSI(refId, readCancelSIDeferred);

        return readCancelSIDeferred;
      },
      getPurposeDesc: function() {
        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);

        return getPurposeDescDeferred;
      },
      getMaintenances: function() {
              return baseService.fetch({
                  url: "maintenances/payments"
              });
          },
      getGroupDetails: function(payeeGroupId) {
          return baseService.fetch({
              url: "payments/payeeGroup/" + payeeGroupId
          });
      },
      retrieveImage: function(id) {
          return baseService.fetch({
              url: "contents/{id}"
          }, {
              id: id
          });
      }
    };
  };

  return new reviewScheduledPaymentsInfoModel();
});