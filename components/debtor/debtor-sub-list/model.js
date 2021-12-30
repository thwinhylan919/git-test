define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const debtorSubListModel = function() {
    const Model = function() {
      this.debtorDetails = {
        accountName: null,
        accountNumber: "SEPA",
        bankName: null,
        bankAddress: "SEPA"
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
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
    let getPayerSubListDeferred;
    const getPayerSubList = function(gId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId
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
      getPayerSubList: function(gId) {
        objectInitializedCheck();
        getPayerSubListDeferred = $.Deferred();
        getPayerSubList(gId, getPayerSubListDeferred);

        return getPayerSubListDeferred;
      }
    };
  };

  return new debtorSubListModel();
});