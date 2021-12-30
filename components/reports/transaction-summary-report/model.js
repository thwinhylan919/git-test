define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reportGenerationModel = function() {
    const Model = function() {
        this.reportParams = {
          startDate: null,
          endDate: null,
          accountNumber: null
        };
      },
      baseService = BaseService.getInstance();
    let fetchAccountsDeferred;
    const fetchAccounts = function(deferred) {
      const options = {
        url: "accounts/demandDeposit?taskCode=RT_N_CUR&locale=en-US",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchAccounts: function() {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);

        return fetchAccountsDeferred;
      }
    };
  };

  return new reportGenerationModel();
});