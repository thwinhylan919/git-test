define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const FinancialPositionModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountsDetailsDeffered;
    const fetchAccountsDetails = function(deffered) {
      const options = {
        url: "accounts",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCreditCardsDetailsDeffered;
    const fetchCreditCardsDetails = function(deffered) {
      const options = {
        url: "accounts/cards/credit?expand=ALL",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchAccountsDetails: function() {
        fetchAccountsDetailsDeffered = $.Deferred();
        fetchAccountsDetails(fetchAccountsDetailsDeffered);

        return fetchAccountsDetailsDeffered;
      },
      fetchCreditCardsDetails: function() {
        fetchCreditCardsDetailsDeffered = $.Deferred();
        fetchCreditCardsDetails(fetchCreditCardsDetailsDeffered);

        return fetchCreditCardsDetailsDeffered;
      }
    };
  };

  return new FinancialPositionModel();
});