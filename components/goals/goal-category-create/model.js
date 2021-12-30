define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const goalCategoryCreateModel = function() {
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
    let createCategoryDeferred;
    const createCategory = function(model, deferred) {
      const options = {
        url: "goals/categories",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
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

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getProducts: function() {
        getProductsDeferred = $.Deferred();
        getProducts(getProductsDeferred);

        return getProductsDeferred;
      },
      createCategory: function(payload) {
        createCategoryDeferred = $.Deferred();
        createCategory(payload, createCategoryDeferred);

        return createCategoryDeferred;
      },
      readProduct: function(productId) {
        readProductDeferred = $.Deferred();
        readProduct(productId, readProductDeferred);

        return readProductDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);

        return deleteImageDeffered;
      }
    };
  };

  return new goalCategoryCreateModel();
});