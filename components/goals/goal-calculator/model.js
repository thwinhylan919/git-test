define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const goalCalculatorViewModel = function() {
    const Model = function() {
      this.goalCalculatorModel = {
        categoryId: null,
        subCategoryId: null,
        targetAmount: {
          currency: null,
          amount: null
        },
        contributionAmount: null,
        initialDepositAmount: {
          currency: null,
          amount: null
        },
        interestRate: null,
        tenure: {
          year: null,
          month: null,
          day: null,
          date: null
        },
        frequency: null,
        interestAmount: null
      };
    };
    let modelInitialized = true;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let calculateDeferred;
    const calculate = function(payload, deferred) {
        const options = {
          url: "goals/calculator",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.add(options);
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
      calculate: function(payload) {
        objectInitializedCheck();
        calculateDeferred = $.Deferred();
        calculate(payload, calculateDeferred);

        return calculateDeferred;
      }
    };
  };

  return new goalCalculatorViewModel();
});