define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Expense Information Model. This file contains the model definition
   * for expense information section and exports the ExpenseInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Expense
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Expense Section using [getNewModel()]{@link ExpenseInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link ExpenseInfoModel.init}</li>
   *              <li>[getNewModel()]{@link ExpenseInfoModel.getNewModel}</li>
   *              <li>[getFrequencyList()]{@link ExpenseInfoModel.getFrequencyList}</li>
   *              <li>[getExistingExpenses()]{@link ExpenseInfoModel.getExistingExpenses}</li>
   *              <li>[saveModel()]{@link ExpenseInfoModel.saveModel}</li>
   *              <li>[deleteModel()]{@link ExpenseInfoModel.deleteModel}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace ExpenseInfo~ExpenseInfoModel
   * @class ExpenseInfoModel
   * @property {string} type - type of expense selected
   * @property {Object} amount - Object containing details of the expense amount entered by the user
   * @property {Float} amount.amount - Decimal value indicating the expense amount entered by the user
   * @property {string} amount.currency - String indicating the expense currency code
   * @property {string} frequency - Frequency of the users expense
   * @property {Integer} applicantPercentage - Value indicating the ownership percentage of the user for the expense
   */
  return function ExpenseInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @function
     * @private
     * @memberOf ExpenseInfoModel
     */
    /**
     * Let Model - description.
     *
     * @return {type}  Description.
     */
    const Model = function() {
        this.type = "";

        this.amount = {
          amount: "",
          currency: ""
        };

        this.frequency = "";
        this.temp_isActive = true;

        this.temp_selectedValues = {
          type: "",
          frequency: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId, profileId,
      getFrequencyListDeferred;
    /**
     * Private method to fetch list of frequency options. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFrequencyList
     * @memberOf ExpenseInfoModel
     * @private
     */
    /**
     * GetFrequencyList - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getFrequencyList = function(deferred) {
      const options = {
        url: "enumerations/originationFinancialFrequency?for=expense",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function() {
          deferred.reject();
        }
      };

      baseService.fetch(options);
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
    let getExistingExpensesDeferred;
    /**
     * Private method to fetch list of existing expenses of the user. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getExistingExpenses
     * @memberOf ExpenseInfoModel
     * @private
     */
    /**
     * GetExistingExpenses - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getExistingExpenses = function(deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses",
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
    let saveModelDeferred;
    /**
     * Private method to save/update the expense data of the user. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModel
     * @memberOf ExpenseInfoModel
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
          applicantId: applicantId,
          profileId: profileId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        },
        modelData = JSON.parse(model);

      if (modelData.expense.id) {
        options.url += "/" + modelData.expense.id;
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
     * Private method to delete the expense data of the user. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function deleteModel
     * @memberOf ExpenseInfoModel
     * @private
     */
    /**
     * DeleteModel - description.
     *
     * @param  {type} expenseId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const deleteModel = function(expenseId, deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses/{expenseId}?profileId={profileId}",
          data: "",
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
          profileId: profileId,
          expenseId: expenseId
        };

      baseService.remove(options, params);
    };

    return {
      /**
       * Method to initialize the described model, this function will take three params
       * and will throw appropriate exception in case no submission / applicantId / profileId are not present.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf ExpenseInfoModel
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
       * Method to get new instance of Expense Information model. This method is a static member
       * of ExpenseInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * ExpenseInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf ExpenseInfoModel
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
       * Public method to fetch list of Frequency options. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getFrequencyList
       * @memberOf ExpenseInfoModel
       * @returns deferredObject
       * @example
       *      ExpenseInfoModel.getFrequencyList().then(function (data) {
       *
       *      });
       */
      /**
       * GetFrequencyList - description.
       *
       * @return {type}  Description.
       */
      getFrequencyList: function() {
        getFrequencyListDeferred = $.Deferred();
        getFrequencyList(getFrequencyListDeferred);

        return getFrequencyListDeferred;
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
       * Public method to fetch list of existing expenses of the user. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingExpenses
       * @memberOf ExpenseInfoModel
       * @returns deferredObject
       * @example
       *      ExpenseInfoModel.getExistingExpenses().then(function (data) {
       *
       *      });
       */
      /**
       * GetExistingExpenses - description.
       *
       * @return {type}  Description.
       */
      getExistingExpenses: function() {
        getExistingExpensesDeferred = $.Deferred();
        getExistingExpenses(getExistingExpensesDeferred);

        return getExistingExpensesDeferred;
      },
      /**
       * Public method to save passed in Expense information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf ExpenseInfoModel
       * @returns deferredObject
       * @example
       * ExpenseInfoModel.saveModel().then(function (data) {
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
       * Public method to delete the Expense information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf ExpenseInfoModel
       * @returns deferredObject
       * @example
       * ExpenseInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      /**
       * DeleteModel - description.
       *
       * @param  {type} expenseId - Description.
       * @return {type}           Description.
       */
      deleteModel: function(expenseId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(expenseId, deleteModelDeferred);

        return deleteModelDeferred;
      }
    };
  };
});
