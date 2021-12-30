define([], function() {
  "use strict";

  const goalCategoryModel = function() {
    const Model = function() {
      this.transferObject = {
        categoryId: null,
        subCategoryId: null,
        categoryName: null,
        productDetails: null,
        goalAmount: null,
        initialAmount: null,
        content: null
      };
    };

    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new goalCategoryModel();
});