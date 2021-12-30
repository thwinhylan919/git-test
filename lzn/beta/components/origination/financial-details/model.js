define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model to validate financial profile of the applicant.
   *
   * @returns {void}
   */
  return function FinancialDetailsModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required. Also, there may be a requirement to validate financial template
     * for multiple employment profiles.
     *
     * @class Model
     * @private
     * @memberOf FinancialDetailsModel
     */
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let submissionId, applicantId, productGroupSerialNo, finTemplateValidationDeferred;
    /**
     * Private method to validate financial profile of the applicant against the financial template provided by the host system based on the applicant's employment profile.
     *
     * @function validateFinTemplate
     * @memberOf FinancialDetailsModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const validateFinTemplate = function(deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/validateFinancials?productGroupSerialNo={productGroupSerialNo}&partyType={partyType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          productGroupSerialNo: productGroupSerialNo
        };

      baseService.fetch(options, params);
    };
    let finTemplateDeferred;
    /**
     * Method to fetch financial template to capture applicant financial profile.
     *
     * @param {Object} deferred - An object type Deferred.
     * @param {string} empType - Emp Type.
     * @returns {void}
     */
    const fetchFinancialTemplate = function(deferred, empType) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialParameter?employmentType={empType}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          empType: empType
        };

      baseService.fetch(options, params);
    };
    let fetchExistingOccupationsDeferred;
    /**
     * Private method to fetch occupation statuses available for loan application,
     * this method will only be called if applicant and profile ids are present,
     * and will resolve a passeddeferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchExistingOccupations
     * @memberOf OccupationInfoModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchExistingOccupations = function(deferred) {
        const options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          },
          params = {
            submissionId: submissionId,
            applicantId: applicantId
          };

        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }(),
        InvalidApplicantId: function() {
          let message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting/calling properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {string} subId - Submission id for current application.
       * @param {string} applId - Applicant id for current user.
       * @param {string} pgSNo - Employment pgS No for loan application.
       * @returns {Object} ModelInitialized.
       * @function init
       * @memberOf FinancialDetailsModel
       */
      init: function(subId, applId, pgSNo) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        productGroupSerialNo = pgSNo || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        modelInitialized = true;

        return modelInitialized;
      },
      /**
       * Fetches financial Template for the provided employment type.
       * SubmissionId and applicantId will be initialized with the model.
       * Response from this call will be saved for using in capturing financial profile for the applicant.
       *
       * @param {Object} empType - An object type emp.
       * @returns {Object} An object of type finTemplateDeferred.
       */
      fetchFinancialTemplate: function(empType) {
        objectInitializedCheck();
        finTemplateDeferred = $.Deferred();
        fetchFinancialTemplate(finTemplateDeferred, empType);

        return finTemplateDeferred;
      },
      /**
       * Public method to fetch existing occupations for current applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingOccupations
       * @memberOf OccupationInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      getExistingOccupations: function() {
        objectInitializedCheck();

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        fetchExistingOccupationsDeferred = $.Deferred();
        fetchExistingOccupations(fetchExistingOccupationsDeferred);

        return fetchExistingOccupationsDeferred;
      },
      /**
       * Public method to fetch enumeration data for occupation types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function validateFinTemplate
       * @memberOf FinancialDetailsModel
       * @returns {Object} DeferredObject.
       * @example
       * FinancialDetailsModel.validateFinTemplate().then(function (data) {
       *
       * });
       */
      validateFinTemplate: function() {
        objectInitializedCheck();
        finTemplateValidationDeferred = $.Deferred();
        validateFinTemplate(finTemplateValidationDeferred);

        return finTemplateValidationDeferred;
      }
    };
  };
});