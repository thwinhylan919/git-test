define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const goalAccountViewModel = function() {
    const Model = function() {
      this.goalAccountCreateModel = {
        id: "",
        partyId: "",
        categoryId: "",
        contentId: {
          value: ""
        },
        subCategoryId: null,
        productId: "",
        availableBalance: {
          amount: "",
          currency: ""
        },
        interestEarned: {
          amount: "",
          currency: ""
        },
        startDate: "",
        account: {
          value: "",
          displayValue: ""
        },
        name: "",
        targetAmount: {
          amount: "",
          currency: ""
        },
        initialDepositAmount: {
          amount: "",
          currency: ""
        },
        initialDepositAccount: {
          value: "",
          displayValue: ""
        },
        interestRate: "",
        tenure: {
          year: 0,
          month: 0,
          day: 0,
          date: ""
        },
        payinDetails: {
          contributionAmount: {
            amount: "",
            currency: ""
          },
          frequency: "",
          debitAccount: {
            value: "",
            displayValue: ""
          },
          startDate: "",
          endDate: ""
        },
        payoutDetails: {
          mode: "",
          amount: {
            amount: "",
            currency: ""
          }
        }
      };

      this.goalCalculatorModel = {
        categoryId: null,
        subCategoryId: null,
        targetAmount: {
          currency: null,
          amount: null
        },
        contributionAmount: null,
        initialDepositAmount: {
          currency: null,
          amount: null
        },
        interestRate: null,
        tenure: {
          year: null,
          month: null,
          day: null,
          date: null
        },
        frequency: null,
        interestAmount: null
      };

      this.goalAccountSIModel = {
        id: null,
        account: {
          displayValue: "",
          value: ""
        },
        partyId: "",
        payinDetails: {
          contributionAmount: {
            amount: null,
            currency: null
          },
          frequency: null,
          debitAccount: {
            value: null,
            displayValue: null
          },
          startDate: null,
          endDate: null
        }
      };
    };
    let modelInitialized = true;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let calculateDeferred;
    const calculate = function(payload, deferred) {
      const options = {
        url: "goals/calculator",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let getProductDeferred;
    const getProduct = function(productId, deferred) {
      const options = {
          url: "goals/products/{productId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productId: productId
        };

      baseService.fetch(options, params);
    };
    let getBankDetailsDCCDeferred;
    const getBankDetailsDCC = function(code, deferred) {
      const options = {
          url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          domesticClearingCodeType: "INDIA",
          domesticClearingCode: code
        };

      baseService.fetch(options, params);
    };
    let startStandingInstructionDeferred;
    const startStandingInstruction = function(goalId, data, deferred) {
      const options = {
          url: "goals/{id}/instruction",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: goalId
        };

      baseService.add(options, params);
    };
    let createGoalDeferred;
    const createGoal = function(model, deferred) {
      const options = {
        url: "goals",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };
    let bancConfigurationDeffered;
    const fetchBankConfiguration = function(deferred) {
      const options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getNetworkTypesDeferred;
    const getNetworkTypes = function(region, deferred) {
      const options = {
          url: "enumerations/networkType?REGION={region}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          region: region
        };

      baseService.fetch(options, params);
    };
    let readCategoryDeferred;
    const readCategory = function(categoryId, deferred) {
      const options = {
          url: "goals/categories/{categoryId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          categoryId: categoryId
        };

      baseService.fetch(options, params);
    };
    let deleteImageDeffered;
    const deleteImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.remove(options, params);
    };
    let fetchMaxSizeDeffered;
    const fetchMaxSize = function(deferred) {
      const options = {
        url: "configurations/base/DocumentConfig/properties/DOCUMENT_SIZE",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let hostDateDeferred;
    const getHostDate = function(deferred) {
        const options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readCategory: function(categoryId) {
        objectInitializedCheck();
        readCategoryDeferred = $.Deferred();
        readCategory(categoryId, readCategoryDeferred);

        return readCategoryDeferred;
      },
      createGoal: function(payload) {
        objectInitializedCheck();
        createGoalDeferred = $.Deferred();
        createGoal(payload, createGoalDeferred);

        return createGoalDeferred;
      },
      getProduct: function(productId) {
        objectInitializedCheck();
        getProductDeferred = $.Deferred();
        getProduct(productId, getProductDeferred);

        return getProductDeferred;
      },
      getBankDetailsDCC: function(code) {
        objectInitializedCheck();
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
      },
      getNetworkTypes: function(region) {
        objectInitializedCheck();
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(region, getNetworkTypesDeferred);

        return getNetworkTypesDeferred;
      },
      calculate: function(payload) {
        objectInitializedCheck();
        calculateDeferred = $.Deferred();
        calculate(payload, calculateDeferred);

        return calculateDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);

        return bancConfigurationDeffered;
      },
      startStandingInstruction: function(goalId, SIPayload) {
        objectInitializedCheck();
        startStandingInstructionDeferred = $.Deferred();
        startStandingInstruction(goalId, SIPayload, startStandingInstructionDeferred);

        return startStandingInstructionDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);

        return deleteImageDeffered;
      },
      fetchMaxSize: function() {
        fetchMaxSizeDeffered = $.Deferred();
        fetchMaxSize(fetchMaxSizeDeffered);

        return fetchMaxSizeDeffered;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);

        return hostDateDeferred;
      }
    };
  };

  return new goalAccountViewModel();
});