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
    const Model = function(modelData) {
        this.type = modelData ? modelData.type : "";
        this.frequency = modelData ? modelData.frequency : "ANNUALLY";

        this.grossAmount = {
          amount: modelData ? modelData.grossAmount.amount : 0,
          currency: ""
        };

        this.netAmount = {
          amount: modelData ? modelData.netAmount.amount : 0,
          currency: ""
        };

        this.ownershipPercentage = modelData ? modelData.ownershipPercentage : 100;
        this.source = "cash";
        this.temp_isActive = !modelData;

        this.temp_selectedValues = {
          type: "",
          frequency: ""
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId, profileId, fetchExistingIncomesDeferred, modelInitialized = false;
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
    const fetchExistingIncomes = function(deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/incomes?profileId={profileId}",
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
    const fetchIncomeOptions = function(productSubClass, deferred) {
      const options = {
          url: "financialTemplate?applicantType=Individual&parameterType=Income&productSubClass={productSubClass}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          productSubClass: productSubClass
        };

      baseService.fetch(options, params);
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
    const fetchFrequencyOptions = function(deferred) {
      const options = {
        url: "enumerations/frequency",
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
     * @memberOf IncomeInfoModel
     * @private
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
    let saveEmploymentModelDeferred;
    /**
     * Private method to save passed occupation information model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveEmploymentModel
     * @memberOf IncomeInfoModel
     * @private
     */
    const saveEmploymentModel = function(model, deferred) {
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
    let fetchOccupationTypeDeferred;
    /**
     * Private method to fetch enumeration data for occupation type, this method will
     * only be called if applicant and profile ids are present, and will resolve a
     * passeddeferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchOccupationType
     * @memberOf IncomeInfoModel
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
    let saveApplicantDeferred;
    /**
     * Private method to create an applicant based on passed model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveApplicant
     * @memberOf IncomeInfoModel
     * @private
     */
    const saveApplicant = function(model, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants/personalInformation",
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
     * Private method to delete passed liabilities information model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function deleteModel
     * @memberOf IncomeInfoModel
     * @private
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
       * @param {string} subId - Submission id for current application.
       * @param {string} applId - Applicant id for current user.
       * @function init
       * @memberOf IncomeInfoModel
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;
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
       * @memberOf IncomeInfoModel
       * @returns Model
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
       * @returns DeferredObject.
       * @example
       * IncomeInfoModel.fetchExistingIncomes().then(function (data) {
       *
       * });
       */
      fetchExistingIncomes: function() {
        fetchExistingIncomesDeferred = $.Deferred();
        fetchExistingIncomes(fetchExistingIncomesDeferred);

        return fetchExistingIncomesDeferred;
      },
      fetchEmployments: function(submissionId, applicantId) {
        fetchEmploymentsDeferred = $.Deferred();
        fetchEmployments(submissionId, applicantId, fetchEmploymentsDeferred);

        return fetchEmploymentsDeferred;
      },
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
       * @returns DeferredObject.
       * @example
       * IncomeInfoModel.fetchIncomeOptions().then(function (data) {
       *
       * });
       */
      fetchIncomeOptions: function(productSubClass) {
        fetchIncomeOptionsDeferred = $.Deferred();
        fetchIncomeOptions(productSubClass, fetchIncomeOptionsDeferred);

        return fetchIncomeOptionsDeferred;
      },
      /**
       * Public method to fetch income frequency's enumeration options. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getIncomeFrequency
       * @memberOf IncomeInfoModel
       * @returns DeferredObject.
       * @example
       * IncomeInfoModel.getIncomeFrequency().then(function (data) {
       *
       * });
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
      setApplicantId: function(applId) {
        applicantId = applId;
      },
      /**
       * Public method to delete passed in income information model. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf IncomeInfoModel
       * @returns DeferredObject.
       * @example
       * IncomeInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      deleteModel: function(incomeId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(incomeId, deleteModelDeferred);

        return deleteModelDeferred;
      },
      getOccupationType: function() {
        fetchOccupationTypeDeferred = $.Deferred();
        fetchOccupationType(fetchOccupationTypeDeferred);

        return fetchOccupationTypeDeferred;
      },
      createApplicant: function(payload) {
        saveApplicantDeferred = $.Deferred();
        saveApplicant(payload, saveApplicantDeferred);

        return saveApplicantDeferred;
      },
      createEmploymentProfile: function(data) {
        saveEmploymentModelDeferred = $.Deferred();
        saveEmploymentModel(data, saveEmploymentModelDeferred);

        return saveEmploymentModelDeferred;
      }
    };
  };
});