define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SpendCategoryLandingModel = function() {
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let getSpendCategoryListDeferred;
    const getSpendCategoryList = function(categoryName, categoryCode, deferred) {
      const options = {
          url: "expenditures/categories?categoryName={categoryName}&categoryCode={categoryCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          categoryName: categoryName,
          categoryCode: categoryCode
        };

      baseService.fetch(options, params);
    };
    let getSubCategoryListDeferred;
    const getSubCategoryList = function(categoryId, deferred) {
      const options = {
          url: "expenditures/categories/{categoryId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          categoryId: categoryId
        };

      baseService.fetch(options, params);
    };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getSpendCategoryList: function(categoryName, categoryCode) {
        getSpendCategoryListDeferred = $.Deferred();
        getSpendCategoryList(categoryName, categoryCode, getSpendCategoryListDeferred);

        return getSpendCategoryListDeferred;
      },
      getSubCategoryList: function(categoryId) {
        getSubCategoryListDeferred = $.Deferred();
        getSubCategoryList(categoryId, getSubCategoryListDeferred);

        return getSubCategoryListDeferred;
      }
    };
  };

  return new SpendCategoryLandingModel();
});