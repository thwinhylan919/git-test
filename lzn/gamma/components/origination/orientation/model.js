define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   * @return {Object}  Description.
   */
  return function OrientationModel() {
    /*
     * Extending BaseService
     */
    const baseService = BaseService.getInstance();
    /*
     * SubmissionId for fetching selected offer
     */
    let submissionId,
      /*
       * Boolean to track if the object has been initialized
       */
      modelInitialized = false,
      saveModelDeffered;
    /**
     * SaveModel - description.
     *
     * @param  {Object} model    - - - - - - - - - - - - - - - - Description.
     * @param  {Object} deferred Description.
     * @return {void}          Description.
     */
    const saveModel = function(model, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/cancellation",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.add(options, params);
    };
    let deleteSessionDeffered;
    /**
     * DeleteSession - description.
     *
     * @param  {Object} deferred - Description.
     * @return {void}          Description.
     */
    const deleteSession = function(deferred) {
        const options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.remove(options);
      },
      errors = {
        /**
         * InitializationException - description
         *
         * @return {String}  description
         */
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        /**
         * InvalidApplicantId - description
         *
         * @return {String}  description
         */
        InvalidApplicantId: function() {
          let message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        /**
         * ObjectNotInitialized - description
         *
         * @return {String}  description
         */
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      /**
       * ObjectInitializedCheck - description.
       *
       * @return {Object}  Description.
       */
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {string} subId - Submission id for current application.
       * @param {string} applId - Applicant id for current user.
       * @param {string} profId - Profile id for current user.
       * @return {type}       Description.
       * @function init
       * @memberOf AssetsInfoModel
       */
      init: function(subId) {
        submissionId = subId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        modelInitialized = true;

        return modelInitialized;
      },
      /**
       * SaveModel - Fetch offer selected for the product in the submissionId.
       *
       * @param  {Object} model - Description.
       * @return {Object}       Description.
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeffered = $.Deferred();
        saveModel(model, saveModelDeffered);

        return saveModelDeffered;
      },
      /**
       * DeleteSession - description.
       *
       * @return {Object}  Description.
       */
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);

        return deleteSessionDeffered;
      }
    };
  };
});