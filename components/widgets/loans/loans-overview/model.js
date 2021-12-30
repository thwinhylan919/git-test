define(["baseService"], function(BaseService) {
  "use strict";

  const ListingModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getLoanAccounts: function() {
        const options = {
          url: "accounts/loan",
          mockedUrl:"framework/json/design-dashboard/loans/loan-portfolio.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new ListingModel();
});
