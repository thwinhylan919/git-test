define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Ocucpation Information Model. This file contains the model definition
   * for occupation information section and exports the OccupationInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Occupation
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link OccupationInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchOccupationDetails()]{@link OccupationInfoModel.fetchOccupationDetails}</li>
   *              <li>[fetchOccupationType()]{@link OccupationInfoModel.fetchOccupationType}</li>
   *              <li>[fetchEmploymentStatus()]{@link OccupationInfoModel.fetchEmploymentStatus}</li>
   *              <li>[fetchCountryList()]{@link OccupationInfoModel.fetchCountryList}</li>
   *              <li>[addEmploymentDetails()]{@link OccupationInfoModel.addEmploymentDetails}</li>
   *              <li>[updateEmploymentDetails()]{@link OccupationInfoModel.updateEmploymentDetails}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace OccupationInfo~OccupationInfoModel
   * @class OccupationInfoModel
   * @property {string} title - occupation title
   * @property {string} type - occupation type
   * @property {string} status - current occupation status
   * @property {string} industry - industry
   * @property {string} occupation - occupation of user
   * @property {string} department - department of user
   * @property {string} designation - designation of user
   * @property {string} employeeId - employees id of user
   * @property {string} grossAnnualSalary - gross annual salary
   * @property {Object} startDate - start date of employment
   * @property {string} startDate.dateString - string containing start date of employment
   * @property {Object} endDate - end date of employment
   * @property {string} endDate.dateString - string containing end date of employment
   * @property {string} employerName - employer's name
   * @property {boolean} primary - current occupation is primary primary occupation
   * @property {boolean} isCompleting - co-applicant is self filling the form
   * @property {string} reference - reference
   * @property {Object} employerAddress - address of employer
   * @property {string} employerAddress.country - country of employer
   * @property {string} employerAddress.state - state in which employer operates
   * @property {string} employerAddress.city - city in which employer operates
   * @property {String} employerAddress.zipCode - zipcode in which employer operates
   * @property {String} employerAddress.line1 - address line 1
   * @property {String} employerAddress.line2 - address line 2
   */
  return function OccupationInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf OccupationInfoModel
     */
    const Model = function(modelData) {
      this.employmentDTOs = [{
        type: modelData ? modelData.type : "",
        status: modelData ? modelData.status : "",
        employerName: modelData ? modelData.employerName : "",
        startDate: modelData ? modelData.startDate : "",
        endDate: modelData ? modelData.endDate : "",
        primary: modelData ? modelData.primary : false,
        profileStatus: modelData ? modelData.profileStatus : "",
        temp_isActive: !modelData,
        temp_isStatusEligible: !modelData,
        temp_selectedValues: {
          type: "",
          status: ""
        },
        temp_startDateMonths: "",
        temp_startDateYears: "",
        temp_setProfileStatus: false
      }];
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let modelStateChanged = true,
      submissionId, applicantId, fetchOccupationStatusAndTypeDeferred;
    /**
     * Private method to fetch enumeration data for occupation type and its allowed status, this method will
     * only be called if applicant and profile ids are present, and will resolve a
     * passeddeferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchOccupationType
     * @memberOf OccupationInfoModel
     * @private
     */
    const fetchOccupationStatusAndType = function(deferred) {
      const options = {
        url: "employmentTypeAndStatus",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let finTemplateDeferred;
    /**
     * Method to fetch financial template to capture applicant financial profile.
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
      },
      validateEmployment = function(submissionId, applicantId, successHandler) {
        const params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/employments/validateEmployments",
            success: function(data) {
              successHandler(data);
            }
          };

        baseService.fetch(options, params);
      };
    let fetchOccupationTypeDeferred;
    /**
     * Private method to fetch enumeration data for occupation type, this method will
     * only be called if applicant and profile ids are present, and will resolve a
     * passeddeferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchOccupationType
     * @memberOf OccupationInfoModel
     * @private
     */
    const fetchOccupationType = function(deferred) {
      const options = {
        url: "enumerations/employmentType?applicantType=Individual",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchBankPolicyTemplateDeferred;
    const fetchBankPolicyTemplate = function(deferred) {
      const options = {
        url: "bankPolicyTemplates",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let checkEmploymentStartDateDeferred;
    const checkEmploymentStartDate = function(submissionId, applicantId, empStartDate, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId,
          empStartDate: empStartDate
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/validateEmploymentDate/{empStartDate}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchOccupationStatusDeferred;
    /**
     * Private method to fetch occupation statuses available for loan application,
     * this method will only be called if applicant and profile ids are present,
     * and will resolve a passeddeferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchOccupationStatus
     * @memberOf OccupationInfoModel
     * @private
     */
    const fetchOccupationStatus = function(deferred) {
      const options = {
        url: "enumerations/employmentStatus",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
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
     * @private
     */
    const fetchExistingOccupations = function(deferred) {
      modelStateChanged = false;

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
    };
    let fetchCountryListDeferred;
    /**
     * Private method to fetch occupation statuses available for loan application,
     * this method will only be called if applicant and profile ids are present,
     * and will resolve a passeddeferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchExistingOccupations
     * @memberOf OccupationInfoModel
     * @private
     */
    const fetchCountryList = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let saveModelDeferred;
    /**
     * Private method to save passed occupation information model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModel
     * @memberOf OccupationInfoModel
     * @private
     */
    const saveModel = function(model, deferred) {
      modelStateChanged = true;

      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/profiles",
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
    let deleteModelDeferred;
    /**
     * Private method to delete passed occupation information model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function deleteModel
     * @memberOf OccupationInfoModel
     * @private
     */
    const deleteModel = function(id, deferred) {
      modelStateChanged = true;

      const params = {
          submissionId: submissionId,
          applicantId: applicantId,
          id:id
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/{id}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.remove(options, params);
    };

    return {
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {string} subId - Submission id for current application.
       * @param {string} applId - Applicant id for current user.
       * @param {string} profId - Employment profile id for loan application.
       * @function init
       * @memberOf OccupationInfoModel
       */
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        modelInitialized = true;

        return modelInitialized;
      },
      /**
       * Method to get new instance of Income Information model. This method is a static member
       * of IncomeInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IncomeInfoModel.Model} (private to
       * this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {Object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf OccupationInfoModel
       * @returns Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch enumeration data for occupation types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationTypes
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * OccupationInfoModel.getOccupationTypes().then(function (data) {
       *
       * });
       */
      getOccupationTypes: function() {
        fetchOccupationTypeDeferred = $.Deferred();
        fetchOccupationType(fetchOccupationTypeDeferred);

        return fetchOccupationTypeDeferred;
      },
      fetchBankPolicyTemplate: function() {
        fetchBankPolicyTemplateDeferred = $.Deferred();
        fetchBankPolicyTemplate(fetchBankPolicyTemplateDeferred);

        return fetchBankPolicyTemplateDeferred;
      },
      checkEmploymentStartDate: function(submissionId, applicantId, empStartDate) {
        checkEmploymentStartDateDeferred = $.Deferred();
        checkEmploymentStartDate(submissionId, applicantId, empStartDate, checkEmploymentStartDateDeferred);

        return checkEmploymentStartDateDeferred;
      },
      /**
       * Public method to fetch enumeration data for occupation statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationStatus
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      fetchOccupationStatusAndType: function() {
        fetchOccupationStatusAndTypeDeferred = $.Deferred();
        fetchOccupationStatusAndType(fetchOccupationStatusAndTypeDeferred);

        return fetchOccupationStatusAndTypeDeferred;
      },
      /**
       * Public method to fetch enumeration data for occupation statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOccupationStatus
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      getOccupationStatus: function() {
        fetchOccupationStatusDeferred = $.Deferred();
        fetchOccupationStatus(fetchOccupationStatusDeferred);

        return fetchOccupationStatusDeferred;
      },
      /**
       * Public method to fetch existing occupations for current applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingOccupations
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * OccupationInfoModel.getOccupationStatus().then(function (data) {
       *
       * });
       */
      getExistingOccupations: function() {
        if (modelStateChanged) {
          fetchExistingOccupationsDeferred = $.Deferred();

          $.when(fetchOccupationTypeDeferred, fetchOccupationStatusDeferred).done(function() {
            fetchExistingOccupations(fetchExistingOccupationsDeferred);
          });
        }

        return fetchExistingOccupationsDeferred;
      },
      /**
       * Public method to fetch enumeration for list of countries. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getCountryList
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * OccupationInfoModel.getCountryList().then(function (data) {
       *
       * });
       */
      getCountryList: function() {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);

        return fetchCountryListDeferred;
      },
      /**
       * Public method to save passed in occupation information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * IncomeInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      saveModel: function(model) {
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);

        return saveModelDeferred;
      },
      /**
       * Fetches financial Template for the provided employment type.
       * SubmissionId and applicantId will be initialized with the model.
       * Response from this call will be saved for using in capturing financial profile for the applicant.
       */
      fetchFinancialTemplate: function(empType) {
        finTemplateDeferred = $.Deferred();
        fetchFinancialTemplate(finTemplateDeferred, empType);

        return finTemplateDeferred;
      },
      validateEmployment: function(submissionId, applicantId, successHandler) {
        validateEmployment(submissionId, applicantId, successHandler);
      },
      /**
       * Public method to delete passed in occupation information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf OccupationInfoModel
       * @returns DeferredObject.
       * @example
       * IncomeInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      deleteModel: function(liabilityId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(liabilityId, deleteModelDeferred);

        return deleteModelDeferred;
      },
      setApplicantId: function(applId) {
        applicantId = applId;
      }
    };
  };
});