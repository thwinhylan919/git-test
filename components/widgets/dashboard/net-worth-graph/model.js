define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const ListingModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountsDeferred;
    const fetchAccounts = function(deferred) {
      const options = {
        url: "accounts",
        mockedUrl:"framework/json/design-dashboard/dashboard/net-worth-graph/accounts.json",
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
      },
      creditCardDetails: function() {

        return baseService.fetchWidget({
          url: "accounts/cards/credit?expand=ALL",
          mockedUrl:"framework/json/design-dashboard/dashboard/net-worth-graph/cards.json"
        });
      }
    };
  };

  return new ListingModel();
});