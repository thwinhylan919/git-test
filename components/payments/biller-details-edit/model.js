define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const billerModel = function() {
    let id, currentRelNo;
    const Model = function() {
        this.newEditedBillerModel = {
          relationshipNumber: null,
          consumerNumber: null,
          accountRelationshipNumber: null
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getCategoriesDeferred;
    const getCategories = function(deferred) {
      const options = {
        url: "payments/billers?categoryType=ALL",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBillerNamesDeferred;
    const getBillerNames = function(category, deferred) {
      const options = {
        url: "payments/billers?categoryType={category}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        category: category
      };

      baseService.fetch(options, params);
    };
    let editBillerDeferred;
    const editBiller = function(model, deferred) {
      const options = {
        url: "payments/registeredBillers/{id}/relations/{currentRelNo}",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      },
      params = {
        id: id,
        currentRelNo :currentRelNo
      };

      baseService.update(options, params);
    };

    return {
      /**
       * Method to initialize the described model.
       */
      init: function(billerId, currentRelationshipNumber) {
        id = billerId;
        currentRelNo = currentRelationshipNumber;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCategories: function() {
        getCategoriesDeferred = $.Deferred();
        getCategories(getCategoriesDeferred);

        return getCategoriesDeferred;
      },
      getBillerNames: function(category) {
        getBillerNamesDeferred = $.Deferred();
        getBillerNames(category, getBillerNamesDeferred);

        return getBillerNamesDeferred;
      },
      editBiller: function(model) {
        editBillerDeferred = $.Deferred();
        editBiller(model, editBillerDeferred);

        return editBillerDeferred;
      }
    };
  };

  return new billerModel();
});