/**
 * Model for review-amend-rd
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
       * Amend RD.
       *
       * @param {Object} data - Payload to be passed to redeem RD.
       * @param {string} accountId - Account id of selected account.
       * @returns {Promise}  Returns the promise object.
       */
        amendRD: function(accountId,data) {
        return baseService.update({
          url: "accounts/deposit/{accountId}",
          data: data
        },{
          accountId :accountId
        });
      }
    };
  };

  return new recurringDepositModel();
});