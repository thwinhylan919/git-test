define([
  "baseService"
], function(BaseService) {
  "use strict";

  const FinancialPositionModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchCreditCardsDetails: function() {
        const options = {
          url: "accounts/cards/credit?expand=ALL",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/financial-position.json"
        };

        return baseService.fetchWidget(options);
      },
      fetchAccountsDetails: function() {
        const options = {
          url: "accounts",
          mockedUrl: "framework/json/design-dashboard/accounts/demand-deposit.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new FinancialPositionModel();
});
