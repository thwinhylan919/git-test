define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const DemandDepositAnalysisModel = function() {
    const baseService = BaseService.getInstance();
    let fetchBankConfigDeferred;
    const fetchBankConfig = function(deferred) {
      const options = {
        url: "bankConfiguration",
        mockedUrl:"framework/json/design-dashboard/demand-deposits/demand-deposit-analysis/bank-config.json",
        success: function(data) {
          deferred.resolve(data);
        }
      };

        baseService.fetchWidget(options);

    };
    let fetchDemandDepositAccountsDeferred;
    const fetchDemandDepositAccounts = function(deferred) {
      const options = {
        url: "accounts/demandDeposit",
        mockedUrl:"framework/json/design-dashboard/demand-deposits/demand-deposit-analysis/accounts.json",
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
      fetchDemandDepositAccounts: function() {
        fetchDemandDepositAccountsDeferred = $.Deferred();
        fetchDemandDepositAccounts(fetchDemandDepositAccountsDeferred);

        return fetchDemandDepositAccountsDeferred;
      }
    };
  };

  return new DemandDepositAnalysisModel();
});