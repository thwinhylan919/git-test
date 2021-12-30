define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const LoanAnalysisModel = function() {
    const baseService = BaseService.getInstance();
    let fetchBankConfigDeferred;
    const fetchBankConfig = function(deferred) {
      const options = {
        url: "bankConfiguration",
        mockedUrl:"framework/json/design-dashboard/loans/loan-analysis/bank-config.json",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchWidget(options);

    };
    let fetchAccountDataDeferred;
    const fetchAccountData = function(deferred) {
      const options = {
        url: "accounts/loan?status=ACTIVE",
        mockedUrl:"framework/json/design-dashboard/loans/loan-analysis/accounts.json",
        success: function(data) {
          deferred.resolve(data);
        }
      };

        baseService.fetchWidget(options);

    };

    return {
      fetchBankConfig: function() {
        fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);

        return fetchBankConfigDeferred;
      },
      fetchAccountData: function() {
        fetchAccountDataDeferred = $.Deferred();
        fetchAccountData(fetchAccountDataDeferred);

        return fetchAccountDataDeferred;
      }
    };
  };

  return new LoanAnalysisModel();
});