/**
 * Model for rd-details
 * @param {object} BaseService
 * @return {object} rdDetailsModel
 */
define(["baseService"], function(BaseService) {
  "use strict";

  const rdDetailsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchRdDetails -fetches Recurring Deposit details based on account id.
       *
       * @param {string} accountId - Account id to fetch RD account details.
       * @returns {Promise}  Returns the promise object.
       */
      fetchRdDetails: function(accountId) {
        return baseService.fetch({
          url: "accounts/deposit/{accountId};module=RD"
        },{
          accountId:accountId
        });
      },
      /**
       * FetchpayoutInstructions -fetches payout instructions for recurring deposit.
       *
       * @param {string} accountId - Account id to fetch RD payout instructions.
       * @returns {Promise}  Returns the promise object.
       */
      fetchpayoutInstructions: function(accountId) {
        return baseService.fetch({
          url: "accounts/deposit/{accountId}/payOutInstructions;module=RD"
        },{
          accountId:accountId
        });
      },
      /**
       * FetchBankDetails -fetches bank details for recurring deposit.
       *
       * @param {string} url - To fetch RD payout instructions.
       * @returns {Promise}  Returns the promise object.
       */
      fetchBankDetails: function(url) {
        return baseService.fetch({
          url: url
        });
      }
    };
  };

  return new rdDetailsModel();
});