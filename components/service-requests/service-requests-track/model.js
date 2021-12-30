define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Track Model. This file contains the model definition
   * for list of product names and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsTrackModel
   */
  const ServiceRequestsTrackModel = function() {
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
    let fetchDataDeferred;
    /**
     * Private method to fetch the service requests created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchData
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {string} productName - product name
     * @param {string} category - category name
     * @param {string} fromDate - form date
     * @param {string} toDate - to date
     * @param {string} status - status
     * @param {Object} deferred - deferred object
     */
    const fetchData = function(productName, category, fromDate, toDate, status, deferred) {
      const option = {
          url: "servicerequest?product={productName}&categoryType={category}&fromDate={fromDate}&toDate={toDate}&status={status}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          productName: productName,
          category: category,
          fromDate: fromDate,
          toDate: toDate,
          status: status
        };

      baseService.fetch(option, params);
    };
    let readDataDeferred;
    /**
     * Private method to fetch the service request details based on service request Id
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function readData
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {string} id - service request id for request to be read
     * @param {Object} deferred - An object type deferred
     */
    const readData = function(id, deferred) {
      const option = {
          url: "servicerequest/{id}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(option, params);
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
    let fetchProductNamesDeferred;
    /**
     * Private method to fetch the product names (module types)
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchProductNames
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchProductNames = function(deferred) {
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
    let fetchRequestTypeDeferred;
    /**
     * Private method to fetch the request types
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchRequestType
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchRequestType = function(deferred) {
      const
        options = {
          url: "enumerations/srRequestType",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
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
       * @memberOf ServiceRequestsTrackModel
       * @param {string} productName - Product name on basis of which categories are fetched.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrack.fetchCategoryTypes().done(function(data) {
       *
       *       });
       */
      fetchCategoryTypes: function(productName) {
        fetchCategoryTypesDeferred = $.Deferred();
        fetchCategoryTypes(productName, fetchCategoryTypesDeferred);

        return fetchCategoryTypesDeferred;
      },
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchData
       * @memberOf ServiceRequestsTrackModel
       * @param {string} productName - Product name.
       * @param {string} category - Category name.
       * @param {string} fromDate - Form date.
       * @param {string} toDate - To date.
       * @param {string} status - Status.
       * @param {Object} - - Deferred object.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrack.fetchData().done(function(data) {
       *
       *       });
       */
      fetchData: function(productName, category, fromDate, toDate, status) {
        fetchDataDeferred = $.Deferred();
        fetchData(productName, category, fromDate, toDate, status, fetchDataDeferred);

        return fetchDataDeferred;
      },
      /**
       * Public method to read Service Request details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function readData
       * @memberOf ServiceRequestsTrackModel
       * @param {string} id - Id of service request.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrack.readData().done(function(data) {
       *
       *       });
       */
      readData: function(id) {
        readDataDeferred = $.Deferred();
        readData(id, readDataDeferred);

        return readDataDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchStatuses
       * @memberOf ServiceRequestTrackModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrack.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);

        return fetchStatusesDeferred;
      },
      /**
       * Public method to fetch list of Module Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchProductNames
       * @memberOf ServiceRequestsTrackModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrack.fetchProductNames().done(function(data) {
       *
       *       });
       */
      fetchProductNames: function() {
        fetchProductNamesDeferred = $.Deferred();
        fetchProductNames(fetchProductNamesDeferred);

        return fetchProductNamesDeferred;
      },
      /**
       * Public method to fetch list of request types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchRequestType
       * @memberOf ServiceRequestsTrackModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrack.fetchRequestType().done(function(data) {
       *
       *       });
       */
      fetchRequestType: function() {
        fetchRequestTypeDeferred = $.Deferred();
        fetchRequestType(fetchRequestTypeDeferred);

        return fetchRequestTypeDeferred;
      }
    };
  };

  return new ServiceRequestsTrackModel();
});