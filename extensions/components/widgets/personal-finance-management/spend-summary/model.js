define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SpendSummary = function SpendSummary() {
    const baseService = BaseService.getInstance();
    let getSpendAnalysisDeferred;
    const getSpendAnalysis = function(filter, deferred) {
      const url = "expenditures?isSummary=true" + filter,
      options = {
        url :url,
        mockedUrl:"framework/json/design-dashboard/personal-finance-management/spend-summary.json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetchWidget(options);

    };
    let hostDateDeferred;
    const getHostDate = function(deferred) {
      const options = {
        url: "payments/currentDate",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let persistHostTransactionsLocallyDeferred;
    const persistHostTransactionsLocally = function(deferred) {
      const options = {
        url: "expenditures?spendTransactionType=DDA",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };

    return {
      getSpendAnalysis: function(filter) {
        getSpendAnalysisDeferred = $.Deferred();
        getSpendAnalysis(filter, getSpendAnalysisDeferred);

        return getSpendAnalysisDeferred;
      },
      persistHostTransactionsLocally: function() {
        persistHostTransactionsLocallyDeferred = $.Deferred();
        persistHostTransactionsLocally(persistHostTransactionsLocallyDeferred);

        return persistHostTransactionsLocallyDeferred;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);

        return hostDateDeferred;
      }
    };
  };

  return new SpendSummary();
});