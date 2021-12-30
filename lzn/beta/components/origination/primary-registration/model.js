define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Primary Information Model. This file contains the model definition
   * for primary information section and exports the PrimaryInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Primary Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link PrimaryInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchSalutations()]{@link PrimaryInfoModel.fetchSalutations}</li>
   *              <li>[fetchMaritalStatus()]{@link PrimaryInfoModel.fetchMaritalStatus}</li>
   *              <li>[fetchGender()]{@link PrimaryInfoModel.fetchGender}</li>
   *              <li>[createApplicant()]{@link PrimaryInfoModel.createApplicant}</li>
   *              <li>[updateApplicant()]{@link PrimaryInfoModel.updateApplicant}</li>
   *              <li>[createApplicantContact()]{@link PrimaryInfoModel.createApplicantContact}</li>
   *              <li>[synchronizeRequests()]{@link PrimaryInfoModel.synchronizeRequests}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace PrimaryInfo~PrimaryInfoModel
   * @class PrimaryInfoModel
   * @property {Object} primaryInfo - Object containing the personal Info of the user
   * @property {string} primaryInfo.salutation - User's salutation
   * @property {string} primaryInfo.firstName - User's first name
   * @property {string} primaryInfo.lastName - User's last name
   * @property {string} primaryInfo.birthDate - User's birthdate
   * @property {string} primaryInfo.gender - User's gender
   * @property {string} primaryInfo.maritalStatus - User's marital status
   * @property {Integer} primaryInfo.noOfDependants - Number of dependants for user
   * @property {Array} contacts - Array to store user's contact details
   * @property {Object} contacts[0] - Object containing the contact Info of the user
   * @property {string} contacts[0].contactType - User's contact type
   * @property {string} contacts[0].email - User's email
   */
  return function PrimaryInfoModel() {
    /**
     * Let Model - description.
     *
     * @param  {type} model - Description.
     * @return {type}       Description.
     */
    const Model = function(model) {
      this.primaryInfo = {
        salutation: model && model.salutation ? model.salutation : "",
        firstName: model && model.firstName ? model.firstName : "",
        middleName: model && model.middleName ? model.middleName : null,
        lastName: model && model.lastName ? model.lastName : "",
        suffix: model && model.suffix ? model.suffix : "",
        birthDate: model && model.birthDate ? model.birthDate : "",
        citizenship: model && model.citizenship ? model.citizenship : "",
        otherSalutation: model && model.otherSalutation ? model.otherSalutation : "",
        permanentResidence: model && model.permanentResidence ? model.permanentResidence : true,
        residentCountry: model && model.residentCountry ? model.residentCountry : "",
        email: model && model.email ? model.email : ""
      };

      this.registrationInfo = {
        securityQuestion: null,
        securityAnswer: null
      };

      this.selectedValues = {
        salutation: "",
        citizenship: "",
        residentCountry: ""
      };

      this.isCompleting = true;
      this.adConsent = false;
      this.disableInputs = false;
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let submissionId,
      applicantId,
      fetchSalutationsDeferred;
    /**
     * Private method to fetch enumerations for listed salutations. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchSalutations
     * @memberOf PrimaryInfoModel
     * @private
     * @param  {Object} deferred - Description.
     * @return {void}          Description.
     */
    const fetchSalutations = function(deferred) {
      const options = {
        url: "enumerations/salutation?for=primary",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchOtherSalutationsDeferred;
    /**
     * Private method to fetch enumerations for listed marital statuses. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchEmailContacts
     * @memberOf PrimaryInfoModel
     * @private
     * @param {Object} deferred - Deferred Object.
     * @returns {void}
     */
    const fetchOtherSalutations = function(deferred) {
      const options = {
        url: "enumerations/salutation?for=others",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCountriesDeferred;
    /**
     * Private method to fetch enumerations for COUNTRIES. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchCountries
     * @memberOf PrimaryInfoModel
     * @private
     * @param {Object} deferred - Deferred Object.
     * @returns {void}
     */
    const fetchCountries = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchSuffixesDeferred;
    /**
     * Private method to fetch enumerations for Suffixes. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchSuffixes
     * @memberOf PrimaryInfoModel
     * @private
     * @param {Object} deferred - Deferred Object.
     * @returns {void}
     */
    const fetchSuffixes = function(deferred) {
      const options = {
        url: "enumerations/suffix",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchApplicantDeferred;
    /**
     * FetchpplicantList - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchpplicantList = function(submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchDocumentListDeferred;
    /**
     * FetchDocumentList - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchDocumentList = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/disclosures",
          selfLoader: true,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let createApplicantDeferred;
    /**
     * Private method to create an applicant based on passed model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function createApplicant
     * @memberOf PrimaryInfoModel
     * @private
     * @param  {type} model    - - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const createApplicant = function(model, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let updateApplicantDeferred;
    /**
     * UpdateApplicant - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const updateApplicant = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/personalInformation",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };
    let submitRequirementsDeferred;
    /**
     * SubmitRequirements - description.
     *
     * @param  {type} url          - - - - - - - - - - - - - - Description.
     * @param  {type} submissionId Description.
     * @param  {type} requirements Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const submitRequirements = function(url, submissionId, requirements, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: url,
          data: requirements,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let fireBatchDeferred;
    /**
     * FireBatch - description.
     *
     * @param  {type} batchData - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const fireBatch = function(batchData, deferred) {
        const options = {
          headers: {
            BATCH_ID: ((Math.random() * 1000000000000) + 1).toString()
          },
          url: "batch/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.batch(options, {}, batchData);
      },
      errors = {
        InitializationException: (function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }()),
        InvalidApplicantId: (function() {
          let message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }()),
        InvalidProfileId: (function() {
          let message = "";

          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }()),
        ObjectNotInitialized: (function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting/calling properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }())
      },
      /**
       * ObjectInitializedCheck - description.
       *
       * @return {type}  Description.
       */
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
       * @function init
       * @memberOf PrimaryInfoModel
       * @returns {Object} ModelInitialized Initialized model.
       */
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        modelInitialized = true;

        return modelInitialized;
      },
      /**
       * Method to get new instance of Primary Information model. This method is a static member
       * of PrimaryInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IncomeInfoModel.Model} (private to
       * this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {Object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf PrimaryInfoModel
       * @returns {Object} Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      getSalutations: function() {
        objectInitializedCheck();
        fetchSalutationsDeferred = $.Deferred();
        fetchSalutations(fetchSalutationsDeferred);

        return fetchSalutationsDeferred;
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOtherSalutations
       * @memberOf PrimaryInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      getOtherSalutations: function() {
        objectInitializedCheck();
        fetchOtherSalutationsDeferred = $.Deferred();
        fetchOtherSalutations(fetchOtherSalutationsDeferred);

        return fetchOtherSalutationsDeferred;
      },
      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function createApplicant
       * @memberOf PrimaryInfoModel
       * @param {Object} model - An object type data.
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      createApplicant: function(model) {
        objectInitializedCheck();
        createApplicantDeferred = $.Deferred();
        createApplicant(model, createApplicantDeferred);

        return createApplicantDeferred;
      },
      /**
       * UpdateApplicant - description.
       *
       * @param  {type} model - Description.
       * @return {type}       Description.
       */
      updateApplicant: function(model) {
        objectInitializedCheck();
        updateApplicantDeferred = $.Deferred();
        updateApplicant(model, updateApplicantDeferred);

        return updateApplicantDeferred;
      },
      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function createApplicant
       * @memberOf PrimaryInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      setApplicantId: function(applId) {
        applicantId = applId;
      },
      /**
       * FireBatch - description.
       *
       * @param  {type} batchData - Description.
       * @return {type}           Description.
       */
      fireBatch: function(batchData) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);

        return fireBatchDeferred;
      },
      /**
       * SubmitRequirements - description.
       *
       * @param  {type} url          - - - - - - - - - - - - - - - Description.
       * @param  {type} submissionId Description.
       * @param  {type} requirements Description.
       * @return {type}              Description.
       */
      submitRequirements: function(url, submissionId, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, submissionId, requirements, submitRequirementsDeferred);

        return submitRequirementsDeferred;
      },
      /**
       * FetchpplicantList - description.
       *
       * @param  {type} submissionId - Description.
       * @return {type}              Description.
       */
      fetchpplicantList: function(submissionId) {
        objectInitializedCheck();
        fetchApplicantDeferred = $.Deferred();
        fetchpplicantList(submissionId, fetchApplicantDeferred);

        return fetchApplicantDeferred;
      },
      /**
       * FetchDocumentList - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicantId  Description.
       * @return {type}              Description.
       */
      fetchDocumentList: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchDocumentListDeferred = $.Deferred();
        fetchDocumentList(submissionId, applicantId, fetchDocumentListDeferred);

        return fetchDocumentListDeferred;
      },
      /**
       * FetchCountries - description.
       *
       * @return {type}  Description.
       */
      fetchCountries: function() {
        objectInitializedCheck();
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);

        return fetchCountriesDeferred;
      },
      /**
       * FetchSuffixes - description.
       *
       * @return {type}  Description.
       */
      fetchSuffixes: function() {
        fetchSuffixesDeferred = $.Deferred();
        fetchSuffixes(fetchSuffixesDeferred);

        return fetchSuffixesDeferred;
      }
    };
  };
});