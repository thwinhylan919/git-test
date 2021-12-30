define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for Debit card section. This file contains the model definition
   * for Debit cards section and exports the DebitCardModel  which can be used
   * as a component in any form in which user's debit card associated with particular accounts
   * information are required.
   *
   * @namespace DebitCardDetails~DebitCardModel
   * @class
   *@property {Object} baseService -To store the baseService object
   *@property {Object} fetchDebitCardInfoDeferred -To store the deferred object
   */
  const DebitCardModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Method to fetch Debit card information data for specific account id .
     * deferred object is resolved once the accounts information list is successfully fetched
     */
    let fetchDebitCardInfoDeferred;
    const fetchDebitCardInfo = function(accountId, deferred) {
      const params = {
          accountId: accountId
        },options = {
        url: "accounts/demandDeposit/{accountId}/debitCards",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      fetchDebitCardInfo: function(acccountId) {
        fetchDebitCardInfoDeferred = $.Deferred();
        fetchDebitCardInfo(acccountId, fetchDebitCardInfoDeferred);

        return fetchDebitCardInfoDeferred;
      }
    };
  };

  return new DebitCardModel();
});