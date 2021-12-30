define(["baseService"], function(BaseService) {
  "use strict";

  const ListingModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchAccounts: function() {
        const options = {
          url: "accounts/demandDeposit",
          mockedUrl:"framework/json/design-dashboard/demand-deposits/demand-deposit-list/accounts.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new ListingModel();
});
