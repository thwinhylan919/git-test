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
     * @pamallik {Object} modelData - An model Data type Deferred
     * @class Model
     * @memberOf IncomeInfoModel
     * @private
     */
    const Model = function(modelData) {
        this.type = modelData ? modelData.type : "";
        this.frequency = modelData ? modelData.frequency : "YEARLY";

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
      };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let modelStateChanged = true,
      submissionId, applicantId, profileId, fetchExistingIncomesDeferred;
    /**
     * Private method to fetch existing liabilities for the user, this method will
     * only be called if applicant and profile ids are present, and will resolve a
     * passeddeferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchExistingIncomes
     * @memberOf IncomeInfoModel
     * @pamallik {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    const fetchExistingIncomes = function(deferred) {
      modelStateChanged = false;

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
     * @pamallik {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    const fetchIncomeOptions = function(deferred) {
      const options = {
        url: "financialTemplate?partyType=Individual&parameterType=Income",
        success: function(data) {
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
     * @pamallik {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    const fetchFrequencyOptions = function(deferred) {
      const options = {
        url: "enumerations/frequency?for={type}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
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
     * @pamallik {String} deferred - deferred Object
     * @returns {void}
     * @private
     */
    const fetchOccupationType = function(deferred) {
      const options = {
        url: "enumerations/employmentType?partyType=Individual",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    let saveOccupationModelDeferred, createApplicantDeferred;
    /**
     * Private method to create an applicant based on passed model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function createApplicant
     * @memberOf PrimaryInfoModel
     * @pamallik {String} model - data from parent componet
     * @pamallik {String} deferred - data from parent componet
     * @returns {void}
     * @private
     */
    const createApplicant = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
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
     * @pamallik {String} model - model for current user
     * @pamallik {Object} deferred - An object type Deferred
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
    let deleteModelDeferred;
    /**
     * Private method to delete passed liabilities information model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function deleteModel
     * @memberOf IncomeInfoModel
     * @pamallik {String} id - id for current user
     * @pamallik {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    const deleteModel = function(id, deferred) {
        modelStateChanged = true;

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
        InvalidProfileId: function() {
          let message = "";

          message += "\nNo profile id found, please make sure profile id is present while initializing the model. ";
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
      /**
       * ObjectInitializedCheck - method to check whether variables are initialized or not.
       *
       * @return {Object}  Void.
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
       * @pamallik {String} subId - submission id for current application
       * @pamallik {String} applId - applicant id for current user
       * @pamallik {String} profId - prof id
       * @returns {Object} ModelInitialized.
       * @function init
       * @memberOf IncomeInfoModel
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        modelInitialized = true;

        if (applicantId) {
          this.getExistingIncomes();
        }

        return modelInitialized;
      },
      /**
       * Method to get new instance of Income Information model. This method is a static member
       * of IncomeInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IncomeInfoModel.Model} (private to
       * this class) and return a new instance of same.
       *
       * @function getNewModel
       * @pamallik {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf IncomeInfoModel
       * @returns {Object} Model
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
       * @function getExistingIncomes
       * @memberOf IncomeInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * IncomeInfoModel.getExistingIncomes().then(function (data) {
       *
       * });
       */
      getExistingIncomes: function() {
        objectInitializedCheck();

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        if (modelStateChanged) {
          fetchExistingIncomesDeferred = $.Deferred();

          $.when(fetchIncomeOptionsDeferred, fetchFrequencyDeferred).done(function() {
            fetchExistingIncomes(fetchExistingIncomesDeferred);
          });
        }

        return fetchExistingIncomesDeferred;
      },
      /**
       * Public method to fetch supported income list for loan application. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getIncomeOptions
       * @memberOf IncomeInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * IncomeInfoModel.getIncomeOptions().then(function (data) {
       *
       * });
       */
      getIncomeOptions: function() {
        objectInitializedCheck();
        fetchIncomeOptionsDeferred = $.Deferred();
        fetchIncomeOptions(fetchIncomeOptionsDeferred);

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
       * @returns {Object} DeferredObject.
       * @example
       * IncomeInfoModel.getIncomeFrequency().then(function (data) {
       *
       * });
       */
      getIncomeFrequency: function() {
        objectInitializedCheck();
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
       * @pamallik {String} model - data for applicaton
       * @returns {Object} An object of type deferred.
       * @example
       * IncomeInfoModel.saveModel().then(function (data) {
       *
       * });
       */
      saveModel: function(model) {
        objectInitializedCheck();
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
       * @pamallik {String} incomeId - income id for applicaton
       * @returns {Object} An object of type deleteModelDeferred.
       * @example
       * IncomeInfoModel.deleteModel().then(function (data) {
       *
       * });
       */
      deleteModel: function(incomeId) {
        objectInitializedCheck();
        deleteModelDeferred = $.Deferred();
        deleteModel(incomeId, deleteModelDeferred);

        return deleteModelDeferred;
      },
      getOccupationType: function() {
        objectInitializedCheck();
        fetchOccupationTypeDeferred = $.Deferred();
        fetchOccupationType(fetchOccupationTypeDeferred);

        return fetchOccupationTypeDeferred;
      },
      createApplicant: function(payload) {
        objectInitializedCheck();
        createApplicantDeferred = $.Deferred();
        createApplicant(payload, createApplicantDeferred);

        return createApplicantDeferred;
      },
      createEmploymentProfile: function(data) {
        objectInitializedCheck();
        saveOccupationModelDeferred = $.Deferred();
        saveModel(data, saveOccupationModelDeferred);

        return saveOccupationModelDeferred;
      }
    };
  };
});