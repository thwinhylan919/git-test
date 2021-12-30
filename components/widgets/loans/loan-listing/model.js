define(["baseService"], function(BaseService) {
  "use strict";

  const LoanListingModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchLoans: function() {
        const options = {
          url: "accounts/loan?status=ACTIVE",
          mockedUrl:"framework/json/design-dashboard/loans/loan-analysis/accounts.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new LoanListingModel();
});