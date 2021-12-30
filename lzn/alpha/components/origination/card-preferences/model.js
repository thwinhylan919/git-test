define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   */
  const CardStructureSolutionModel = function() {
    const
      /*
       * Extending BaseService
       */
      baseService = BaseService.getInstance();
    /*
     * Deferred Object for get Component's List REST call
     */
    /*
     * SubmissionId for fetching selected offer
     */
    let submissionId,
      /*
       * productGroupSerialNumber for fetching selected offer
       */
      productGroupSerialNumber,
      /*
       * Boolean to track if the object has been initialized
       */
      modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.
       */
      /**
       * Deferred instance for fetching selected offer.
       */
      selectedOfferDeffered;
    const getSelectedOffer = function(deferred) {
        const params = {
            submissionId: submissionId,
            productGroupSerialNumber: productGroupSerialNumber
          },
          options = {
            url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
            success: function(data) {
              deferred.resolve(data);
            }
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
        InvalidPGSerialNumber: function() {
          let message = "";

          message += "\nNo ProductGroupSerialNumber found, please make sure ProductGroupSerialNumber is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ProductGroupSerialNumber\"]);";

          return message;
        }()
      };

    return {
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {string} subId - Submission id for current application.
       * @param {string} pgSerialNo - Product Group Serial Number.
       * @function init
       * @memberOf AssetsInfoModel
       * @returns {Object} ModelInitialized - Initialized model.
       */
      init: function(subId, pgSerialNo) {
        submissionId = subId || undefined;
        productGroupSerialNumber = pgSerialNo || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        if (!productGroupSerialNumber) {
          throw new Error(errors.InvalidPGSerialNumber);
        }

        modelInitialized = true;

        return modelInitialized;
      },
      /*
       * Fetch offer selected for the product in the submissionId.
       */
      getSelectedOffer: function() {
        selectedOfferDeffered = $.Deferred();
        getSelectedOffer(selectedOfferDeffered);

        return selectedOfferDeffered;
      }
    };
  };

  return new CardStructureSolutionModel();
});