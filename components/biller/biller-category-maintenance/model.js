define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const newCategoryMaintenanceModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let addCategoriesDeferred;
    const addCategories = function(categoryModel, deferred) {
      const options = {
        data: categoryModel,
        url: "payments/billerCategories",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let deleteCategoryDeferred;
    const deleteCategory = function(categoryId, deferred) {
      const options = {
        url: "payments/billerCategories/{categoryId}",
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

      baseService.remove(options, params);
    };

    return {
      addCategories: function(categoryModel) {
        addCategoriesDeferred = $.Deferred();
        addCategories(categoryModel, addCategoriesDeferred);

        return addCategoriesDeferred;
      },
      deleteCategory: function(categoryId) {
        deleteCategoryDeferred = $.Deferred();
        deleteCategory(categoryId, deleteCategoryDeferred);

        return deleteCategoryDeferred;
      }
    };
  };

  return new newCategoryMaintenanceModel();
});