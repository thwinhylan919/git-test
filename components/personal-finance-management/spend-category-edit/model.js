define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const spendCategoryModel = function spendCategoryModel() {
    const Model = function() {
        this.spendCategoryDTO = {
          code: null,
          name: null,
          description: null,
          contentId: null,
          categoryId: null,
          subCategoryList: []
        };
      },
      baseService = BaseService.getInstance();
    let editCategoryDeferred;
    const editCategory = function(model, categoryId, deferred) {
      const options = {
        url: "expenditures/spendUserCategories/{categoryId}",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      },
        params = {
          categoryId: categoryId
        };

      baseService.update(options, params);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      editCategory: function(model, categoryId) {
        editCategoryDeferred = $.Deferred();
        editCategory(model, categoryId, editCategoryDeferred);

        return editCategoryDeferred;
      }
    };
  };

  return new spendCategoryModel();
});
