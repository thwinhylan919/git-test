/**
 * Model for create-rd
 * @param {object} jquery jquery instance
 * @param {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel  Model instance
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
        this.calculateModel = {
          productId: null,
          maturityAmount: {
            currency: null,
            amount: null
          },
          inflationRate: null,
          tenure: {
            year: null,
            month: null,
            day: "0"
          }
        };

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
            account: "",
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
       * CalculateInstallmentAmount - calculate Installmentamount and date.
       *
       * @param {Object} createRDData  - Payload to be passed to calculate maturity amount and date for RD.
       * @returns {Promise}  Returns the promise object.
       */
      calculateInstallmentAmount: function(createRDData) {
        return baseService.add({
          url: "calculators/deposit/installments",
          data: createRDData
        });
      }
    };
  };

  return new recurringDepositModel();
});