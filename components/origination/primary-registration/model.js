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
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PrimaryInfoModel
     */
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
        lastName: model && model.lastName ? model.lastName : null,
        suffix: model && model.suffix ? model.suffix : null,
        birthDate: model && model.birthDate ? model.birthDate : "",
        gender: model && model.gender ? model.gender : "",
        maritalStatus: model && model.maritalStatus ? model.maritalStatus : "",
        noOfDependants: model && model.noOfDependants ? model.noOfDependants : "",
        citizenship: model && model.citizenship ? model.citizenship : "",
        otherSalutation: model && model.otherSalutation ? model.otherSalutation : "",
        permanentResidence: model && model.permanentResidence ? model.permanentResidence : null,
        email: model && model.email ? model.email : null
      };

      this.registrationInfo = {
        securityQuestion: "",
        securityAnswer: ""
      };

      this.isCompleting = true;
      this.adConsent = false;

      this.selectedValues = {
        salutation: "",
        gender: "",
        maritalStatus: "",
        citizenship: ""
      };

      this.disableInputs = false;
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId, fetchSalutationsDeferred;
    /**
     * Private method to fetch enumerations for listed salutations. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchSalutations
     * @memberOf PrimaryInfoModel
     * @private
     */
    /**
     * FetchSalutations - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
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
    let fetchMaritalStatusDeferred;
    /**
     * Private method to fetch enumerations for listed marital statuses. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchSalutations
     * @memberOf PrimaryInfoModel
     * @private
     */
    /**
     * FetchMaritalStatus - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchMaritalStatus = function(deferred) {
      const options = {
        url: "enumerations/maritalStatus",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchGenderOptionsDeferred;
    /**
     * Private method to fetch enumerations for listed marital statuses. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchSalutations
     * @memberOf PrimaryInfoModel
     * @private
     */
    /**
     * FetchGenderOptions - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchGenderOptions = function(deferred) {
      const options = {
        url: "enumerations/gender",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchSecurityQuestionsDeferred;
    /**
     * Private method to fetch enumerations for listed marital statuses. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchEmailContacts
     * @memberOf PrimaryInfoModel
     * @private
     */
    /**
     * FetchSecurityQuestions - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchSecurityQuestions = function(deferred) {
        const options = {
          url: "enumerations/securityQuestion",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      /**
       * Private method to fetch enumerations for listed marital statuses. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchEmailContacts
       * @memberOf PrimaryInfoModel
       * @private
       */
      /**
       * FetchOtherSalutations - description.
       *
       * @param  {type} deferred - Description.
       * @return {type}          Description.
       */
      fetchOtherSalutations = function(deferred) {
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
     */
    /**
     * FetchCountries - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
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
    let fetchApplicantDeferred;
    /**
     * FetchpplicantList - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchpplicantList = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
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
    let fetchPasswordPolicyDeferred;
    /**
     * FetchPasswordPolicy - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchPasswordPolicy = function(deferred) {
      const options = {
        url: "passwordPolicy",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let saveApplicantDeferred;
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
     */
    /**
     * SaveApplicant - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const saveApplicant = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/personalInformation",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        modelData = JSON.parse(model);

      if (modelData && modelData.applicantId && modelData.applicantId.length > 0) {
        options.url = "submissions/{submissionId}/applicants/{applicantId}/personalInformation";
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
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
    let submitSecurityQuestionDeferred;
    /**
     * Private method to save passed contact details for applicant. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function submitSecurityQuestion
     * @memberOf PrimaryInfoModel
     * @private
     */
    /**
     * SubmitSecurityQuestion - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const submitSecurityQuestion = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/securityQuestion",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.add(options, params);
    };
    let submitMarketingConsentDeferred;
    /**
     * Private method to save passed contact details for applicant. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function submitMarketingConsent
     * @memberOf PrimaryInfoModel
     * @private
     */
    /**
     * SubmitMarketingConsent - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const submitMarketingConsent = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/consent",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.add(options, params);
    };
    let fetchExistingMarketingConsentDeferred;
    /**
     * FetchExistingMarketingConsent - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchExistingMarketingConsent = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/consent",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let verifyEmailDeferred;
    /**
     * VerifyEmail - description.
     *
     * @param  {type} payload  - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const verifyEmail = function(payload, deferred) {
        const options = {
          url: "me/emailVerification/otp",
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
        /**
         * InitializationException - description
         *
         * @return {type}  description
         */
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }(),
        /**
         * InvalidApplicantId - description
         *
         * @return {type}  description
         */
        InvalidApplicantId: function() {
          let message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }(),
        /**
         * InvalidProfileId - description
         *
         * @return {type}  description
         */
        InvalidProfileId: function() {
          let message = "";

          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }(),
        /**
         * ObjectNotInitialized - description
         *
         * @return {type}  description
         */
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting/calling properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\", \"ApplicantId\", \"ProfileId\");";

          return message;
        }()
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
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @function init
       * @memberOf PrimaryInfoModel
       */
      /**
       * Init - description.
       *
       * @param  {type} subId  - - - - - - - - - - - - - - - - Description.
       * @param  {type} applId Description.
       * @return {type}        Description.
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
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf PrimaryInfoModel
       * @returns Model
       */
      /**
       * GetNewModel - description.
       *
       * @param  {type} modelData - Description.
       * @return {type}           Description.
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
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      /**
       * GetSalutations - description.
       *
       * @return {type}  Description.
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
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      /**
       * GetOtherSalutations - description.
       *
       * @return {type}  Description.
       */
      getOtherSalutations: function() {
        objectInitializedCheck();
        fetchOtherSalutations(fetchSalutationsDeferred);

        return fetchSalutationsDeferred;
      },
      /**
       * Public method to fetch enumeration for marital statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getMaritalStatus().then(function (data) {
       *
       * });
       */
      /**
       * GetMaritalStatus - description.
       *
       * @return {type}  Description.
       */
      getMaritalStatus: function() {
        objectInitializedCheck();
        fetchMaritalStatusDeferred = $.Deferred();
        fetchMaritalStatus(fetchMaritalStatusDeferred);

        return fetchMaritalStatusDeferred;
      },
      /**
       * Public method to fetch enumeration for gender options. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.getGenderEnum().then(function (data) {
       *
       * });
       */
      /**
       * GetGenderEnum - description.
       *
       * @return {type}  Description.
       */
      getGenderEnum: function() {
        objectInitializedCheck();
        fetchGenderOptionsDeferred = $.Deferred();
        fetchGenderOptions(fetchGenderOptionsDeferred);

        return fetchGenderOptionsDeferred;
      },
      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function createApplicant
       * @memberOf PrimaryInfoModel
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      /**
       * SaveApplicant - description.
       *
       * @param  {type} model - Description.
       * @return {type}       Description.
       */
      saveApplicant: function(model) {
        objectInitializedCheck();
        saveApplicantDeferred = $.Deferred();
        saveApplicant(model, saveApplicantDeferred);

        return saveApplicantDeferred;
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
       * @returns deferredObject
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      /**
       * GetSecurityQuestions - description.
       *
       * @return {type}  Description.
       */
      getSecurityQuestions: function() {
        objectInitializedCheck();
        fetchSecurityQuestionsDeferred = $.Deferred();
        fetchSecurityQuestions(fetchSecurityQuestionsDeferred);

        return fetchSecurityQuestionsDeferred;
      },
      /**
       * SubmitSecurityQuestion - description.
       *
       * @param  {type} data - Description.
       * @return {type}      Description.
       */
      submitSecurityQuestion: function(data) {
        objectInitializedCheck();
        submitSecurityQuestionDeferred = $.Deferred();
        submitSecurityQuestion(data, submitSecurityQuestionDeferred);

        return submitSecurityQuestionDeferred;
      },
      /**
       * SubmitMarketingConsent - description.
       *
       * @param  {type} data - Description.
       * @return {type}      Description.
       */
      submitMarketingConsent: function(data) {
        objectInitializedCheck();
        submitMarketingConsentDeferred = $.Deferred();

        $.when(this.createContact).done(function() {
          submitMarketingConsent(data, submitMarketingConsentDeferred);
        });

        return submitMarketingConsentDeferred;
      },
      /**
       * FetchExistingMarketingConsent - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicantId  Description.
       * @return {type}              Description.
       */
      fetchExistingMarketingConsent: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchExistingMarketingConsentDeferred = $.Deferred();

        $.when(this.createContact).done(function() {
          fetchExistingMarketingConsent(submissionId, applicantId, fetchExistingMarketingConsentDeferred);
        });

        return fetchExistingMarketingConsentDeferred;
      },
      /**
       * FetchPasswordPolicy - description.
       *
       * @return {type}  Description.
       */
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);

        return fetchPasswordPolicyDeferred;
      },
      /**
       * SetApplicantId - description.
       *
       * @param  {type} applId - Description.
       * @return {type}        Description.
       */
      setApplicantId: function(applId) {
        applicantId = applId;
      },
      /**
       * FetchpplicantList - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicantId  Description.
       * @return {type}              Description.
       */
      fetchpplicantList: function(submissionId, applicantId) {
        objectInitializedCheck();
        fetchApplicantDeferred = $.Deferred();
        fetchpplicantList(submissionId, applicantId, fetchApplicantDeferred);

        return fetchApplicantDeferred;
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
       * VerifyEmail - description.
       *
       * @param  {type} payload - Description.
       * @return {type}         Description.
       */
      verifyEmail: function(payload) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(payload, verifyEmailDeferred);

        return verifyEmailDeferred;
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
      }
    };
  };
});