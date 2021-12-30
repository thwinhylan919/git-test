define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SpendCategories = function SpendCategories() {
    const baseService = BaseService.getInstance();
    let listcategoriesDeferred;
    const listcategories = function(deferred) {
      const options = {
        url: "expenditures/spendUserCategories?expand=ALL",
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
      listcategories: function() {
        listcategoriesDeferred = $.Deferred();
        listcategories(listcategoriesDeferred);

        return listcategoriesDeferred;
      }
    };
  };

  return new SpendCategories();
});
