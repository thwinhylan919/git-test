define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Income Information section. This file contains the model definition
   * for income information section and exports the IncomeInfoModel which can be injected
   * in any framework and developer will by default get a self aware model for Income Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link IncomeInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchIncomes()]{@link IncomeInfoModel.fetchIncomes}</li>
   *              <li>[fetchIncomeOptions()]{@link IncomeInfoModel.fetchIncomeOptions}</li>
   *              <li>[fetchFrequencyList()]{@link IncomeInfoModel.fetchFrequencyList}</li>
   *              <li>[submitIncomeData()]{@link IncomeInfoModel.submitIncomeData}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace IncomeInfo~IncomeInfoModel
   * @class IncomeInfoModel
   * @property {string} type - income type
   * @property {Object} gross - object to store gross income of applicant
   * @property {Integer} gross.amount - gross income amount
   * @property {string} gross.currency - income currency
   * @property {Object} net - object to store net income of applicant
   * @property {Integer} net.amount - net income amount
   * @property {string} net.currency - income currency
   * @property {string} frequency - income frequency
   * @property {Integer} incomeShare - income share
   * @property {Object} dictionaryArray - additional data for services
   */
  return function IncomeInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @memberOf IncomeInfoModel
     * @private
     */
    /**
     * Let Model - description.
     *
     * @param  {type} modelData - Description.
     * @return {type}           Description.
     */
    const Model = function(modelData) {
        this.type = modelData ? modelData.type : "";
        this.frequency = modelData ? modelData.frequency : "";

        this.grossAmount = {
          amount: modelData ? modelData.grossAmount.amount : "",
          currency: modelData ? modelData.grossAmount.currency : ""
        };

        this.netAmount = {
          amount: modelData ? modelData.netAmount.amount : "",
          currency: modelData ? modelData.netAmount.currency : ""
        };

        this.ownershipPercentage = modelData ? modelData.ownershipPercentage : 100;
        this.temp_isActive = !modelData;

        this.temp_selectedValues = {
          type: "",
          frequency: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId, profileId, fetchExistingIncomesDeferred;
    /**
     * Private method to fetch existing liabilities for the user, this method will
     * only be called if applicant and profile ids are present, and will resolve a
     * passeddeferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchExistingIncomes
     * @memberOf IncomeInfoModel
     * @private
     */
    /**
     * FetchExistingIncomes - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchExistingIncomes = function(deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/incomes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          profileId: profileId
        };

      baseService.fetch(options, params);
    };
    let fetchIncomeOptionsDeferred;
    /**
     * Private method to fetch supported type of income options in loan application. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchIncomeOptions
     * @memberOf IncomeInfoModel
     * @private
     */
    /**
     * FetchIncomeOptions - description.
     *
     * @param  {type} productSubClass - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred        Description.
     * @return {type}                 Description.
     */
    const fetchIncomeOptions = function(productSubClass, deferred) {
      const options = {
          url: "financialIncomeTypes",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          productSubClass: productSubClass
        };

      baseService.fetch(options, params);
    };
    let fetchCurrencyMasterListDeferred;
    /**
     * fetchCurrencyMasterList - description
     *
     * @param  {type} deferred        description
     * @return {type}                 description
     */
    const fetchCurrencyMasterList = function (deferred) {
      const options = {
        url: "enumerations/currencies",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchFrequencyDeferred;
    /**
     * Private method to fetch income frequency options supported in loan application. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchFrequencyOptions
     * @memberOf IncomeInfoModel
     * @private
     */
    /**
     * FetchFrequencyOptions - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchFrequencyOptions = function(deferred) {
      const options = {
        url: "enumerations/originationFinancialFrequency?for=income",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let saveModelDeferred;
    /**
     * Private method to save passed liabilities information model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModel
     * @memberOf IncomeInfoModel
     * @private
     */
    /**
     * SaveModel - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const saveModel = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/incomes",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        modelData = JSON.parse(model);

      if (modelData.incomeDetailsDTO.id && modelData.incomeDetailsDTO.id.length > 0) {
        options.url = "submissions/{submissionId}/applicants/{applicantId}/financialProfile/incomes/" + modelData.incomeDetailsDTO.id;
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
    };
    let fetchEmploymentsDeferred;
    /**
     * FetchEmployments - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchEmployments = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          throttle: false,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveEmploymentsDeferred;
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
    /**
     * SaveEmployments - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const saveEmployments = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/profileId",
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
     * Private method to delete passed liabilities information model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function deleteModel
     * @memberOf IncomeInfoModel
     * @private
     */
    /**
     * DeleteModel - description.
     *
     * @param  {type} id       - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const deleteModel = function(id, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId,
          profileId: profileId,
          incomeId: id
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/incomes/{incomeId}?profileId={profileId}",
          data: "",
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
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @function init
       * @memberOf IncomeInfoModel
       */
      /**
       * Init - description.
       *
       * @param  {type} subId  - - - - - - - - - - - - - - - Description.
       * @param  {type} applId Description.
       * @param  {type} profId Description.
       * @return {type}        Description.
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;

        return modelInitialized;
      },
      /**
       * Method to get new instance of Income Information model. This method is a static member
       * of IncomeInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IncomeInfoModel.Model} (private to
       * this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf IncomeInfoModel
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
       * Public method to fetch existing incomes against current profile id for current applicant.
       * This method will instantiate a new deferred object and will return the same to the callee
       * function which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchExistingIncomes
       * @memberOf IncomeInfoModel
       * @returns deferredObject
       * @example
       * IncomeInfoModel.fetchExistingIncomes().then(function (data) {
       *
       * });
       */
      /**
       * FetchExistingIncomes - description.
       *
       * @return {type}  Description.
       */
      fetchExistingIncomes: function() {
        fetchExistingIncomesDeferred = $.Deferred();
        fetchExistingIncomes(fetchExistingIncomesDeferred);

        return fetchExistingIncomesDeferred;
      },
      /**
       * FetchEmployments - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicantId  Description.
       * @return {type}              Description.
       */
      fetchEmployments: function(submissionId, applicantId) {
        fetchEmploymentsDeferred = $.Deferred();
        fetchEmployments(submissionId, applicantId, fetchEmploymentsDeferred);

        return fetchEmploymentsDeferred;
      },
      /**
       * SaveEmployments - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicantId  Description.
       * @return {type}              Description.
       */
      saveEmployments: function(submissionId, applicantId) {
        saveEmploymentsDeferred = $.Deferred();
        saveEmployments(submissionId, applicantId, saveEmploymentsDeferred);

        return saveEmploymentsDeferred;
      },
      /**
       * Public method to fetch supported income list for loan application. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchIncomeOptions
       * @memberOf IncomeInfoModel
       * @returns deferredObject
       * @example
       * IncomeInfoModel.fetchIncomeOptions().then(function (data) {
       *
       * });
       */
      /**
       * FetchIncomeOptions - description.
       *
       * @param  {type} productSubClass - Description.
       * @return {type}                 Description.
       */
      fetchIncomeOptions: function(productSubClass) {
        fetchIncomeOptionsDeferred = $.Deferred();
        fetchIncomeOptions(productSubClass, fetchIncomeOptionsDeferred);

        return fetchIncomeOptionsDeferred;
      },
      /**
       * fetchCurrencyMasterList - description
       *
       * @return {type}  description
       */
      fetchCurrencyMasterList: function () {
        fetchCurrencyMasterListDeferred = $.Deferred();
        fetchCurrencyMasterList(fetchCurrencyMasterListDeferred);

        return fetchCurrencyMasterListDeferred;
      },
      /**
       * Public method to fetch income frequency's enumeration options. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getIncomeFrequency
       * @memberOf IncomeInfoModel
       * @returns deferredObject
       * @example
       * IncomeInfoModel.getIncomeFrequency().then(function (data) {
       *
       * });
       */
      /**
       * GetIncomeFrequency - description.
       *
       * @return {type}  Description.
       */
      getIncomeFrequency: function() {
        fetchFrequencyDeferred = $.Deferred();
        fetchFrequencyOptions(fetchFrequencyDeferred);

        return fetchFrequencyDeferred;
      },
      /**
       * Public method to save passed in income information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf IncomeInfoModel
       * @returns deferredObject
       * @example
       * IncomeInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      /**
       * SaveModel - description.
       *
       * @param  {type} model - Description.
       * @return {type}       Description.
       */
      saveModel: function(model) {
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);

        return saveModelDeferred;
      },
      /**
       * Public method to delete passed in income information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf IncomeInfoModel
       * @returns deferredObject
       * @example
       * IncomeInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      /**
       * DeleteModel - description.
       *
       * @param  {type} incomeId - Description.
       * @return {type}          Description.
       */
      deleteModel: function(incomeId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(incomeId, deleteModelDeferred);

        return deleteModelDeferred;
      }
    };
  };
});
