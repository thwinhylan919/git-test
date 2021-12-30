define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function AccountFundingModel() {
    const Model = function() {
      this.isCompleting = true;
      this.disableInputs = false;
      this.interestRate = "";

      this.savingsAccountConfiguration = {
        productGroupSerialNumber: "",
        offerId: "",
        simulationId: null,
        offerCurrency: "",
        accountHolderPreferenceDTO: [{
          debitCardRequired: false,
          embossName: "",
          cardType: "",
          chequeBookRequired: false,
          chequeBookLeaves: "",
          statementRequired: false,
          statementFrequency: ""
        }],
        settlementMode: {
          txnAmount: {
            amount: 0,
            currency: ""
          },
          settlementType: null,
          cardDetails: {
            cardType: null,
            cardName: "",
            aanNumber: "",
            maskedCardNumber: "",
            expiryDate: null,
            cvv: ""
          },
          collectionDetails: {
            counterPartyAccountNo: {
              displayValue: "",
              value: ""
            },
            mandateId: "",
            institutionId: "",
            institutionType: "",
            counterPartyName: ""
          },
          internalAccountSettlementDetailDTO: {
            accountNo: {
              displayValue: "",
              value: ""
            }
          }
        }
      };

      this.selectedValues = {
        aanNumber: "",
        cardType: ""
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId,
      applicantId,
      getFundingOptionsListDeffered;
    const getFundingOptionsList = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/fundingOptions",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchFrequencyListDeffered;
    const fetchFrequencyList = function(data, deferred) {
      const params = {
        submissionId:submissionId,
        baseCurrency:data.baseCurrency,
        amount:data.requirements.requestedAmount.amount,
        days:data.requirements.requestedTenure.days,
        months:data.requirements.requestedTenure.months,
        years:data.requirements.requestedTenure.years,
        offerId:data.offers.offerId,
        productCode:data.offers.offerAdditionalDetails.productCode,
        productGroupSerialNumber: data.requirements.productGroupSerialNumber
      },
     options = {
        url: "submissions/{submissionId}/depositApplications/interestFrequencies?currency={baseCurrency}&amount={amount}&days={days}&months={months}&years={years}&offerID={offerId}&productCode={productCode}&productGroupSerialNumber={productGroupSerialNumber}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let getCasaOwnAccountListDeffered;
    const getCasaOwnAccountList = function(deferred) {
      const params = {
          applicantId: "me"
        },
        options = {
          url: "accounts/demandDeposit",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getExistingAccountConfigDeffered;
    const getExistingAccountConfig = function(deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getLinkedAccountListDeffered;
    const getLinkedAccountList = function(deferred) {
      const params = {
          applicantId: applicantId
        },
        options = {
          url: "parties/{applicantId}/accounts/dda/external",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    let saveModelDeffered;
    const saveModel = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/funding",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.add(options, params);
    };
    let validateAccountConfigDeffered;
    const validateAccountConfig = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.update(options, params);
    };
    let addTDAccountDeffered;
    const addTDAccount = function(model, productGroupSerialNumber, deferred) {
      const params = {
          submissionId: submissionId,
          productGroupSerialNumber: productGroupSerialNumber
        },
        options = {
          url: "submissions/{submissionId}/depositApplications/account",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.add(options, params);
    };
    let fetchOffersAdditionalDetailsDeferred;
    const fetchOffersAdditionalDetails = function(offerId, productType, deferred) {
        const params = {
            offerId: offerId,
            productType: productType
          },
          options = {
            url: "offers/{offerId}?productType={productType}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
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
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getFundingOptionsList: function() {
        objectInitializedCheck();
        getFundingOptionsListDeffered = $.Deferred();
        getFundingOptionsList(getFundingOptionsListDeffered);

        return getFundingOptionsListDeffered;
      },
      fetchFrequencyList: function(data) {
        objectInitializedCheck();
        fetchFrequencyListDeffered = $.Deferred();
        fetchFrequencyList(data, fetchFrequencyListDeffered);

        return fetchFrequencyListDeffered;
      },
      getCasaOwnAccountList: function() {
        objectInitializedCheck();
        getCasaOwnAccountListDeffered = $.Deferred();
        getCasaOwnAccountList(getCasaOwnAccountListDeffered);

        return getCasaOwnAccountListDeffered;
      },
      getLinkedAccountList: function() {
        objectInitializedCheck();
        getLinkedAccountListDeffered = $.Deferred();
        getLinkedAccountList(getLinkedAccountListDeffered);

        return getLinkedAccountListDeffered;
      },
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeffered = $.Deferred();
        saveModel(model, saveModelDeffered);

        return saveModelDeffered;
      },
      getExistingAccountConfig: function() {
        objectInitializedCheck();
        getExistingAccountConfigDeffered = $.Deferred();
        getExistingAccountConfig(getExistingAccountConfigDeffered);

        return getExistingAccountConfigDeffered;
      },
      validateAccountConfig: function(model) {
        objectInitializedCheck();
        validateAccountConfigDeffered = $.Deferred();
        validateAccountConfig(model, validateAccountConfigDeffered);

        return validateAccountConfigDeffered;
      },
      addTDAccount: function(model, productGroupSerialNumber) {
        objectInitializedCheck();
        addTDAccountDeffered = $.Deferred();
        addTDAccount(model, productGroupSerialNumber, addTDAccountDeffered);

        return addTDAccountDeffered;
      },
      fetchOffersAdditionalDetails: function(offerId, productType) {
        objectInitializedCheck();
        fetchOffersAdditionalDetailsDeferred = $.Deferred();
        fetchOffersAdditionalDetails(offerId, productType, fetchOffersAdditionalDetailsDeferred);

        return fetchOffersAdditionalDetailsDeferred;
      }
    };
  };
});
