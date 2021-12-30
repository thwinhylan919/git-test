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
    const baseService = BaseService.getInstance();

    return {
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
        },
        {clearingCodeType:clearingCodeType,
          clearingCode:clearingCode});
      },
      /**
       * Function to redeem RD.
       *
       * @param {string} accountId - Account id of selected account.
       * @param {Object} data - Payload to be passed to redeem RD.
       * @returns {Promise}  Returns the promise object.
       */
      redeem: function(accountId, data) {
        return baseService.add({
          url: "accounts/deposit/{accountId}/redemptions",
          data: data
        },{
          accountId :accountId
        });
      }
    };
  };

  return new recurringDepositModel();
});