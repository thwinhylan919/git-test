define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Create Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsCreateModel
   */
  const ServiceRequestCreateModel = function() {
    const baseService = BaseService.getInstance();
    let fetchCategoryTypesDeferred;
    /**
     * Private method to fetch the Category types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchCategoryTypes
     * @memberOf ErrorModel
     * @param {string} productName - Product name to fetch categories list
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchCategoryTypes = function(productName, deferred) {
      const
        options = {
          url: "servicerequest/products/{productName}/categories",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productName: productName
        };

      baseService.fetch(options, params);
    };
    let fetchTransactionTypesDeferred;
    /**
     * Private method to fetch the task types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchTransactionTypes
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchTransactionTypes = function(deferred) {
      const
        options = {
          url: "enumerations/srFormBuilderRequestTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fetchSeverityDeferred;
    /**
     * Private method to fetch the severity levels created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchSeverity
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSeverity = function(deferred) {
      const
        options = {
          url: "enumerations/priorityType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fetchStatusesDeferred;
    /**
     * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchStatuses
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchStatuses = function(deferred) {
      const
        options = {
          url: "enumerations/srStatus",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let addSRProductDeferred;
    /**
     * Private method to add new product
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function addSRProduct
     * @memberOf ErrorModel
     * @param {Object} data - data for submission
     * @param {Object} deferred - Deferred object
     * @returns {void}
     * @private
     *
     */
    const addSRProduct = function(data, deferred) {
      const
        options = {
          url: "servicerequest/products",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options);
    };
    let addSRCategoryDeferred;
    /**
     * Private method to add new category type
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function addSRCategory
     * @memberOf ErrorModel
     * @param {string} productName - Product name to add a new category
     * @param {Object} data - data for submission
     * @param {Object} deferred - Deferred object
     * @returns {void}
     * @private
     *
     */
    const addSRCategory = function(productName, data, deferred) {
      const
        options = {
          url: "servicerequest/products/{productName}/categories",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productName: productName
        };

      baseService.add(options, params);
    };
    let fetchModuleTypesDeferred;
    /**
     * Private method to fetch the severity levels created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchModuleTypes
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchModuleTypes = function(deferred) {
      const
        options = {
          url: "servicerequest/products",
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
      /**
       * Public method to fetch list of Category Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchCategoryTypes
       * @memberOf ServiceRequestCreateModel
       * @param {string} productName - Product name on basis of which categories are fetched.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.fetchCategoryTypes().done(function(data) {
       *
       *       });
       */
      fetchCategoryTypes: function(productName) {
        fetchCategoryTypesDeferred = $.Deferred();
        fetchCategoryTypes(productName, fetchCategoryTypesDeferred);

        return fetchCategoryTypesDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchStatuses
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);

        return fetchStatusesDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSeverity
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.fetchSeverity().done(function(data) {
       *
       *       });
       */
      fetchSeverity: function() {
        fetchSeverityDeferred = $.Deferred();
        fetchSeverity(fetchSeverityDeferred);

        return fetchSeverityDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchTransactionTypes
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.fetchTransactionTypes().done(function(data) {
       *
       *       });
       */
      fetchTransactionTypes: function() {
        fetchTransactionTypesDeferred = $.Deferred();
        fetchTransactionTypes(fetchTransactionTypesDeferred);

        return fetchTransactionTypesDeferred;
      },
      /**
       * Public method to fetch list of module Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchModuleTypes
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.fetchModuleTypes().done(function(data) {
       *
       *       });
       */
      fetchModuleTypes: function() {
        fetchModuleTypesDeferred = $.Deferred();
        fetchModuleTypes(fetchModuleTypesDeferred);

        return fetchModuleTypesDeferred;
      },
      /**
       * Public method to add product. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function addSRProduct
       * @memberOf ServiceRequestCreateModel
       * @param {Object} data - Data.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.addSRProduct().done(function(data) {
       *
       *       });
       */
      addSRProduct: function(data) {
        addSRProductDeferred = $.Deferred();
        addSRProduct(data, addSRProductDeferred);

        return addSRProductDeferred;
      },
      /**
       * Public method to add category. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function addSRCategory
       * @memberOf ServiceRequestCreateModel
       * @param {string} productName - Product name to store new category.
       * @param {Object} data - Data.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestCreate.addSRCategory().done(function(data) {
       *
       *       });
       */
      addSRCategory: function(productName, data) {
        addSRCategoryDeferred = $.Deferred();
        addSRCategory(productName, data, addSRCategoryDeferred);

        return addSRCategoryDeferred;
      }
    };
  };

  return new ServiceRequestCreateModel();
});