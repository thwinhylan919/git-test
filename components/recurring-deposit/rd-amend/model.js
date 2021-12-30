/**
 * Model for rd-amend
 * @param {object} BaseService base service instance for server communication
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
        this.amendModel = {
          rollOverType: "A",
          module: "RD",
          payoutInstructions: [{
            accountId: {
              displayValue: null,
              value: null
            },
            account: "",
            branchId: null,
            id: null,
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
            clearingCode: null,
            networkType: null,
            payoutComponentType: "P"
          }]
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
       * GetPayOutOptionList - fetches payout options list.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getPayOutOptionList: function() {
        return baseService.fetch({
          url: "enumerations/payOutOption"
        });
      }
    };
  };

  return new recurringDepositModel();
});