define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const newBillerModel = function() {
    const Model = function() {
      this.addBillerModel = {
        registrationDate: null,
        nickName: "",
        relationshipNumber: null,
        billerId: null,
        consumerNumber: null,
        categoryType: null,
        accountRelationshipNumber: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
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
    let getBillerDetailsDeferred;
    const getBillerDetails = function(billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        billerId: billerId,
        relationshipNumber :relationshipNumber
      };

      baseService.fetch(options, params);
    };
    let getHostDateDeferred;
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
    let deleteBillerDeferred;
    const deleteBiller = function(billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      },
      params = {
        billerId: billerId,
        relationshipNumber :relationshipNumber
      };

      baseService.remove(options, params);
    };
    let addNewBillerDeferred;
    const addNewBiller = function(model, deferred) {
      const options = {
        url: "payments/registeredBillers",
        data: model,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let confirmNewBillerDeferred;
    const confirmNewBiller = function(transactionId, trnsactionVersionId, billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      },
      params = {
        billerId: billerId,
        relationshipNumber :relationshipNumber
      };

      if (transactionId) {
        options.headers = {};
        options.headers.TRANSACTION_REFERENCE_NO = transactionId + "#" + trnsactionVersionId;
      }

      baseService.patch(options, params);
    };
    let confirmBillerWithAuthDeferred;
    const confirmBillerWithAuth = function(billerId, relationshipNumber, authKey, deferred) {
        const options = {
          url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}/authentication",
          headers: {
            TOKEN_ID: authKey
          },
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          billerId: billerId,
          relationshipNumber :relationshipNumber
        };

        baseService.update(options, params);
      },
      errors = {
        InitializationException: function() {
          const message = "";

          return message;
        }(),
        ObjectNotInitialized: function() {
          const message = "";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      /**
       * Method to initialize the described model.
       */
      init: function() {
        modelInitialized = true;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCategories: function() {
        objectInitializedCheck();
        getCategoriesDeferred = $.Deferred();
        getCategories(getCategoriesDeferred);

        return getCategoriesDeferred;
      },
      getBillerNames: function(category) {
        objectInitializedCheck();
        getBillerNamesDeferred = $.Deferred();
        getBillerNames(category, getBillerNamesDeferred);

        return getBillerNamesDeferred;
      },
      addNewBiller: function(model) {
        objectInitializedCheck();
        addNewBillerDeferred = $.Deferred();
        addNewBiller(model, addNewBillerDeferred);

        return addNewBillerDeferred;
      },
      confirmNewBiller: function(transactionId, trnsactionVersionId, billerId, relationshipNumber) {
        objectInitializedCheck();
        confirmNewBillerDeferred = $.Deferred();
        confirmNewBiller(transactionId, trnsactionVersionId, billerId, relationshipNumber, confirmNewBillerDeferred);

        return confirmNewBillerDeferred;
      },
      deleteBiller: function(billerId, relationshipNumber) {
        objectInitializedCheck();
        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerId, relationshipNumber, deleteBillerDeferred);

        return deleteBillerDeferred;
      },
      getBillerDetails: function(billerId, relationshipNumber) {
        objectInitializedCheck();
        getBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, relationshipNumber, getBillerDetailsDeferred);

        return getBillerDetailsDeferred;
      },
      confirmBillerWithAuth: function(billerId, relationshipNumber, authKey) {
        objectInitializedCheck();
        confirmBillerWithAuthDeferred = $.Deferred();
        confirmBillerWithAuth(billerId, relationshipNumber, authKey, confirmBillerWithAuthDeferred);

        return confirmBillerWithAuthDeferred;
      },
      getHostDate: function() {
        objectInitializedCheck();
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      }
    };
  };

  return new newBillerModel();
});