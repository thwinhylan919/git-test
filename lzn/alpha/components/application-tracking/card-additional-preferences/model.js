define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Additional Information Model. This file contains the model definition
   * for additional information section and exports the AdditionalInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Additional
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchComponents()]{@link AdditionalInfoModel.fetchComponents}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace AdditionalInfo~AdditionalInfoModel
   * @class AdditionalInfoModel
   */
  const AdditionalInfoModel = function() {
    const baseService = BaseService.getInstance();
    let componentsListDeferred,
      submissionId,
      productGroupSerialNumber,
      applicationId;
    /**
     * Private method to fetch list of Components. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function fetchComponents
     * @memberOf AdditionalInfoModel
     * @private
     */
    const fetchComponents = function(deferred) {
      const options = {
        url: "app-tracker/cardpreferences",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchJSON(options);
    };
    /**
     * Deferred instance for fetching selected offer.
     */
    let selectedOfferDeffered;
    const fetchSelectedOfferDetails = function(offerId, deferred) {
      const params = {
          offerId: offerId
        },
        options = {
          url: "offers/{offerId}?productType=CC",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let readPreferencesDeffered;
    const readPreferences = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/primaryPreferences",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let readMembershipDetailsDeffered;
    const readMembershipDetails = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/membership",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let readAdditionalDetailsDeffered;
    const readAdditionalDetails = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/additionalDetails",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let readAddOnCardHolderDetailsDeffered;
    const readAddOnCardHolderDetails = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/addOnCardHolders",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let readBalanceTransferDetailsDeffered;
    const readBalanceTransferDetails = function(deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/balanceTransfer",
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
          message += "\n\n\tModelName.init(\"SubmissionId\", \"ProductGroupSerialNumber\", \"AppliactionId\");";

          return message;
        }(),
        InvalidPGSerialNumber: function() {
          let message = "";

          message += "\nNo ProductGroupSerialNumber found, please make sure ProductGroupSerialNumber is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubmissionId\", \"ProductGroupSerialNumber\", \"AppliactionId\");";

          return message;
        }(),
        InvalidApplicationId: function() {
          let message = "";

          message += "\nNo ApplicationId found, please make sure ApplicationId is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubmissionId\", \"ProductGroupSerialNumber\", \"AppliactionId\");";

          return message;
        }()
      };

    return {
      /**
       * Public method to fetch list of Components. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .done(handler) to handle the data.
       *
       * @function fetchComponents
       * @memberOf AdditionalInfoModel
       * @returns DeferredObject.
       * @example
       *      AdditionalInfoModel.fetchComponents().done(function (data) {
       *
       *      });
       */
      fetchComponents: function() {
        componentsListDeferred = $.Deferred();
        fetchComponents(componentsListDeferred);

        return componentsListDeferred;
      },
      fetchSelectedOfferDetails: function(offerId) {
        selectedOfferDeffered = $.Deferred();
        fetchSelectedOfferDetails(offerId, selectedOfferDeffered);

        return selectedOfferDeffered;
      },
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {string} subId - Submission id for current application.
       * @param {string} applId - Applicant id for current user.
       * @param {string} profId - Profile id for current user.
       * @function init
       * @memberOf AssetsInfoModel
       */
      init: function(subId, pgSerialNo, appId) {
        submissionId = subId || undefined;
        productGroupSerialNumber = pgSerialNo || undefined;
        applicationId = appId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        if (!productGroupSerialNumber) {
          throw new Error(errors.InvalidPGSerialNumber);
        }

        if (!applicationId) {
          throw new Error(errors.InvalidApplicationId);
        }
      },
      readPreferences: function() {
        readPreferencesDeffered = $.Deferred();
        readPreferences(readPreferencesDeffered);

        return readPreferencesDeffered;
      },
      readMembershipDetails: function() {
        readMembershipDetailsDeffered = $.Deferred();
        readMembershipDetails(readMembershipDetailsDeffered);

        return readMembershipDetailsDeffered;
      },
      readBalanceTransferDetails: function() {
        readBalanceTransferDetailsDeffered = $.Deferred();
        readBalanceTransferDetails(readBalanceTransferDetailsDeffered);

        return readBalanceTransferDetailsDeffered;
      },
      readAdditionalDetails: function() {
        readAdditionalDetailsDeffered = $.Deferred();
        readAdditionalDetails(readAdditionalDetailsDeffered);

        return readAdditionalDetailsDeffered;
      },
      readAddOnCardHolderDetails: function() {
        readAddOnCardHolderDetailsDeffered = $.Deferred();
        readAddOnCardHolderDetails(readAddOnCardHolderDetailsDeffered);

        return readAddOnCardHolderDetailsDeffered;
      }
    };
  };

  return new AdditionalInfoModel();
});
