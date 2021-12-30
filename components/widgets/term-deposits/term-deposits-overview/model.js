define(["baseService"], function(BaseService) {
  "use strict";

  const ListingModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchAccounts: function() {
        const options = {
          url: "accounts/deposit",
          mockedUrl:"framework/json/design-dashboard/term-deposits/td-analysis/accounts.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new ListingModel();
});
