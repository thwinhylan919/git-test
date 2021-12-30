define([
  "baseService"
], function (BaseService) {
  "use strict";

  const FinancialSummaryModel = function () {
    let params;
    const baseService = BaseService.getInstance();

    return {
      getAccountDetails: function () {
        const options = {
          url: "accounts",
          mockedUrl: "framework/json/design-dashboard/accounts/demand-deposit.json",
          selfLoader: true
        };

        return baseService.fetchWidget(options);
      },
      downloadAccounts: function (accountType) {
        params = {
          accountType: accountType
        };

        const options = {
          url: "accounts/{accountType}?media=application/pdf"
        };

        return baseService.downloadFile(options, params);
      }
    };
  };

  return new FinancialSummaryModel();
});