define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Identity Information Model. This file contains the model definition
   * for identity information section and exports the IdentityInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Identity
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link IdentityInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link IdentityInfoModel.init}</li>
   *              <li>[getNewModel()]{@link IdentityInfoModel.getNewModel}</li>
   *              <li>[getExistingIdentity()]{@link IdentityInfoModel.getExistingIdentity}</li>
   *              <li>[getIdentificationTypeList()]{@link IdentityInfoModel.getIdentificationTypeList}</li>
   *              <li>[saveModel()]{@link IdentityInfoModel.saveModel}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace IdentityInfo~IdentityInfoModel
   * @class IdentityInfoModel
   * @property {string} type - type of document selected
   * @property {string} id - id number for document selected
   * @property {string} identificationId - record id for current record
   * @property {Object} issueDate - object to store issue date for document selected
   * @property {string} issuingAuthority - name of issuing authority for document selected
   * @property {string} countryOfIssue - country of issue for document selected
   * @property {string} placeOfIssue - place of issue for document selected
   * @property {Integer} status - number of dependants for user
   * @property {boolean} permanentResident - user is a permanent resident of selected country
   * @property {boolean} citizenship - citizenship of user
   * @property {boolean} selectedValues - co-applicant is self filling the form
   * @property {Object} dictionaryArray - additional data for services
   */
  return function IdentityInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @memberOf IdentityInfoModel
     * @param {Object} modelData - An object type deferred.
     * @private
     */
    const Model = function(modelData) {
      this.identificationDTOs = [{
        type: modelData ? modelData.type : "",
        id: modelData ? modelData.id : "",
        identificationId: modelData ? modelData.identificationId : "",
        issuingAuthority: "",
        countryOfIssue: "US",
        placeOfIssue: modelData ? modelData.placeOfIssue : "",
        status: "",
        permanentResident: false,
        citizenship: "",
        expiryDate: modelData ? modelData.expiryDate : ""
      }];

      this.selectedValues = {
        type: "",
        maskedssn: "",
        placeOfIssue: ""
      };

      this.disableInputs = false;
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let modelStateChanged = true,
      submissionId,
      applicantId,
      fetchIdentityDeferred;
    /**
     * Private method to fetch existing identity for the user, this method will
     * only be called if applicant id is present, and will resolve a passed
     * deferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchIdentity
     * @memberOf IdentityInfoModel
     * @param {Object} deferred - An object type deferred.
     * @returns {void} KoModel ~ KnockOut specific model.
     * @private
     */
    const fetchIdentity = function(deferred) {
      modelStateChanged = false;

      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/identifications",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        };

      baseService.fetch(options, params);
    };
    let fetchIdentificationListDeferred;
    /**
     * Private method to fetch supported doc list for identifications. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function fetchIdentificationList
     * @memberOf IdentityInfoModel
     * @param {Object} deferred - An object type deferred.
     * @returns {void}
     * @private
     */
    const fetchIdentificationList = function(deferred) {
      const options = {
        url: "enumerations/identificationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getStatesDeferred;
    /**
     * FetchStates - description.
     *
     * @param  {Object} country  - Country for application.
     * @param  {Object} deferred - An object type deferred.
     * @return {void}
     */
    const fetchStates = function(country, deferred) {
      const params = {
          country: country
        },
        options = {
          url: "enumerations/country/{country}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveModelDeferred;
    /**
     * Private method to save passed identification information model. Based
     * on the availability or non-availability of identificationId attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModel
     * @memberOf IdentityInfoModel
     * @param {Object} model - An object type model.
     * @param {Object} deferred - An object type deferred.
     * @returns {void}
     * @private
     */
    const saveModel = function(model, deferred) {
        modelStateChanged = true;

        const params = {
            submissionId: submissionId,
            applicantId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/identifications",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          },
          modelData = JSON.parse(model);

        if (modelData.identificationDTOs[0].identificationId) {
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
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
        InvalidApplicantId: (function() {
          let message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
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
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {string} subId - Submission id for current application.
       * @param {string} applId - Applicant id for current user.
       * @function init
       * @returns {Object} ModelInitialized ~ modelInitialized specific model.
       * @memberOf IdentityInfoModel
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
       * Method to get new instance of Identity Information model. This method is a static member
       * of IdentityInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IdentityInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {Object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf IdentityInfoModel
       * @returns {Object} Model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch existing identity for the user.This method will
       * only be called if applicant id is present, in case no applicant id is defined
       * an exception will be thrown notifying the developer of same. On calling the
       * method will instantiate a new deferred object and will return the same to the
       * callee function which will be resolved after call completion with appropriate
       * data and developer can use .then(handler) to handle the data.
       *
       * @function getExistingIdentity
       * @memberOf IdentityInfoModel
       * @returns {Object} DeferredObject.
       * @example
       *      IdentityInfoModel.getExistingIdentity().then(function (data) {
       *
       *      });
       */
      getExistingIdentity: function() {
        objectInitializedCheck();

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        if (modelStateChanged) {
          fetchIdentityDeferred = $.Deferred();
          fetchIdentity(fetchIdentityDeferred);
        }

        return fetchIdentityDeferred;
      },
      getStates: function(country) {
        objectInitializedCheck();
        getStatesDeferred = $.Deferred();
        fetchStates(country, getStatesDeferred);

        return getStatesDeferred;
      },
      /**
       * Public method to fetch supported docs list for identifications. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getIdentificationTypeList
       * @memberOf IdentityInfoModel
       * @returns {Object} DeferredObject.
       * @example
       *      IdentityInfoModel.getIdentificationTypeList().then(function (data) {
       *
       *      });
       */
      getIdentificationTypeList: function() {
        objectInitializedCheck();
        fetchIdentificationListDeferred = $.Deferred();
        fetchIdentificationList(fetchIdentificationListDeferred);

        return fetchIdentificationListDeferred;
      },
      /**
       * Public method to save passed in identification information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf IdentityInfoModel
       * @param {Object} model - An object type model.
       * @returns {Object} DeferredObject.
       * @example
       * IdentityInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);

        return saveModelDeferred;
      },
      /**
       * Public method to set Applicant Id after object has been initialized.
       *
       * @function setApplicantId
       * @memberOf IdentityInfoModel
       * @param {Object} applId - App Id for application.
       * @returns {Object} DeferredObject.
       * @example
       * IdentityInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      setApplicantId: function(applId) {
        objectInitializedCheck();
        applicantId = applId;

        return applicantId;
      }
    };
  };
});