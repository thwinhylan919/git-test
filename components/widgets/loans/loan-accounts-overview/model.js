define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const LoanAccountsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountsDeferred;
    const fetchAccounts = function(deferred) {
      const options = {
        url: "accounts/loan",
        mockedUrl:"framework/json/design-dashboard/loans/loan-accounts-overview.json",
        success: function(data) {
          deferred.resolve(data);
        }
      };

        baseService.fetchWidget(options);

    };

    return {
      fetchAccounts: function() {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);

        return fetchAccountsDeferred;
      }
    };
  };

  return new LoanAccountsModel();
});