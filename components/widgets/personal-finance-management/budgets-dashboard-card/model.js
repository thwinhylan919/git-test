define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const budgetDashboardCardModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();
    let getBudgetDetailsDeferred;
    const getBudgetDetails = function(deferred) {
      const options = {
        url: "budget",
        mockedUrl:"framework/json/design-dashboard/personal-finance-management/budgets-dashboard-card.json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetchWidget(options);

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
      getBudgetDetails: function() {
        getBudgetDetailsDeferred = $.Deferred();
        getBudgetDetails(getBudgetDetailsDeferred);

        return getBudgetDetailsDeferred;
      },
      persistHostTransactionsLocally: function() {
        persistHostTransactionsLocallyDeferred = $.Deferred();
        persistHostTransactionsLocally(persistHostTransactionsLocallyDeferred);

        return persistHostTransactionsLocallyDeferred;
      }
    };
  };

  return new budgetDashboardCardModel();
});