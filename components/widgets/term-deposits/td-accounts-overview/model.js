define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const TDAccountsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountsDeferred;
    const fetchAccounts = function(deferred) {
      const options = {
        url: "accounts/deposit",
        mockedUrl:"framework/json/design-dashboard/term-deposits/td-accounts-overview.json",
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

  return new TDAccountsModel();
});