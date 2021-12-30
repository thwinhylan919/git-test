define(["baseService"], function(BaseService) {
  "use strict";

  const LoansClosedModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchClosedLoans: function() {
        const options = {
          url: "accounts/loan?status=CLOSED",
          mockedUrl:"framework/json/design-dashboard/loans/loan-analysis/accounts.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new LoansClosedModel();
});