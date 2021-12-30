define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BudgetList = function BudgetList() {
    const baseService = BaseService.getInstance();
    let modelInitialized = true;
    const Model = function() {
      this.Budget = {
        categoryId: "",
        amount: {
          amount: "",
          currency: ""
        },
        frequency: "Monthly",
        periodicity: "",
        customPeriodicityValue: ""
      };
    };
    let budgetListDeferred;
    const budgetList = function(deferred) {
      const options = {
        url: "budget",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let spendListDeferred;
    const spendList = function(startDate, endDate, deferred) {
      const options = {
          url: "expenditures?isSummary=true&fromDate={startDate}&toDate={endDate}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          startDate: startDate,
          endDate: endDate
        };

      baseService.fetch(options, params);
    };
    let spendCategoryListDeferred;
    const spendCategoryList = function(deferred) {
      const options = {
        url: "expenditures/spendUserCategories",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let createBudgetDeferred;
    const createBudget = function(payload, deferred) {
      const options = {
        url: "budget",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let updateBudgetDeferred;
    const updateBudget = function(payload, categoryId, versionId, budgetId, deferred) {
      const options = {
          url: "budget/{budgetId};categoryId={categoryId};versionId={versionId}",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          budgetId: budgetId,
          categoryId :categoryId,
          versionId :versionId
        };

      baseService.update(options, params);
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
    let deleteBudgetDeferred;
    const deleteBudget = function(budgetId, deferred) {
      const options = {
        url: "budget/{budgetId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          budgetId: budgetId
        };

      baseService.remove(options, params);
    };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      budgetList: function() {
        budgetListDeferred = $.Deferred();
        budgetList(budgetListDeferred);

        return budgetListDeferred;
      },
      spendList: function(startDate, endDate) {
        spendListDeferred = $.Deferred();
        spendList(startDate, endDate, spendListDeferred);

        return spendListDeferred;
      },
      spendCategoryList: function() {
        spendCategoryListDeferred = $.Deferred();
        spendCategoryList(spendCategoryListDeferred);

        return spendCategoryListDeferred;
      },
      createBudget: function(payload) {
        createBudgetDeferred = $.Deferred();
        createBudget(payload, createBudgetDeferred);

        return createBudgetDeferred;
      },
      updateBudget: function(payload, categoryId, versionId, budgetId) {
        updateBudgetDeferred = $.Deferred();
        updateBudget(payload, categoryId, versionId, budgetId, updateBudgetDeferred);

        return updateBudgetDeferred;
      },
      deleteBudget: function(budgetId) {
        deleteBudgetDeferred = $.Deferred();
        deleteBudget(budgetId, deleteBudgetDeferred);

        return deleteBudgetDeferred;
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);

        return hostDateDeferred;
      }
    };
  };

  return new BudgetList();
});
