define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for Product Requirements section. This file contains the model definition
   * for product requirements section and exports the Requirements model which can be used
   * as a component in any form in which user's product requirements are required.
   *
   * @namespace Requirements~RequirementsModel
   * @class
   * @property {Object} requestedAmount - Object containing the Requested Amount details
   * @property {string} requestedAmount.currency - ISO currency code of the requested loan amount
   * @property {Float} requestedAmount.amount - The requested loan amount in decimal format
   * @property {Object} requestedTenure - Object containing the Requested Loans Tenure details
   * @property {Integer} requestedTenure.days - Number of days in tenure
   * @property {Integer} requestedTenure.months - Number of months in tenure
   * @property {Integer} requestedTenure.years - Number of years in tenure
   * @property {string} purposeType - The purpose for requiring a loan
   * @property {string} purpose - The purpose for requiring a loan
   * @property {Object} expectedSettlementDate - Object containing the expected settlement date value
   * @property {string} expectedSettlementDate.dateString - the expected settlement date
   * @property {boolean} capitalizeFeesOpted - true if capitalizeFeesOpted is checked
   * @property {boolean} settlementRequired - true if settlementRequired is checked
   * @property {string} frequency - the value of repayment frequency
   * @property {string} noOfCoApplicants - the number of co-applicants of the loan
   * @property {string} facilityId - The generated facility ID for the submission
   * @property {string} productGroupCode - Value of Product Group Code
   * @property {string} productGroupName - Value of Product Group Name
   */
  const RequirementsModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @param  {Object} currency - Parametes passed from the parent component.
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    const Model = function(currency) {
      this.loanRequirement = {
        requestedAmount: {
          currency: "",
          amount: null
        },
        requestedTenure: {
          days: 0,
          months: "",
          years: ""
        },
        capitalizeFeesOpted: false,
        settlementRequired: false,
        purpose: {
          code: ""
        },
        inPrincipalApproval: false,
        purposeType: "",
        frequency: "MONTHLY",
        noOfCoApplicants: "",
        productGroupCode: null,
        productGroupName: null,
        productGroupSerialNumber: null,
        productClass: null,
        productSubClass: null,
        offerId: null,
        productId: null
      };

      this.autoloanRequirement = {
        requestedAmount: {
          currency: "",
          amount: null
        },
        requestedTenure: {
          days: 0,
          months: "",
          years: ""
        },
        capitalizeFeesOpted: false,
        settlementRequired: false,
        purpose: {
          code: ""
        },
        vehicleDetails: {
          address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: ""
          },
          collateralId: "",
          ownership: [{
            partyId: null,
            partyName: null
          }],
          vehicleIdentificationNum: null,
          vehicleMakeType: null,
          vehicleModel: null,
          vehicleSubType: null,
          vehicleType: null,
          vehicleYear: null,
          vehicleNew: "true",
          distanceTravelled: null,
          purchasePrice: {
            currency: currency ? currency : null,
            amount: ""
          }
        },
        submissionId: {
          displayValue: null,
          value: null
        },
        facilityId: null,
        purposeType: "",
        frequency: "MONTHLY",
        noOfCoApplicants: "",
        productGroupCode: null,
        productGroupName: null,
        productGroupSerialNumber: null,
        productClass: null,
        productSubClass: null,
        offerId: null,
        productId: null
      };

      this.homeLoanRequirement = {
        requestedAmount: {
          currency: "",
          amount: null
        },
        requestedTenure: {
          days: 0,
          months: "",
          years: ""
        },
        capitalizeFeesOpted: false,
        settlementRequired: false,
        purpose: {
          name: null,
          description: null,
          code: null
        },
        inPrincipalApproval: false,
        submissionId: {
          displayValue: null,
          value: null
        },
        facilityId: null,
        purposeType: "",
        frequency: "MONTHLY",
        noOfCoApplicants: "",
        productGroupCode: null,
        productGroupName: null,
        productGroupSerialNumber: null,
        productGroupLinkageType: null,
        productClass: null,
        productSubClass: null,
        offerId: null,
        productId: null,
        yourFirstHome: "false",
        propertyDetails: {
          address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: ""
          },
          primaryResidence: false,
          ownership: [{
            partyId: null,
            partyName: null
          }],
          propertySubType: null,
          propertyType: null,
          purchasePrice: {
            currency: currency ? currency : null,
            amount: ""
          }
        },
        selectedValues: {
          propertySubTypeName: "",
          propertyTypeName: "",
          selectedState: "",
          selectedCountry: ""
        }
      };

      this.disableInputs = false;

      this.termRequirement = {
        requestedAmount: {
          currency: "",
          amount: null
        },
        requestedTenure: {
          days: 0,
          months: "",
          years: ""
        },
        currency: currency,
        maturityFactor: "term",
        frequency: "",
        noOfCoApplicants: "",
        productGroupCode: null,
        productGroupName: null,
        productGroupSerialNumber: null,
        productClass: null,
        productSubClass: null,
        offerId: null,
        productId: null
      };

      this.savingsRequirement = {
        currency: "",
        noOfCoApplicants: "",
        productGroupCode: null,
        productGroupName: null,
        productGroupSerialNumber: null,
        productClass: null,
        productSubClass: null,
        offerId: null,
        productId: null
      };

      this.cardRequirement = {
        requestedAmount: {
          currency: currency,
          amount: null
        },
        currency: "",
        grantEmployeeBenefitsApplicable: false,
        maximumLimitRequested: true,
        productGroupCode: null,
        productGroupName: null,
        productGroupSerialNumber: null,
        productClass: null,
        productSubClass: null,
        offerId: null,
        productId: null
      };

      this.coappPreference = {
        emailOpted: false,
        mobileOpted: false
      };
    };
    let params;
    const baseService = BaseService.getInstance();
    /**
     * Method to fetch Purpose Type enumeration data.
     *  deferred object is resolved once the purpose list is successfully fetched
     */
    let createSubmissionDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} payload - Payload used.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const createSubmission = function(payload, deferred) {
      const options = {
        url: "submissions/",
        data: JSON.stringify(payload),
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options, params);
    };
    /**
     * This function is used to get the index of an object in an array
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {object} submissionId - key used for submission
     * @param {object} model - Parametes passed from the parent component
     * @param {object} deferred -  Parametes passed from the parent component
     * @returns {void}
     */
    let updateApplicantDeferred;
    const updateApplicant = function(submissionId, model, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.add(options, params);
    };
    let getAllowedCurrenciesDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} productGroupId - Key used for product Group.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const getAllowedCurrencies = function(productGroupId, deferred) {
      const options = {
          url: "productGroups/{productGroupId}/currencies",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productGroupId: productGroupId
        };

      baseService.fetch(options, params);
    };
    /**
     * This function is used to get the index of an object in an array
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {object} productCode - key used for product
     * @param {object} deferred -  Parametes passed from the parent component
     * @returns {void}
     */
    let fetchLoanPurposeListDeferred;
    const fetchLoanPurposeList = function(productCode, deferred) {
      params = {
        productCode: productCode
      };

      const options = {
        url: "productGroups/{productCode}/purposes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Frequency Options enumeration data.
     * deferred object is resolved once data is fetched
     */
    let fetchFrequencyListDeffered;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} submissionId - Key used for submission.
     * @param {Object} data -  Parametes passed from the parent component.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const fetchFrequencyList = function(submissionId, data, deferred) {
      const options = {
        url: "submissions/{submissionId}/depositApplications/interestFrequencies?currency={baseCurrency}&amount={requestedAmount}&days=0&months={requestedTenureMonths}&years={requestedTenureYears}&offerID={offerId}&productCode={productCodeTD}&productGroupSerialNumber={productGroupSerialNumber}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        submissionId: submissionId,
        baseCurrency: data.baseCurrency,
        requestedAmount: data.requirements.requestedAmount.amount(),
        requestedTenureMonths: data.requirements.requestedTenure.months(),
        requestedTenureYears: data.requirements.requestedTenure.years(),
        offerId: data.offers.offerId,
        productCodeTD: data.productCodeTD,
        productGroupSerialNumber: data.requirements.productGroupSerialNumber
      };

      baseService.fetch(options,params);
    };
    /**
     * Method to fetch Loan repayment amount,
     *deferred object is resolved  once the loan repayment amount is successfully fetched
     */
    let getRepaymentAmountDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} RepaymentAmountRequiredData - Amount of Repayment.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const getRepaymentAmount = function(RepaymentAmountRequiredData, deferred) {
      const options = {
        selfLoader: true,
        url: "calculators/loan/installment",
        data: JSON.stringify(RepaymentAmountRequiredData),
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    /**
     * Method to fetch Co-Applicants Relation,
     *deferred object is resolved once the Co-Applicants Relation amount is successfully fetched
     */
    let fetchOfferDetailsDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} offerId -  Key for offer.
     * @param {Object} productType -  Parametes passed for product.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const fetchOfferDetails = function(offerId, productType, deferred) {
      params = {
        offerId: offerId,
        productType: productType
      };

      const options = {
        url: "offers/{offerId}?productType={productType}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    /* This function will fire batch request for frequency, relation and purposeList and will return response for all of them in sigle request.
     *deferred object corresponding to eacht request is resolved once the request is successfully fetched respectively.
     */
    let fireBatchDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} subRequestList -  List of request.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const fireBatch = function(subRequestList, deferred) {
      const options = {
        headers: {
          BATCH_ID: "2653"
        },
        url: "batch/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {}, subRequestList);
    };
    let submitRequirementsDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} url -  Url used.
     * @param {Object} submissionId - Key used for submission.
     * @param {Object} requirements -  Parametes passed from the parent component.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const submitRequirements = function(url, submissionId, requirements, deferred) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: url,
        data: requirements,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.update(options, params);
    };
    let fetchApplicantDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} submissionId - Key used for submission.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const fetchApplicant = function(submissionId, deferred) {
      params = {
        submissionId: submissionId
      };

      const options = {
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
    let associateOfferDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} submissionId - Key used for submission.
     * @param {Object} productGroupSerialNumber - Key used for productGroup.
     * @param {Object} selectedOfferId -  Parametes passed from the parent component.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const associateOffer = function(submissionId, productGroupSerialNumber, selectedOfferId, deferred) {
      params = {
        submissionId: submissionId,
        productGroupSerialNumber: productGroupSerialNumber
      };

      const options = {
        url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
        data: JSON.stringify({
          offerId: selectedOfferId
        }),
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options, params);
    };
    let fetchRelationsDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const fetchRelations = function(deferred) {
      params = {
        personal: "personal"
      };

      const options = {
        url: "enumerations/relation?type={personal}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let verifyEmailDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} payload - Payload used.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
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
    };
    let getApplicantIdDeferred;
    /**
     * This function is used to get the index of an object in an array.
     *
     * @function getIndex
     * @memberOf AccountSummaryViewModel
     * @param {Object} submissionId - Key used for submission.
     * @param {Object} partyId - Key used for party.
     * @param {Object} payload -  Parametes passed from the parent component.
     * @param {Object} deferred -  Parametes passed from the parent component.
     * @returns {void}
     */
    const getApplicantId = function(submissionId, partyId, payload, deferred) {
      params = {
        submissionId: submissionId,
        partyId: partyId
      };

      const options = {
        url: "submissions/{submissionId}/coApplicants/{partyId}/verificationCode",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options, params);
    };

    return {
      getNewModel: function(currency) {
        return new Model(currency);
      },
      createSubmission: function(payload) {
        createSubmissionDeferred = $.Deferred();
        createSubmission(payload, createSubmissionDeferred);

        return createSubmissionDeferred;
      },
      getAllowedCurrencies: function(productGroupId) {
        getAllowedCurrenciesDeferred = $.Deferred();
        getAllowedCurrencies(productGroupId, getAllowedCurrenciesDeferred);

        return getAllowedCurrenciesDeferred;
      },
      fetchLoanPurposeList: function(payload) {
        fetchLoanPurposeListDeferred = $.Deferred();
        fetchLoanPurposeList(payload, fetchLoanPurposeListDeferred);

        return fetchLoanPurposeListDeferred;
      },
      fetchFrequencyList: function(submissionId, data) {
        fetchFrequencyListDeffered = $.Deferred();
        fetchFrequencyList(submissionId, data, fetchFrequencyListDeffered);

        return fetchFrequencyListDeffered;
      },
      getRepaymentAmount: function(RepaymentAmountRequiredData) {
        getRepaymentAmountDeferred = $.Deferred();
        getRepaymentAmount(RepaymentAmountRequiredData, getRepaymentAmountDeferred);

        return getRepaymentAmountDeferred;
      },
      fetchRelations: function() {
        fetchRelationsDeferred = $.Deferred();
        fetchRelations(fetchRelationsDeferred);

        return fetchRelationsDeferred;
      },
      fireBatch: function(subRequestList) {
        fireBatchDeferred = $.Deferred();
        fireBatch(subRequestList, fireBatchDeferred);

        return fireBatchDeferred;
      },
      updateApplicant: function(submissionId, model) {
        updateApplicantDeferred = $.Deferred();
        updateApplicant(submissionId, model, updateApplicantDeferred);

        return updateApplicantDeferred;
      },
      submitRequirements: function(url, submissionId, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, submissionId, requirements, submitRequirementsDeferred);

        return submitRequirementsDeferred;
      },
      fetchApplicant: function(submissionId) {
        fetchApplicantDeferred = $.Deferred();
        fetchApplicant(submissionId, fetchApplicantDeferred);

        return fetchApplicantDeferred;
      },
      associateOffer: function(submissionId, productGroupSerialNumber, selectedOfferId) {
        associateOfferDeferred = $.Deferred();
        associateOffer(submissionId, productGroupSerialNumber, selectedOfferId, associateOfferDeferred);

        return associateOfferDeferred;
      },
      fetchOfferDetails: function(offerId, productType) {
        fetchOfferDetailsDeferred = $.Deferred();
        fetchOfferDetails(offerId, productType, fetchOfferDetailsDeferred);

        return fetchOfferDetailsDeferred;
      },
      verifyEmail: function(payload) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(payload, verifyEmailDeferred);

        return verifyEmailDeferred;
      },
      getApplicantId: function(submissionId, partyId, payload) {
        getApplicantIdDeferred = $.Deferred();
        getApplicantId(submissionId, partyId, payload, getApplicantIdDeferred);

        return getApplicantIdDeferred;
      }
    };
  };

  return new RequirementsModel();
});
