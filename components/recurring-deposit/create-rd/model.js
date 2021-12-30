/**
 * Model for create-rd
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel Modal instance
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const recurringDepositModel = function() {
    /**
     * In case more than one instance of recurringDepositModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    const Model = function() {
        this.createRDModel = {
          partyName: null,
          module: null,
          partyId: null,
          holdingPattern: null,
          productDTO: {
            productId: null,
            name: null,
            depositProductModule: null
          },
          parties: [],
          maturityAmount: {
            currency: null,
            amount: null
          },
          maturityDate: null,
          interestRate: null,
          principalAmount: {
            currency: null,
            amount: null
          },
          tenure: {
            days: "0",
            months: null,
            years: null
          },
          payoutInstructions: [{
            accountId: {
              displayValue: null,
              value: null
            },
            account: null,
            branchId: null,
            percentage: 100,
            type: null,
            beneficiaryName: null,
            bankName: null,
            address: {
              line1: null,
              line2: null,
              city: null,
              country: null
            },
            networkType: null,
            clearingCode: null,
            payoutComponentType: "P"
          }],
          payInInstruction: [{
            accountId: {
              displayValue: null,
              value: null
            },
            branchId: null,
            percentage: 100
          }],
          rollOverType: "A",
          nomineeDTO: null
        };

        this.addNomineeModel = {
          accountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          accountModule: "RD",
          dateOfBirth: null,
          name: null,
          relation: null,
          minor: false,
          address: {
            country: null,
            state: null,
            city: null,
            zipCode: null,
            line1: null,
            line2: null
          }
        };
      },
      baseService = BaseService.getInstance();

    return {
      /**
       * Method to get new modal instance.
       *
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function() {
        return new Model();
      },
      /**
       * FetchAccountData - fetches account listing.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchAccountData: function() {
        return baseService.fetch({
          url: "accounts/demandDeposit"
        });
      },
      /**
       * Function to create nominee at the time of rd creation.
       *
       * @param {Object} payload  - An object containg the data to be sent to host.
       * @returns {Promise}  Returns the promise object.
       */
      confirmAddNominee: function(payload) {
          return baseService.add({
              url: "nominee",
              data: payload
          });
      },
      /**
       * FetchBranch -fetches branch details.
       *
       * @param {string} clearingCodeType - Clearing code type of the code to be verified.
       * @param {string} clearingCode - Clearing code to be verified.
       * @returns {Promise}  Returns the promise object.
       */
      fetchBranch: function(clearingCodeType, clearingCode) {
        return baseService.fetch({
          url: "financialInstitution/domesticClearingDetails/{clearingCodeType}/{clearingCode}"
        },{
          clearingCodeType:clearingCodeType,
          clearingCode:clearingCode
        });
      },
      /**
       * GetProductList - fetches product list.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getProductList: function() {
        return baseService.fetch({
          url: "products/deposit?productModule=RD&depositProductType=CON"
        });
      },
      /**
       * GetProductList - fetches payout options list.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getPayOutOptionList: function() {
        return baseService.fetch({
          url: "enumerations/payOutOption"
        });
      },
      /**
       * Fetches currentDate.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getHostDate: function() {
        return baseService.fetch({
          url: "payments/currentDate"
        });
      },
      /**
       * CalculateMaturityAmount - calculate maturity amount and date.
       *
       * @param {Object} createRDData - Payload to be passed to calculate maturity amount and date for RD.
       * @returns {Promise}  Returns the promise object.
       */
      calculateMaturityAmount: function(createRDData) {
        return baseService.add({
          url: "accounts/deposit/maturityAmount",
          data: createRDData
        });
      },
      /**
       * GetrollOverTypeList - fetches rollover type list.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getrollOverTypeList: function() {
        return baseService.fetch({
          url: "enumerations/rollOverType"
        });
      },
      /**
       * Function to create RD.
       *
       * @param {Object} data - Payload to be passed to create RD.
       * @param {boolean} isSimulated - Flag to simulate and validate given request payload.
       * @returns {Promise}  Returns the promise object.
       */
       openRd: function (data, isSimulated) {
        const options = {
          url: "accounts/deposit",
          data: data
        };

        options.headers = {};

        if (isSimulated) {
         options.headers["X-Validate-Only"] = "Y";
        }

       return baseService.add(options);
      }
    };
  };

  return new recurringDepositModel();
});