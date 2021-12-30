define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const goalCategoryViewModel = function() {
    const Model = function() {
        this.goalCategoryModel = {
          categoryCode: null,
          categoryName: null,
          productId: null,
          expiryDate: null,
          parentCategory: null,
          categoryId: null,
          contentId: null,
          status: null,
          subCategories: null
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let readCategoryDeferred;
    const readCategory = function(categoryId, deferred) {
      const options = {
          url: "goals/categories/{categoryId}",
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
    let getProductsDeferred;
    const getProducts = function(deferred) {
      const options = {
        url: "goals/products",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };
    let readProductDeferred;
    const readProduct = function(productId, deferred) {
      const options = {
          url: "goals/products/{productId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productId: productId
        };

      baseService.fetch(options, params);
    };
    let updateCategoryDeferred;
    const updateCategory = function(model, categoryId, deferred) {
      const options = {
          url: "goals/categories/{categoryId}",
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
    let retrieveImageDeffered;
    const retrieveImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(options, params);
    };
    let deleteImageDeffered;
    const deleteImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.remove(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      updateCategory: function(payload, categoryId) {
        updateCategoryDeferred = $.Deferred();
        updateCategory(payload, categoryId, updateCategoryDeferred);

        return updateCategoryDeferred;
      },
      getProducts: function() {
        getProductsDeferred = $.Deferred();
        getProducts(getProductsDeferred);

        return getProductsDeferred;
      },
      readCategory: function(categoryId) {
        readCategoryDeferred = $.Deferred();
        readCategory(categoryId, readCategoryDeferred);

        return readCategoryDeferred;
      },
      readProduct: function(productId) {
        readProductDeferred = $.Deferred();
        readProduct(productId, readProductDeferred);

        return readProductDeferred;
      },
      retrieveImage: function(id) {
        retrieveImageDeffered = $.Deferred();
        retrieveImage(id, retrieveImageDeffered);

        return retrieveImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);

        return deleteImageDeffered;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      }
    };
  };

  return new goalCategoryViewModel();
});